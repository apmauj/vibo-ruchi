// scene3d.js — Escena, entorno y pipeline de render (AAA neón)
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CONFIG } from './config.js';
import { CameraRig } from './camera3d.js';

export function gridToWorld(gx, gy, target = new THREE.Vector3()) {
  const g = CONFIG.grid;
  const x = (gx - (g - 1) / 2) * CONFIG.cell, z = (gy - (g - 1) / 2) * CONFIG.cell;
  return target.set(x, surfaceY(x, z), z);
}
export function surfaceY(x, z) {
  const nx = x / (CONFIG.boardW / 2), nz = z / (CONFIG.boardW / 2);
  return -CONFIG.valleyDepth * nx * nx + CONFIG.horizonRise * nz * nz;
}

export class Scene3D {
  constructor(canvas) {
    this.canvas = canvas; this.elapsed = 0; this._shake = 0; this._shakeVec = new THREE.Vector3();
    this.reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
    this._qualityLevel = 0; this._qualityCooldown = 2; this._fpsAccum = 0; this._fpsFrames = 0;
    this._initRenderer(); this._initScene(); this._initComposer();
    this.cameraRig = new CameraRig(this.camera);
  }
  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = 0.95;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }
  _initScene() {
    const { env } = CONFIG;
    this.scene = new THREE.Scene(); this.scene.fog = new THREE.Fog(env.bgBottom, env.fogNear, env.fogFar);
    this.camera = new THREE.PerspectiveCamera(CONFIG.camera.fov, 1, CONFIG.camera.near, CONFIG.camera.far);
    this.camera.position.set(0, 18, 26); this.camera.lookAt(0, 0, 0);
    this._addBackgroundDome(); this._addLights(); this._addCurvedSurface(); this._addNeonRails(); this._addStarfield();
    this.valleyGlow = new THREE.PointLight(env.valleyGlow, 1.0, 46, 1.8); this.valleyGlow.position.set(0, 6.5, 0); this.scene.add(this.valleyGlow);
  }
  _addBackgroundDome() {
    const mat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { topColor: { value: new THREE.Color(CONFIG.env.bgTop) }, bottomColor: { value: new THREE.Color(CONFIG.env.bgBottom) }, offset: { value: 20.0 }, exponent: { value: 0.65 } },
      vertexShader: `varying vec3 vWorldPosition; void main() { vec4 wp = modelMatrix * vec4(position, 1.0); vWorldPosition = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,
      fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition;
        void main() { float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y; gl_FragColor = vec4(mix(bottomColor, topColor, pow(max(h, 0.0), exponent)), 1.0); }` });
    this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(180, 24, 16), mat));
  }
  _addLights() {
    const { env } = CONFIG;
    this.scene.add(new THREE.AmbientLight(env.ambient, env.ambientIntensity));
    const key = new THREE.DirectionalLight(env.keyLight, env.keyIntensity); key.position.set(8, 22, 10); this.scene.add(key);
    const rim = new THREE.DirectionalLight(0xff7edb, 0.35); rim.position.set(-14, 10, -8); this.scene.add(rim);
  }
  _addCurvedSurface() {
    const g = CONFIG.grid, seg = CONFIG.surfaceSegments, half = CONFIG.boardW / 2;
    const geo = new THREE.PlaneGeometry(CONFIG.boardW, CONFIG.boardW, seg, seg); geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, surfaceY(pos.getX(i), pos.getZ(i)));
    pos.needsUpdate = true; geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color: 0x0b1026, roughness: 0.38, metalness: 0.72, emissive: new THREE.Color(0x060a18) });
    this.surfaceMesh = new THREE.Mesh(geo, mat); this.scene.add(this.surfaceMesh);
    // Grid neón
    const lp = [];
    for (let i = 0; i <= g; i++) { const t = -half + (i / g) * CONFIG.boardW;
      for (let s = 0; s < 40; s++) { const z0 = -half + (s/40)*CONFIG.boardW, z1 = -half + ((s+1)/40)*CONFIG.boardW;
        lp.push(t, surfaceY(t, z0)+0.02, z0, t, surfaceY(t, z1)+0.02, z1); } }
    for (let j = 0; j <= g; j++) { const t = -half + (j / g) * CONFIG.boardW;
      for (let s = 0; s < 40; s++) { const x0 = -half + (s/40)*CONFIG.boardW, x1 = -half + ((s+1)/40)*CONFIG.boardW;
        lp.push(x0, surfaceY(x0, t)+0.02, t, x1, surfaceY(x1, t)+0.02, t); } }
    const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
    this.gridLines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: CONFIG.env.gridLine, transparent: true, opacity: 0.34, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.scene.add(this.gridLines);
    // Halo del valle
    const hg = new THREE.PlaneGeometry(CONFIG.boardW * 0.9, CONFIG.boardW * 0.9); hg.rotateX(-Math.PI / 2);
    const ht = this._radialTexture(CONFIG.env.gridLine, 0.5);
    this.valleyHalo = new THREE.Mesh(hg, new THREE.MeshBasicMaterial({ map: ht, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.valleyHalo.position.y = surfaceY(0, 0) - 1.6; this.scene.add(this.valleyHalo);
  }
  _addNeonRails() {
    const half = CONFIG.boardW / 2; this.rails = new THREE.Group();
    const rMat = new THREE.MeshBasicMaterial({ color: CONFIG.env.railColor, transparent: true, opacity: 0.9 });
    const gMat = new THREE.MeshBasicMaterial({ color: CONFIG.env.railColor, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false });
    const edges = [[-half,-half,half,-half],[-half,half,half,half],[-half,-half,-half,half],[half,-half,half,half]];
    for (const [x0,z0,x1,z1] of edges) {
      const cp = [], gp = [];
      for (let s = 0; s <= 32; s++) { const t = s/32; const x = x0+(x1-x0)*t, z = z0+(z1-z0)*t, y = surfaceY(x,z);
        cp.push(new THREE.Vector3(x, y+0.1, z)); gp.push(new THREE.Vector3(x, y+0.32, z)); }
      this.rails.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cp), 32, 0.07, 8), rMat));
      this.rails.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(gp), 32, 0.26, 8), gMat));
    }
    this.scene.add(this.rails);
  }
  setSurfaceMode(mode) {
    const p = CONFIG.surfaceModes[mode] || CONFIG.surfaceModes.soft;
    CONFIG.valleyDepth = p.valleyDepth; CONFIG.horizonRise = p.horizonRise; this._rebuildSurface();
  }
  _rebuildSurface() {
    for (const obj of [this.surfaceMesh, this.gridLines, this.valleyHalo, this.rails]) {
      if (!obj) continue; this.scene.remove(obj);
      obj.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
    }
    this.surfaceMesh = null; this.gridLines = null; this.valleyHalo = null; this.rails = null;
    this._addCurvedSurface(); this._addNeonRails();
  }
  _addStarfield() {
    const { starCount } = CONFIG.env; const geo = new THREE.BufferGeometry();
    const pa = new Float32Array(starCount*3), ca = new Float32Array(starCount*3), sa = new Float32Array(starCount);
    const pal = [new THREE.Color(0x9fd8ff), new THREE.Color(0xffffff), new THREE.Color(0xc4b5fd), new THREE.Color(0xffd3f0)];
    for (let i = 0; i < starCount; i++) {
      const r = 90+Math.random()*70, th = Math.random()*Math.PI*2, ph = Math.acos(2*Math.random()-1);
      pa[i*3]=r*Math.sin(ph)*Math.cos(th); pa[i*3+1]=r*Math.cos(ph)*0.9; pa[i*3+2]=r*Math.sin(ph)*Math.sin(th);
      const c = pal[(Math.random()*pal.length)|0]; ca[i*3]=c.r; ca[i*3+1]=c.g; ca[i*3+2]=c.b; sa[i]=1.2+Math.random()*2.6;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pa, 3)); geo.setAttribute('color', new THREE.BufferAttribute(ca, 3)); geo.setAttribute('size', new THREE.BufferAttribute(sa, 1));
    const mat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `attribute float size; varying vec3 vColor; varying float vTw; uniform float uTime;
        void main() { vColor = color; vTw = 0.65 + 0.35 * sin(uTime * (0.6 + fract(position.x) * 2.0) + position.z * 0.35);
        vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = size * (300.0 / -mv.z); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `varying vec3 vColor; varying float vTw; void main() { float d = length(gl_PointCoord - vec2(0.5)); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vColor * 1.8 * vTw, a * vTw); }`,
      vertexColors: true });
    this.stars = new THREE.Points(geo, mat); this.scene.add(this.stars);
  }
  _initComposer() {
    const size = new THREE.Vector2(); this.renderer.getSize(size);
    this.composer = new EffectComposer(this.renderer); this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(size.x || 1, size.y || 1), CONFIG.bloom.strength, CONFIG.bloom.radius, CONFIG.bloom.threshold);
    this.composer.addPass(this.bloomPass); this.composer.addPass(new OutputPass());
  }
  _radialTexture(colorHex, alpha = 1) {
    const c = document.createElement('canvas'); c.width = c.height = 128; const ctx = c.getContext('2d');
    const col = new THREE.Color(colorHex); const rgb = `${(col.r*255)|0},${(col.g*255)|0},${(col.b*255)|0}`;
    const g = ctx.createRadialGradient(64, 64, 2, 64, 64, 64); g.addColorStop(0, `rgba(${rgb},${alpha})`); g.addColorStop(0.35, `rgba(${rgb},${alpha*0.45})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 128); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
  }
  get glowTexture() { if (!this._glowTex) this._glowTex = this._radialTexture(0xffffff, 0.9); return this._glowTex; }
  resize(w, h) { if (w < 2 || h < 2) return; this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.renderer.setSize(w, h, false); this.composer.setSize(w, h); }
  addShake(a) { if (!this.reducedMotion) this._shake = Math.min(this._shake + a, 1.4); }
  update(dt, gameState) {
    this.elapsed += dt; const t = this.elapsed;
    const nowMs = performance.now();
    if (this._fpsLastMs === undefined) this._fpsLastMs = nowMs;
    this._fpsAccum += (nowMs - this._fpsLastMs) / 1000; this._fpsLastMs = nowMs; this._fpsFrames++;
    if (this._fpsAccum >= 1) { const fps = this._fpsFrames / this._fpsAccum; this._fpsFrames = 0; this._fpsAccum = 0; this._dynamicQuality(fps); }
    const motionScale = this.reducedMotion ? 0.2 : 1;
    if (this.stars) { this.stars.material.uniforms.uTime.value = t * motionScale; this.stars.rotation.y += dt * 0.004 * motionScale; }
    if (this.gridLines) this.gridLines.material.opacity = 0.30 + Math.sin(t * 2.0 * motionScale) * 0.06 * motionScale;
    if (this.valleyGlow) this.valleyGlow.intensity = 1.0 + Math.sin(t * 1.4 * motionScale) * 0.18 * motionScale;
    this.cameraRig.update(dt, gameState, t);
    if (this._shake > 0.001) { this._shake *= Math.exp(-CONFIG.camera.shakeDecay * dt); const s = this._shake;
      this._shakeVec.set((Math.random()-0.5)*s*0.55, (Math.random()-0.5)*s*0.4, (Math.random()-0.5)*s*0.55); this.camera.position.add(this._shakeVec); }
  }
  render() { this.composer.render(); }
  _dynamicQuality(fps) {
    if (this._qualityCooldown > 0) { this._qualityCooldown--; return; }
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio);
    if (fps < 24 && this._qualityLevel < 2) { this._qualityLevel++; this._qualityCooldown = 3;
      if (this._qualityLevel === 1) { this.renderer.setPixelRatio(Math.min(dpr, 1)); this.bloomPass.strength = CONFIG.bloom.strength * 0.6; }
      else { this.renderer.setPixelRatio(0.85); this.bloomPass.strength = CONFIG.bloom.strength * 0.35; }
      this.resize(this.canvas.clientWidth || 1280, this.canvas.clientHeight || 445);
    } else if (fps > 52 && this._qualityLevel > 0) { this._qualityLevel--; this._qualityCooldown = 5;
      if (this._qualityLevel === 0) { this.renderer.setPixelRatio(dpr); this.bloomPass.strength = CONFIG.bloom.strength; }
      else if (this._qualityLevel === 1) { this.renderer.setPixelRatio(Math.min(dpr, 1)); this.bloomPass.strength = CONFIG.bloom.strength * 0.6; }
      this.resize(this.canvas.clientWidth || 1280, this.canvas.clientHeight || 445);
    }
  }
}
