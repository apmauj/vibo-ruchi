// items3d.js — Ítems 3D: orbes de sílabas, bonus, obstáculos
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { gridToWorld } from './scene3d.js';
const I = CONFIG.items, C = CONFIG.itemColors;
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
function makeSyllableTexture(text) {
  const fs = 96, pad = 22; const c = document.createElement('canvas'); let ctx = c.getContext('2d');
  const font = `900 ${fs}px 'Nunito','Segoe UI',system-ui,sans-serif`; ctx.font = font;
  const tw = Math.ceil(ctx.measureText(text).width); c.width = tw + pad * 2; c.height = fs + pad * 2;
  ctx = c.getContext('2d'); const cx = c.width / 2, cy = c.height / 2;
  ctx.fillStyle = 'rgba(5,8,20,0.82)'; rr(ctx, 4, 4, c.width - 8, c.height - 8, 30); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.78)'; ctx.lineWidth = 6; rr(ctx, 4, 4, c.width - 8, c.height - 8, 30); ctx.stroke();
  ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; ctx.lineWidth = 22; ctx.strokeStyle = 'rgba(4,6,16,0.95)'; ctx.strokeText(text, cx, cy);
  ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; ctx.lineWidth = 10; ctx.strokeStyle = 'rgba(4,6,16,0.95)'; ctx.strokeText(text, cx, cy);
  ctx.shadowColor = 'rgba(255,255,255,0.3)'; ctx.shadowBlur = 7; ctx.fillStyle = '#ffffff'; ctx.fillText(text, cx, cy);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; return tex;
}
function makeEmojiTexture(emoji) { const fs = 84, pad = 16; const c = document.createElement('canvas'); c.width = fs + pad * 2; c.height = fs + pad * 2; const ctx = c.getContext('2d'); ctx.font = `${fs}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(emoji, c.width / 2, c.height / 2 + 6); const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex; }
let _shadowTex = null; function getShadowTexture() { if (_shadowTex) return _shadowTex; const c = document.createElement('canvas'); c.width = c.height = 64; const ctx = c.getContext('2d'); const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 32); g.addColorStop(0, 'rgba(0,0,0,0.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64); _shadowTex = new THREE.CanvasTexture(c); return _shadowTex; }
const geoCache = new Map(); function geo(key, make) { if (!geoCache.has(key)) geoCache.set(key, make()); return geoCache.get(key); }

class SyllableOrb {
  constructor(parent, text, kind, glowTexture) {
    this.text = text; this.kind = kind; this.group = new THREE.Group(); parent.add(this.group);
    const color = kind === 'target' ? C.target : kind === 'distractor' ? C.distractor : C.normal;
    const glowColor = kind === 'target' ? C.targetGlow : color;
    this.coreMat = new THREE.MeshStandardMaterial({ color, emissive: new THREE.Color(glowColor), emissiveIntensity: 0.55, roughness: 0.2, metalness: 0.35 });
    this.core = new THREE.Mesh(geo('orbCore', () => new THREE.SphereGeometry(I.orbRadius, 24, 18)), this.coreMat); this.group.add(this.core);
    this.ringMat = new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false });
    this.ring = new THREE.Mesh(geo('orbRing', () => new THREE.TorusGeometry(I.orbRadius * 1.24, 0.045, 10, 48)), this.ringMat); this.ring.rotation.x = Math.PI / 2.35; this.group.add(this.ring);
    this.shellMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false });
    this.shell = new THREE.Mesh(geo('orbShell', () => new THREE.IcosahedronGeometry(I.orbRadius * 1.48, 0)), this.shellMat); this.shell.rotation.set(0.4, 0.3, 0.1); this.group.add(this.shell);
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture, transparent: true, opacity: 0.26, blending: THREE.AdditiveBlending, depthWrite: false })); this.glow.scale.setScalar(I.orbRadius * 3.2); this.group.add(this.glow);
    this.shadow = new THREE.Mesh(geo('orbShadow', () => new THREE.CircleGeometry(I.orbRadius * 1.2, 24)), new THREE.MeshBasicMaterial({ map: getShadowTexture(), color: 0x000000, transparent: true, opacity: 0.5, depthWrite: false })); this.shadow.renderOrder = 1; this.group.add(this.shadow);
    this.labelMat = new THREE.SpriteMaterial({ map: makeSyllableTexture(text.toUpperCase()), transparent: true, depthWrite: false, depthTest: false });
    this.label = new THREE.Sprite(this.labelMat); const aspect = this.labelMat.map.image.width / this.labelMat.map.image.height; const h = I.labelHeight; this.label.scale.set(Math.min(h * aspect, I.labelMaxWidth), h, 1); this.label.position.y = 0.05; this.label.renderOrder = 10; this.group.add(this.label);
    this.halo = new THREE.Mesh(geo('orbHalo', () => new THREE.TorusGeometry(I.orbRadius * 1.95, 0.05, 8, 56)), new THREE.MeshBasicMaterial({ color: C.targetGlow, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false })); this.halo.rotation.x = Math.PI / 2; this.group.add(this.halo);
    this.beam = new THREE.Mesh(geo('beam', () => new THREE.CylinderGeometry(I.orbRadius * 0.32, I.orbRadius * 0.8, I.beamHeight, 12, 1, true)), new THREE.MeshBasicMaterial({ color: C.targetGlow, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); this.beam.position.y = I.beamHeight / 2 + I.orbRadius; this.group.add(this.beam);
    this.light = new THREE.PointLight(C.targetGlow, 1.5, 6.5, 1.8); this.light.position.y = 0.6; this.group.add(this.light);
    this.spawnT = 0; this.phase = Math.random() * Math.PI * 2; this.setKind(kind);
  }
  setKind(kind) { this.kind = kind; const color = kind === 'target' ? C.target : kind === 'distractor' ? C.distractor : C.normal; const glowColor = kind === 'target' ? C.targetGlow : color;
    this.coreMat.color.setHex(color); this.coreMat.emissive.setHex(glowColor); this.ringMat.color.setHex(glowColor); this.glow.material.color.setHex(glowColor);
    const showT = kind === 'target'; this.halo.visible = showT; this.beam.visible = showT; this.light.visible = showT; this.labelMat.color.setHex(0xffffff); }
  setGrid(x, y) { const w = gridToWorld(x, y); this.group.position.copy(w); this.group.position.y += I.orbRadius + 0.55; this.baseY = this.group.position.y; this.shadow.position.y = -(this.group.position.y - w.y) + 0.03; this.shadow.rotation.x = -Math.PI / 2; }
  update(dt, elapsed) { this.spawnT = Math.min(this.spawnT + dt / I.spawnPopDuration, 1); const pop = this.spawnT < 1 ? 0.2 + 0.8 * (1 - Math.pow(1 - this.spawnT, 3)) * (1 + Math.sin(this.spawnT * Math.PI) * 0.25) : 1;
    const bob = Math.sin(elapsed * I.bobSpeed + this.phase) * I.bobAmp; this.group.position.y = this.baseY + bob; this.group.scale.setScalar(Math.max(pop, 0.001));
    this.ring.rotation.z += dt * 1.2; this.shell.rotation.y += dt * 0.7; this.shell.rotation.x += dt * 0.3;
    this.glow.material.opacity = (this.kind === 'target' ? 0.34 : 0.2) + Math.sin(elapsed * 3 + this.phase) * 0.08;
    if (this.kind === 'target') { const pulse = 1 + Math.sin(elapsed * I.targetHaloSpeed) * 0.18; this.halo.scale.setScalar(pulse); this.halo.rotation.z += dt * 0.8; this.halo.material.opacity = 0.65 + Math.sin(elapsed * I.targetHaloSpeed * 2) * 0.25; this.beam.material.opacity = 0.05 + Math.sin(elapsed * I.targetHaloSpeed) * 0.03; this.light.intensity = 1.1 + Math.sin(elapsed * I.targetHaloSpeed) * 0.4; this.coreMat.emissiveIntensity = 0.75 + Math.sin(elapsed * I.targetHaloSpeed * 2) * 0.25; }
    else this.coreMat.emissiveIntensity = 0.5 + Math.sin(elapsed * 2 + this.phase) * 0.12; }
  dispose(parent) {
    parent.remove(this.group);
    if (this.labelMat.map) this.labelMat.map.dispose();
    this.labelMat.dispose(); this.coreMat.dispose(); this.ringMat.dispose(); this.shellMat.dispose();
    this.glow.material.dispose(); this.shadow.material.dispose(); this.halo.material.dispose(); this.beam.material.dispose();
  }
}
class BonusItem3D {
  constructor(parent, emoji, color, glowTexture) { this.group = new THREE.Group(); parent.add(this.group); this.phase = Math.random() * Math.PI * 2; this.spawnT = 0;
    this.mat = new THREE.MeshStandardMaterial({ color, emissive: new THREE.Color(color), emissiveIntensity: 1.1, roughness: 0.15, metalness: 0.6 });
    this.gem = new THREE.Mesh(geo('bonusGem', () => new THREE.OctahedronGeometry(0.4)), this.mat); this.group.add(this.gem);
    this.labelMat = new THREE.SpriteMaterial({ map: makeEmojiTexture(emoji), transparent: true, depthWrite: false }); this.label = new THREE.Sprite(this.labelMat); this.label.scale.set(1.15, 1.15, 1); this.label.renderOrder = 9; this.group.add(this.label);
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture, color, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false })); this.glow.scale.setScalar(2.6); this.group.add(this.glow);
    this.light = new THREE.PointLight(color, 1.0, 5, 1.8); this.group.add(this.light); }
  setGrid(x, y) { const w = gridToWorld(x, y); this.group.position.copy(w); this.group.position.y += 0.85; this.baseY = this.group.position.y; }
  update(dt, elapsed) { this.spawnT = Math.min(this.spawnT + dt / I.spawnPopDuration, 1); const pop = this.spawnT < 1 ? 0.2 + 0.8 * (1 - Math.pow(1 - this.spawnT, 3)) : 1; this.group.scale.setScalar(Math.max(pop, 0.001)); this.group.position.y = this.baseY + Math.sin(elapsed * 2.0 + this.phase) * 0.18; this.gem.rotation.y += dt * 2.2; this.gem.rotation.x += dt * 0.9; this.glow.material.opacity = 0.4 + Math.sin(elapsed * 4 + this.phase) * 0.15; }
  dispose(parent) { parent.remove(this.group); if (this.labelMat.map) this.labelMat.map.dispose(); this.labelMat.dispose(); this.mat.dispose(); this.glow.material.dispose(); }
}
class Obstacle3D {
  constructor(parent, glowTexture) { this.group = new THREE.Group(); parent.add(this.group);
    const og = geo('obstacleGeo', () => { const g = new THREE.OctahedronGeometry(0.62); g.scale(1, 1.5, 1); return g; });
    this.mat = new THREE.MeshStandardMaterial({ color: C.obstacle, emissive: new THREE.Color(C.obstacle), emissiveIntensity: 0.55, roughness: 0.2, metalness: 0.7, transparent: true, opacity: 0.85 });
    this.mesh = new THREE.Mesh(og, this.mat); this.mesh.position.y = 0.75; this.group.add(this.mesh);
    const edges = geo('obstacleEdges', () => new THREE.EdgesGeometry(og));
    this.edgeLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xc4b5fd, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending })); this.edgeLines.position.y = 0.75; this.group.add(this.edgeLines);
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture, color: C.obstacle, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })); this.glow.scale.setScalar(2.8); this.glow.position.y = 0.75; this.group.add(this.glow); }
  setGrid(x, y) { const w = gridToWorld(x, y); this.group.position.copy(w); }
  update(dt, elapsed) { this.mesh.rotation.y += dt * 0.5; this.edgeLines.rotation.y = this.mesh.rotation.y; this.glow.material.opacity = 0.3 + Math.sin(elapsed * 2.4 + this.group.position.x) * 0.1; }
  dispose(parent) { parent.remove(this.group); this.mat.dispose(); this.edgeLines.material.dispose(); this.glow.material.dispose(); }
}
export class Items3D {
  constructor(scene, glowTexture) { this.scene = scene; this.glowTexture = glowTexture; this.itemsRoot = new THREE.Group(); scene.add(this.itemsRoot); this.syllableOrbs = new Map(); this.bonuses = new Map(); this.obstacles = []; this._obstacleSignature = ''; }
  syncBoard(board, showTarget) { const seen = new Set();
    for (const s of board.syllables) { if (s.collected) continue; const key = `${s.x},${s.y}`; seen.add(key); const kind = s.isDistractor ? 'distractor' : (showTarget && s.isTarget ? 'target' : 'normal');
      let orb = this.syllableOrbs.get(key);
      if (orb && orb.text !== s.text) { orb.dispose(this.itemsRoot); this.syllableOrbs.delete(key); orb = null; }
      if (!orb) { orb = new SyllableOrb(this.itemsRoot, s.text, kind, this.glowTexture); orb.setGrid(s.x, s.y); this.syllableOrbs.set(key, orb); } else orb.setKind(kind); }
    for (const [key, orb] of this.syllableOrbs) { if (!seen.has(key)) { orb.dispose(this.itemsRoot); this.syllableOrbs.delete(key); } }
    const seenB = new Set();
    for (const b of board.bonuses) { if (b.collected) continue; const key = `${b.x},${b.y}`; seenB.add(key); if (!this.bonuses.has(key)) { const colorHex = parseInt((b.info.color || "#FFE66D").replace('#', ''), 16); const item = new BonusItem3D(this.itemsRoot, b.info.emoji, colorHex, this.glowTexture); item.setGrid(b.x, b.y); this.bonuses.set(key, item); } }
    for (const [key, item] of this.bonuses) { if (!seenB.has(key)) { item.dispose(this.itemsRoot); this.bonuses.delete(key); } } }
  syncObstacles(obstacles) {
    const signature = obstacles.map(o => o.x + ',' + o.y).join('|');
    if (signature === this._obstacleSignature) return;
    for (const o of this.obstacles) o.dispose(this.itemsRoot);
    this.obstacles = obstacles.map(o => { const ob = new Obstacle3D(this.itemsRoot, this.glowTexture); ob.setGrid(o.x, o.y); return ob; });
    this._obstacleSignature = signature;
  }
  clearAll() { for (const [, orb] of this.syllableOrbs) orb.dispose(this.itemsRoot); this.syllableOrbs.clear(); for (const [, b] of this.bonuses) b.dispose(this.itemsRoot); this.bonuses.clear(); for (const o of this.obstacles) o.dispose(this.itemsRoot); this.obstacles = []; this._obstacleSignature = ''; }
  update(dt, elapsed) { for (const [, orb] of this.syllableOrbs) orb.update(dt, elapsed); for (const [, b] of this.bonuses) b.update(dt, elapsed); for (const o of this.obstacles) o.update(dt, elapsed); }
}
