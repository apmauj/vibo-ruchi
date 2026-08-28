// snake3d.js — Serpiente 3D: cuerpo tubular, cara, estela neón
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { gridToWorld, surfaceY as surfaceYAt } from './scene3d.js';
const S = CONFIG.snake, G_HALF = (CONFIG.grid - 1) / 2, CELL = CONFIG.cell;
const UP = new THREE.Vector3(0, 1, 0), Z_AXIS = new THREE.Vector3(0, 0, 1), TWO_PI = Math.PI * 2;
function lerpWrapped(a, b, t) {
  let delta = b - a;
  const half = CONFIG.grid / 2;
  if (delta > half) delta -= CONFIG.grid;
  else if (delta < -half) delta += CONFIG.grid;
  return a + delta * t;
}function makeSoftCircleTexture() { const c = document.createElement('canvas'); c.width = c.height = 64; const ctx = c.getContext('2d'); const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); }
function catmull(p0, p1, p2, p3, t) { const t2 = t * t, t3 = t2 * t; return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3); }

export class Snake3D {
  constructor(scene, glowTexture) {
    this.scene = scene; this.glowTexture = glowTexture || makeSoftCircleTexture();
    this.group = new THREE.Group(); scene.add(this.group);
    this._palette = CONFIG.characters.lili; this._elapsed = 0; this._shake = 0; this._grow = 0; this._lastGrow = 0; this._rippleT = 99; this._boost = 0; this._celebrate = 0; this._prevHeading = 0; this._bank = 0;
    this._vTmp = new THREE.Vector3(); this._m4 = new THREE.Matrix4(); this._q = new THREE.Quaternion(); this._qRoll = new THREE.Quaternion(); this._fwd = new THREE.Vector3(); this._vS = new THREE.Vector3(); this._vU = new THREE.Vector3();
    this._segPts = []; this.maxCells = S.maxTubeCells;
    for (let i = 0; i < this.maxCells; i++) this._segPts.push(new THREE.Vector3());
    this._buildMaterials(); this._buildHead(); this._buildTube(); this._buildTrail(); this._buildHeadLight();
  }
  setCharacter(id) { const p = CONFIG.characters[id] || CONFIG.characters.lili; this._palette = p;
    this.headMat.color.copy(new THREE.Color(p.head).multiplyScalar(0.5)); this.headMat.emissive.setHex(p.head);
    this.bodyMat.uniforms.uColorHead.value.setHex(p.glow); this.bodyMat.uniforms.uColorBody.value.setHex(p.main); this.bodyMat.uniforms.uColorTail.value.setHex(p.main);
    this.bodyMat.uniforms.uRimColor.value.setHex(p.glow); this.bodyMat.uniforms.uLightColor.value.setHex(p.glow);
    this.trailMat.uniforms.uColor.value.setHex(p.main); this.trailMat.uniforms.uGlowColor.value.setHex(p.glow);
    this.headLight.color.setHex(p.glow); this.headGlow.material.color.setHex(p.glow); this._drawFace(); }
  _buildMaterials() { const p = this._palette;
    this.headMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(p.head).multiplyScalar(0.5), emissive: new THREE.Color(p.head), emissiveIntensity: 0.26, roughness: 0.3, metalness: 0.4 });
    this.bodyMat = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uColorHead: { value: new THREE.Color(p.glow) }, uColorBody: { value: new THREE.Color(p.main) }, uColorTail: { value: new THREE.Color(p.main) }, uRimColor: { value: new THREE.Color(p.glow) }, uLightColor: { value: new THREE.Color(p.glow) }, uLightPos: { value: new THREE.Vector3() }, uRipplePos: { value: -1 }, uRippleAmp: { value: 0 }, uCelebrate: { value: 0 }, uBoost: { value: 0 }, uGrow: { value: 0 } },
      vertexShader: `varying vec3 vNormal; varying vec3 vWorldPos; varying float vAlong; void main() { vNormal = normalize(normalMatrix * normal); vec4 wp = modelMatrix * vec4(position, 1.0); vWorldPos = wp.xyz; vAlong = uv.y; gl_Position = projectionMatrix * viewMatrix * wp; }`,
      fragmentShader: `uniform float uTime; uniform vec3 uColorHead; uniform vec3 uColorBody; uniform vec3 uColorTail; uniform vec3 uRimColor; uniform vec3 uLightColor; uniform vec3 uLightPos; uniform float uRipplePos; uniform float uRippleAmp; uniform float uCelebrate; uniform float uBoost; uniform float uGrow; varying vec3 vNormal; varying vec3 vWorldPos; varying float vAlong;
        vec3 rainbow(float h) { return 0.5 + 0.5 * cos(6.28318 * (h + vec3(0.0, 0.33, 0.67))); }
        void main() { vec3 N = normalize(vNormal); vec3 V = normalize(cameraPosition - vWorldPos); vec3 L = normalize(uLightPos - vWorldPos);
          vec3 base = mix(uColorHead, uColorBody, smoothstep(0.0, 0.42, vAlong)); base = mix(base, uColorTail, smoothstep(0.42, 1.0, vAlong));
          float wave = 0.5 + 0.5 * sin(vAlong * 13.0 - uTime * (3.4 + uBoost * 4.5));
          float rd = vAlong - uRipplePos; float ripple = exp(-rd * rd * 300.0) * uRippleAmp;
          float hue = fract(vAlong * 1.7 - uTime * 0.5); vec3 rb = rainbow(hue);
          float sparkle = pow(max(sin(vAlong * 47.0 - uTime * 9.0) * sin(vAlong * 19.0 + uTime * 5.0), 0.0), 5.0);
          base = mix(base, rb * 1.25, uCelebrate * 0.75);
          float diff = max(dot(N, L), 0.0); float sky = clamp(N.y * 0.5 + 0.5, 0.0, 1.0);
          float spec = pow(max(dot(reflect(-L, N), V), 0.0), 36.0); float rim = pow(1.0 - max(dot(N, V), 0.0), 2.4);
          // Atenuar el rim/glow neón hacia la cola: la punta fina queda muy brillante
          // en ángulos rasantes (el bloom la hace explotar). Full en cabeza,
          // decae desde vAlong=0.35 hasta ~18% en la punta de la cola.
          float tailDim = mix(1.0, 0.18, smoothstep(0.35, 0.92, vAlong));
          vec3 col = base * (0.5 + diff * 0.75 + sky * 0.5); col += uLightColor * spec * 0.6;
          col += uRimColor * rim * tailDim * (0.55 + 0.7 * wave + ripple * 2.6 + uBoost * 0.6 + uCelebrate * 0.4);
          col += base * (wave * 0.16 + ripple * 1.4 + uBoost * 0.22 + uGrow * 0.35);
          col += rb * sparkle * uCelebrate * 1.6; col = min(col, vec3(1.45));
          gl_FragColor = vec4(col, 1.0); }` });
    this.trailMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uColor: { value: new THREE.Color(p.main) }, uGlowColor: { value: new THREE.Color(p.glow) }, uFade: { value: S.trailFade }, uBoost: { value: 0 }, uGrow: { value: 0 }, uCelebrate: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform float uTime; uniform vec3 uColor; uniform vec3 uGlowColor; uniform float uFade; uniform float uBoost; uniform float uGrow; uniform float uCelebrate; varying vec2 vUv;
        vec3 rainbow(float h) { return 0.5 + 0.5 * cos(6.28318 * (h + vec3(0.0, 0.33, 0.67))); }
        void main() { float headness = vUv.y; float center = 1.0 - abs(vUv.x * 2.0 - 1.0); float core = pow(center, 5.0); float soft = pow(center, 1.55);
          float flow = sin(vUv.y * 68.0 - uTime * 7.5 + sin(vUv.x * 3.14159) * 1.35); float bands = 0.72 + 0.28 * flow;
          float sparks = pow(max(sin(vUv.y * 130.0 - uTime * 13.0), 0.0), 8.0) * 0.35; float fade = pow(headness, 1.35) * uFade;
          vec3 col = mix(uColor, vec3(1.02, 1.0, 0.95), core * headness * 0.45); col = mix(col, uGlowColor, soft * 0.3);
          col = mix(col, rainbow(fract(vUv.y * 2.0 - uTime * 0.6)), uCelebrate * 0.55);
          float alpha = (soft * 0.42 + core * 0.7 + sparks) * fade * bands; alpha *= 1.0 + uBoost * 0.75 + uGrow * 0.9;
          col *= 1.0 + uBoost * 0.4 + core * 0.7 + uGrow * 0.5 + uCelebrate * 0.35; col = min(col, vec3(1.35));
          gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0)); }` });
  }
  _buildHead() { const r = S.headRadius;
    this.headMesh = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), this.headMat); this.headMesh.scale.set(1.15, 0.95, 1.3); this.group.add(this.headMesh);
    this.face = new THREE.Group(); this.headMesh.add(this.face);
    this._faceCanvas = document.createElement('canvas'); this._faceCanvas.width = this._faceCanvas.height = 256; this._faceCtx = this._faceCanvas.getContext('2d'); this._faceTex = new THREE.CanvasTexture(this._faceCanvas); this._faceTex.colorSpace = THREE.SRGBColorSpace;
    const fMat = new THREE.MeshBasicMaterial({ map: this._faceTex, transparent: true, depthWrite: false });
    const fGeo = new THREE.SphereGeometry(r * 1.045, 36, 26, Math.PI / 2 - 1.0, 2.0, 0.32, 1.6);
    const fPatch = new THREE.Mesh(fGeo, fMat); fPatch.renderOrder = 1; this.face.add(fPatch); this._drawFace();
    this.eyes = new THREE.Group();
    const eGeo = new THREE.SphereGeometry(r * 0.44, 18, 14), rGeo = new THREE.SphereGeometry(r * 0.5, 18, 14);
    const rMat = new THREE.MeshStandardMaterial({ color: 0x0a1220, roughness: 0.4, emissive: 0x050a14, emissiveIntensity: 0.4 });
    const wMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.12, emissive: 0xc8d2e4, emissiveIntensity: 0.12 });
    const pGeo = new THREE.SphereGeometry(r * 0.24, 12, 10), pMat = new THREE.MeshStandardMaterial({ color: 0x0c1422, roughness: 0.25, emissive: 0x050a14, emissiveIntensity: 0.5 });
    for (const side of [-1, 1]) { const eye = new THREE.Group();
      eye.add(new THREE.Mesh(rGeo, rMat)); const wm = new THREE.Mesh(eGeo, wMat); wm.position.z = r * 0.07; eye.add(wm);
      const pupil = new THREE.Mesh(pGeo, pMat); pupil.position.set(0, r * 0.05, r * 0.23); eye.add(pupil);
      const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTexture, color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false })); gl.scale.setScalar(r * 0.2); gl.position.set(side * r * 0.02, r * 0.17, r * 0.3); eye.add(gl);
      eye.position.set(side * r * 0.6, r * 0.66, r * 0.12); eye.rotation.x = -0.5; this.eyes.add(eye); }
    this.face.add(this.eyes);
    const tongue = new THREE.Group(); const tMat = new THREE.MeshStandardMaterial({ color: 0xff5f8a, roughness: 0.35, emissive: 0xff2e6a, emissiveIntensity: 0.55 });
    const stem = new THREE.Mesh(new THREE.BoxGeometry(r * 0.09, r * 0.035, r * 0.42), tMat); stem.position.z = r * 0.18; tongue.add(stem);
    const fG = new THREE.ConeGeometry(r * 0.038, r * 0.16, 8);
    for (const [sx, ry] of [[-r * 0.05, 0.42], [r * 0.05, -0.42]]) { const f = new THREE.Mesh(fG, tMat); f.position.set(sx, 0, r * 0.42); f.rotation.x = Math.PI / 2; f.rotation.y = ry; tongue.add(f); }
    tongue.position.set(0, -r * 0.3, r * 0.85); tongue.scale.setScalar(0.001); this.tongue = tongue; this.face.add(tongue);
    this.headGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.glowTexture, color: this._palette.glow, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending, depthWrite: false })); this.headGlow.scale.setScalar(r * 2.3); this.group.add(this.headGlow);
  }
  _drawFace() { const ctx = this._faceCtx; if (!ctx) return; const p = this._palette; ctx.clearRect(0, 0, 256, 256);
    const cc = new THREE.Color(p.cheek || 0xff9fc0); const cr = (cc.r * 255) | 0, cg = (cc.g * 255) | 0, cb = (cc.b * 255) | 0;
    for (const x of [44, 212]) { const g = ctx.createRadialGradient(x, 142, 4, x, 142, 40); g.addColorStop(0, `rgba(${cr},${cg},${cb},0.66)`); g.addColorStop(0.6, `rgba(${cr},${cg},${cb},0.3)`); g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, 142, 40, 0, TWO_PI); ctx.fill(); }
    ctx.strokeStyle = 'rgba(13,24,38,0.95)'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(80, 148); ctx.quadraticCurveTo(128, 200, 176, 148); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(90, 148); ctx.quadraticCurveTo(128, 190, 166, 148); ctx.stroke(); this._faceTex.needsUpdate = true; }
  _buildTube() { const maxV = (this.maxCells * S.tubeSubdiv + 1) * (S.tubeRadialSegs + 1);
    const pos = new Float32Array(maxV * 3), nor = new Float32Array(maxV * 3), uv = new Float32Array(maxV * 2), idx = [];
    const rings = this.maxCells * S.tubeSubdiv + 1;
    for (let i = 0; i < rings - 1; i++) for (let j = 0; j < S.tubeRadialSegs; j++) { const a = i * (S.tubeRadialSegs + 1) + j, b = a + S.tubeRadialSegs + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(idx); geo.setDrawRange(0, 0);
    this.tubeMesh = new THREE.Mesh(geo, this.bodyMat); this.tubeMesh.frustumCulled = false; this.group.add(this.tubeMesh);
    this._cosT = []; this._sinT = []; for (let j = 0; j <= S.tubeRadialSegs; j++) { const a = (j / S.tubeRadialSegs) * TWO_PI; this._cosT.push(Math.cos(a)); this._sinT.push(Math.sin(a)); } }
  _buildTrail() { const MAX = S.trailMaxPoints; const pos = new Float32Array(MAX * 2 * 3), uvs = new Float32Array(MAX * 2 * 2), idx = [];
    for (let i = 0; i < MAX - 1; i++) { const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1; idx.push(a, b, c, b, d, c); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2)); geo.setIndex(idx); geo.setDrawRange(0, 0);
    this.trailMesh = new THREE.Mesh(geo, this.trailMat); this.trailMesh.frustumCulled = false; this.group.add(this.trailMesh); this._trailPts = []; }
  _buildHeadLight() { this.headLight = new THREE.PointLight(this._palette.glow, S.headLightIntensity, S.headLightDistance, 1.6); this.group.add(this.headLight); }
  addShake(a) { this._shake = Math.min(this._shake + a, 1.0); }
  update(dt, gameState, elapsed) {
    this._elapsed = elapsed; const { snake, moveT } = gameState; if (!snake) return;
    const body = snake.body, prev = snake.prevBody || body, t = THREE.MathUtils.clamp(moveT, 0, 1);
    this._shake *= Math.exp(-7 * dt); const growPulse = gameState.growPulse || 0; this._grow = growPulse;
    if (growPulse > 0.55 && this._lastGrow <= 0.55) this._rippleT = 0; this._lastGrow = growPulse; this._rippleT += dt;
    const rippleActive = this._rippleT < S.rippleDuration, ripplePos = rippleActive ? this._rippleT / S.rippleDuration : -1, rippleAmp = rippleActive ? Math.sin(Math.PI * Math.min(ripplePos, 1)) * 1.1 : 0;
    const bt = gameState.speedBoost ? 1 : 0; this._boost += (bt - this._boost) * (1 - Math.exp(-(bt > this._boost ? 7 : 2.2) * dt));
    const ct = snake.celebrateTimer > 0 ? 1 : 0; this._celebrate += (ct - this._celebrate) * (1 - Math.exp(-(ct > this._celebrate ? 12 : 2.6) * dt));
    const el = elapsed, boost = this._boost, celebrate = this._celebrate;
    const n = body.length, segCount = Math.min(n, this.maxCells), stride = n > segCount ? (n - 1) / (segCount - 1) : 1, lift = S.bodyLift, segPts = this._segPts;
    let lastGX = 0, lastGY = 0;
    for (let k = 0; k < segCount; k++) {
      const i = n > segCount ? Math.round(k * stride) : k;
      const p = prev[i] || body[i], c = body[i];
      let gx = lerpWrapped(p.x, c.x, t), gy = lerpWrapped(p.y, c.y, t);
      if (k > 0) {
        const half = CONFIG.grid / 2;
        while (gx - lastGX > half) gx -= CONFIG.grid;
        while (gx - lastGX < -half) gx += CONFIG.grid;
        while (gy - lastGY > half) gy -= CONFIG.grid;
        while (gy - lastGY < -half) gy += CONFIG.grid;
      }
      lastGX = gx; lastGY = gy;
      const x = (gx - G_HALF) * CELL, z = (gy - G_HALF) * CELL;
      segPts[k].set(x, surfaceYAt(x, z) + lift, z);
    }
    this._segCount = segCount; this._updateHead(dt, snake, segPts, { el, growPulse, boost, celebrate, t, prev, body }); this._updateTube(dt, { el, growPulse, boost, celebrate, ripplePos, rippleAmp }); this._updateTrail(dt, { el, boost, growPulse, celebrate });
    const bu = this.bodyMat.uniforms; bu.uTime.value = el; bu.uBoost.value = boost; bu.uCelebrate.value = celebrate; bu.uGrow.value = growPulse; bu.uRipplePos.value = ripplePos; bu.uRippleAmp.value = rippleAmp; bu.uLightPos.value.copy(segPts[0]);
    const tu = this.trailMat.uniforms; tu.uTime.value = el; tu.uBoost.value = boost; tu.uGrow.value = growPulse; tu.uCelebrate.value = celebrate;
  }
  _updateHead(dt, snake, segPts, st) {
    const { el, growPulse, boost, celebrate } = st; const headPos = segPts[0], dir = snake.direction, headMesh = this.headMesh;
    const ax = headPos.x + dir.x * CELL * 1.35, az = headPos.z + dir.y * CELL * 1.35;
    this._vTmp.set(ax, surfaceYAt(ax, az) + S.bodyLift, az);    if (this._vTmp.distanceToSquared(headPos) > 1e-8) { this._m4.lookAt(this._vTmp, headPos, UP); this._q.setFromRotationMatrix(this._m4); headMesh.quaternion.slerp(this._q, 1 - Math.exp(-16 * dt)); }
    this._fwd.set(0, 0, 1).applyQuaternion(headMesh.quaternion); const heading = Math.atan2(this._fwd.x, this._fwd.z); let dH = heading - this._prevHeading; while (dH > Math.PI) dH -= TWO_PI; while (dH < -Math.PI) dH += TWO_PI; this._prevHeading = heading;
    const bankT = THREE.MathUtils.clamp(-dH / Math.max(dt, 1e-4) * S.bankAmount, -0.5, 0.5); this._bank += (bankT - this._bank) * (1 - Math.exp(-7 * dt)); this._qRoll.setFromAxisAngle(Z_AXIS, this._bank); headMesh.quaternion.multiply(this._qRoll);
    headMesh.position.copy(headPos); if (this._shake > 0.002) { headMesh.position.x += (Math.random() - 0.5) * this._shake * 0.5; headMesh.position.y += (Math.random() - 0.5) * this._shake * 0.4; }
    const pop = 1 + growPulse * 0.3, breathe = 1 + Math.sin(el * S.breatheSpeed) * S.breatheAmp, stretch = 1 + boost * 0.14 + growPulse * 0.12;
    headMesh.scale.set(1.15 * pop * breathe * (1 - boost * 0.06), 0.95 * pop * breathe * (1 + growPulse * 0.18), 1.3 * stretch);
    this.face.scale.setScalar(1 + celebrate * 0.1);
    const blink = Math.sin(el * 0.8) > 0.985 ? 0.15 : 1; this.eyes.children.forEach(e => e.scale.y = blink);
    this.tongue.scale.y = THREE.MathUtils.lerp(this.tongue.scale.y, Math.sin(el * 1.7) > 0.88 ? 1 : 0.001, 1 - Math.exp(-18 * dt));
    this.headGlow.position.copy(headPos).addScaledVector(this._fwd, -0.35); this.headGlow.position.y -= 0.08;
    this.headGlow.material.opacity = 0.12 + Math.sin(el * 3.2) * 0.04 + growPulse * 0.2 + boost * 0.08 + celebrate * 0.1;
    this.headGlow.scale.setScalar(S.headRadius * (2.6 + growPulse * 1.4 + boost * 0.6));
    this.headLight.position.copy(headPos).addScaledVector(this._fwd, 1.6); this.headLight.position.y += 0.7;
    this.headLight.intensity = S.headLightIntensity * (1 + growPulse * 1.5 + boost * 0.7 + celebrate * 0.8);
  }
  _updateTube(dt, st) {
    const { el, growPulse, boost, celebrate, ripplePos, rippleAmp } = st, segPts = this._segPts, segCount = this._segCount;
    if (segCount < 2) { this.tubeMesh.geometry.setDrawRange(0, 0); return; }
    const posA = this.tubeMesh.geometry.attributes.position, norA = this.tubeMesh.geometry.attributes.normal, uvA = this.tubeMesh.geometry.attributes.uv;
    const subdiv = S.tubeSubdiv, radial = S.tubeRadialSegs, totalRings = (segCount - 1) * subdiv + 1;
    for (let i = 0; i < totalRings; i++) { const f = i / subdiv, i0 = Math.min(Math.floor(f), segCount - 2), fr = f - i0;
      const p0 = segPts[Math.max(0, i0 - 1)], p1 = segPts[i0], p2 = segPts[Math.min(i0 + 1, segCount - 1)], p3 = segPts[Math.min(i0 + 2, segCount - 1)];
      const cx = catmull(p0.x, p1.x, p2.x, p3.x, fr), cy = catmull(p0.y, p1.y, p2.y, p3.y, fr), cz = catmull(p0.z, p1.z, p2.z, p3.z, fr);
      const along = i / (totalRings - 1), breathe = 1 + Math.sin(el * S.breatheSpeed * 0.8 + along * 6) * S.breatheAmp;
      const taper = 1 - along * S.bodyTaper * 0.7; let radius = S.bodyRadius * Math.max(S.tailPinch / S.bodyRadius, taper) * breathe * (1 + growPulse * 0.2 * (1 - along));
      radius *= 1 + Math.sin(along * 13.0 - el * 3.4) * S.energyWaveAmp * 0.35;
      if (rippleAmp > 0) radius *= 1 + Math.exp(-((along - ripplePos) ** 2) * 300.0) * rippleAmp * 0.35;
      const wob = Math.sin(el * S.slitherSpeed + along * S.slitherFreq * TWO_PI) * S.slitherAmp * Math.min(along * 3, 1);
      const i1 = Math.min(i + 1, totalRings - 1), f1 = i1 / subdiv, j0 = Math.min(Math.floor(f1), segCount - 2), fr1 = f1 - j0;
      const q0 = segPts[Math.max(0, j0 - 1)], q1 = segPts[j0], q2 = segPts[Math.min(j0 + 1, segCount - 1)], q3 = segPts[Math.min(j0 + 2, segCount - 1)];
      const tx = catmull(q0.x, q1.x, q2.x, q3.x, fr1) - cx, ty = catmull(q0.y, q1.y, q2.y, q3.y, fr1) - cy, tz = catmull(q0.z, q1.z, q2.z, q3.z, fr1) - cz;
      const tl = Math.sqrt(tx*tx+ty*ty+tz*tz) || 1; const tnx = tx/tl, tny = ty/tl, tnz = tz/tl;
      let nx = -tnz, ny = 0, nz = tnx; const nl = Math.sqrt(nx*nx+nz*nz) || 1; nx /= nl; nz /= nl;
      const bx = tny*nz - tnz*ny, by = tnz*nx - tnx*nz, bz = tnx*ny - tny*nx;
      for (let j = 0; j <= radial; j++) { const ca = this._cosT[j], sa = this._sinT[j]; const idx = i * (radial + 1) + j;
        const ox = (nx*ca + bx*sa) * radius + wob, oy = (ny*ca + by*sa) * radius, oz = (nz*ca + bz*sa) * radius;
        posA.setXYZ(idx, cx + ox, cy + oy, cz + oz); const ol = Math.sqrt(ox*ox+oy*oy+oz*oz) || 1; norA.setXYZ(idx, ox/ol, oy/ol, oz/ol); uvA.setXY(idx, j / radial, along); } }
    posA.needsUpdate = true; norA.needsUpdate = true; uvA.needsUpdate = true;
    this.tubeMesh.geometry.setDrawRange(0, (totalRings - 1) * S.tubeRadialSegs * 6);
  }
  _updateTrail(dt, st) { const headPos = this._segPts[0], tp = this._trailPts;
    let last = tp[tp.length - 1];
    if (last && last.distanceToSquared(headPos) > CELL * CELL * 9) { tp.length = 0; last = null; }
    if (!last || last.distanceToSquared(headPos) > S.trailSpawnDist) { tp.push(headPos.clone()); if (tp.length > S.trailMaxPoints) tp.shift(); }
    for (let i = 0; i < tp.length; i++) { if (i === tp.length - 1) continue; const nxt = tp[i + 1] || headPos; tp[i].lerp(nxt, 1 - Math.exp(-2.2 * dt * (i / tp.length + 0.2))); }
    const n = tp.length, posA = this.trailMesh.geometry.attributes.position, uvA = this.trailMesh.geometry.attributes.uv;
    for (let i = 0; i < n; i++) { const p = tp[i], j = Math.max(0, i - 1), k = Math.min(n - 1, i + 1);
      this._vU.set(tp[k].x - tp[j].x, tp[k].y - tp[j].y, tp[k].z - tp[j].z); if (this._vU.lengthSq() < 1e-8) this._vU.set(0, 0, 1); this._vU.normalize();
      this._vS.crossVectors(this._vU, UP).normalize(); if (this._vS.lengthSq() < 1e-6) this._vS.set(1, 0, 0);
      const w = S.trailWidth * (0.35 + 0.65 * (i / Math.max(n, 1)));
      posA.setXYZ(i * 2, p.x + this._vS.x * w, p.y + this._vS.y * w, p.z + this._vS.z * w);
      posA.setXYZ(i * 2 + 1, p.x - this._vS.x * w, p.y - this._vS.y * w, p.z - this._vS.z * w);
      uvA.setXY(i * 2, 0, i / Math.max(n - 1, 1)); uvA.setXY(i * 2 + 1, 1, i / Math.max(n - 1, 1)); }
    posA.needsUpdate = true; uvA.needsUpdate = true; this.trailMesh.geometry.setDrawRange(0, Math.max(0, (n - 1) * 6)); }
  reset() { this._trailPts.length = 0; this.trailMesh.geometry.setDrawRange(0, 0); }
}
