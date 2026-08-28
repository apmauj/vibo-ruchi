// particles3d.js — Partículas 3D (GPU points) + ondas de choque
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { gridToWorld } from './scene3d.js';
const P = CONFIG.particles;
function makeParticleTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 1, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}
export class Particles3D {
  constructor(scene) {
    this.scene = scene; this.max = P.max;
    this.positions = new Float32Array(this.max * 3);
    this.velocities = new Float32Array(this.max * 3);
    this.colors = new Float32Array(this.max * 3);
    this.life = new Float32Array(this.max);
    this.decay = new Float32Array(this.max);
    this.sizes = new Float32Array(this.max);
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
    this.geometry.setAttribute('life', new THREE.BufferAttribute(this.life, 1));
    this.material = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTex: { value: makeParticleTexture() } },
      vertexShader: `attribute float size; attribute float life; varying vec3 vColor; varying float vLife;
        void main() { vColor = color; vLife = life; vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * life * (140.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform sampler2D uTex; varying vec3 vColor; varying float vLife;
        void main() { vec4 tex = texture2D(uTex, gl_PointCoord); gl_FragColor = vec4(vColor, tex.a * vLife); }`,
      vertexColors: true,
    });
    this.points = new THREE.Points(this.geometry, this.material);
    this.points.frustumCulled = false; scene.add(this.points);
    this.cursor = 0; this._color = new THREE.Color(); this._initShockwaves();
  }
  _initShockwaves() {
    this.shockwaves = []; this._ringGeo = new THREE.RingGeometry(0.55, 0.72, 48);
    for (let i = 0; i < 8; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
      const mesh = new THREE.Mesh(this._ringGeo, mat); mesh.rotation.x = -Math.PI / 2; mesh.visible = false;
      this.scene.add(mesh); this.shockwaves.push({ mesh, t: 1, duration: 0.6, maxScale: 4.2 });
    }
    this._swCursor = 0;
  }
  emitShockwave(gx, gy, colorHex = 0x7cf7ec, scale = 1) {
    const sw = this.shockwaves[this._swCursor]; this._swCursor = (this._swCursor + 1) % this.shockwaves.length;
    const w = this._worldFromGrid(gx, gy, 0.12); sw.mesh.position.copy(w);
    sw.mesh.material.color.setHex(colorHex); sw.mesh.visible = true; sw.t = 0; sw.duration = 0.6; sw.maxScale = 4.2 * scale;
  }
  _updateShockwaves(dt) {
    for (const sw of this.shockwaves) {
      if (!sw.mesh.visible) continue;
      sw.t += dt / sw.duration;
      if (sw.t >= 1) { sw.mesh.visible = false; continue; }
      const e = 1 - Math.pow(1 - sw.t, 3);
      sw.mesh.scale.setScalar(0.3 + e * sw.maxScale); sw.mesh.material.opacity = (1 - sw.t) * 0.85;
    }
  }
  _spawn(x, y, z, vx, vy, vz, colorHex, size, lifeSec) {
    const i = this.cursor; this.cursor = (this.cursor + 1) % this.max;
    this.positions[i*3]=x; this.positions[i*3+1]=y; this.positions[i*3+2]=z;
    this.velocities[i*3]=vx; this.velocities[i*3+1]=vy; this.velocities[i*3+2]=vz;
    this._color.setHex(colorHex);
    this.colors[i*3]=this._color.r; this.colors[i*3+1]=this._color.g; this.colors[i*3+2]=this._color.b;
    this.sizes[i]=size; this.life[i]=1.0; this.decay[i]=1.0/Math.max(lifeSec,0.05);
  }
  _worldFromGrid(gx, gy, lift = 0.9) { const w = gridToWorld(gx, gy); w.y += lift; return w; }
  emitCorrect(gx, gy) { this.emitShockwave(gx, gy, 0x7cf7ec, 1); const w = this._worldFromGrid(gx, gy);
    const pal = [0x7cf7ec, 0x59d9ff, 0x96e6a1, 0xffe66d];
    for (let i = 0; i < P.burstCorrect; i++) { const th = Math.random()*Math.PI*2, ph = Math.random()*Math.PI*0.5, sp = 2.2+Math.random()*3.6;
      this._spawn(w.x, w.y, w.z, Math.cos(th)*Math.sin(ph)*sp, Math.cos(ph)*sp+1.5, Math.sin(th)*Math.sin(ph)*sp, pal[(Math.random()*pal.length)|0], 0.32+Math.random()*0.3, 0.5+Math.random()*0.45); } }
  emitConfetti(cx = 10, cy = 10, spread = 10) { this.emitShockwave(cx, cy, 0xffe66d, 3.2); this.emitShockwave(cx, cy, 0x59d9ff, 2.0);
    const pal = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0xaa96da, 0xfcbad3, 0xa8d8ea, 0xff9ff3, 0x54a0ff];
    for (let i = 0; i < P.burstConfetti; i++) { const gx = cx+(Math.random()-0.5)*spread, gy = cy+(Math.random()-0.5)*spread;
      const w = this._worldFromGrid(gx, gy, 1.5+Math.random()*3);
      this._spawn(w.x, w.y, w.z, (Math.random()-0.5)*5, 1.0+Math.random()*3.2, (Math.random()-0.5)*5, pal[(Math.random()*pal.length)|0], 0.3+Math.random()*0.34, 0.9+Math.random()*0.9); } }
  emitBonus(gx, gy, colorHex = 0xffe66d) { this.emitShockwave(gx, gy, colorHex, 1.3); const w = this._worldFromGrid(gx, gy);
    const pal = [colorHex, 0xff9ff3, 0x54a0ff];
    for (let i = 0; i < P.burstBonus; i++) { const th = Math.random()*Math.PI*2, sp = 1.6+Math.random()*2.6;
      this._spawn(w.x, w.y, w.z, Math.cos(th)*sp, 1.2+Math.random()*2.4, Math.sin(th)*sp, pal[(Math.random()*pal.length)|0], 0.3+Math.random()*0.26, 0.5+Math.random()*0.4); } }
  emitError(gx, gy) { this.emitShockwave(gx, gy, 0xff5f6d, 0.9); const w = this._worldFromGrid(gx, gy);
    for (let i = 0; i < P.burstError; i++) { const th = Math.random()*Math.PI*2, sp = 1.2+Math.random()*1.8;
      this._spawn(w.x, w.y, w.z, Math.cos(th)*sp, 0.6+Math.random()*1.2, Math.sin(th)*sp, 0xff5f6d, 0.24+Math.random()*0.2, 0.4+Math.random()*0.3); } }
  emitGameOver() { const pal = [0xa8d8ea, 0xaa96da, 0xfcbad3];
    for (let i = 0; i < P.burstGameOver; i++) { const gx = Math.random()*CONFIG.grid, gy = Math.random()*CONFIG.grid;
      const w = this._worldFromGrid(gx, gy, 0.5);
      this._spawn(w.x, w.y, w.z, (Math.random()-0.5)*1.2, 0.4+Math.random()*1.0, (Math.random()-0.5)*1.2, pal[(Math.random()*pal.length)|0], 0.28+Math.random()*0.3, 1.6+Math.random()*1.4); } }
  update(dt) {
    this._updateShockwaves(dt);
    const pos = this.positions, vel = this.velocities, life = this.life, decay = this.decay; let alive = 0;
    for (let i = 0; i < this.max; i++) {
      if (life[i] <= 0) continue; alive++; life[i] -= decay[i]*dt; if (life[i] < 0) life[i] = 0;
      const drag = Math.pow(P.drag, dt*60); vel[i*3]*=drag; vel[i*3+1]=vel[i*3+1]*drag+P.gravity*dt; vel[i*3+2]*=drag;
      pos[i*3]+=vel[i*3]*dt; pos[i*3+1]+=vel[i*3+1]*dt; pos[i*3+2]+=vel[i*3+2]*dt;
    }
    this.geometry.attributes.position.needsUpdate = true; this.geometry.attributes.life.needsUpdate = true; this.geometry.attributes.size.needsUpdate = true; this.geometry.attributes.color.needsUpdate = true; this._count = alive;
  }
  get count() { return this._count || 0; }
  clear() { this.life.fill(0); for (const sw of this.shockwaves) sw.mesh.visible = false; this.geometry.attributes.life.needsUpdate = true; this._count = 0; }
}
