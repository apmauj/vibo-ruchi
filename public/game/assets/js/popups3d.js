// popups3d.js — Popups de puntos flotantes en 3D (+10, +50, combo)
import * as THREE from 'three';
import { gridToWorld } from './scene3d.js';
const POPUP_STYLE = { fontSize: 92, pad: 26, font: `900 ${92}px 'Nunito','Segoe UI',system-ui,sans-serif` };
const KINDS = {
  points: { text: '#7cf7ec', stroke: 'rgba(4,10,26,0.95)', glow: 'rgba(124,247,236,0.65)' },
  word: { text: '#ffe66d', stroke: 'rgba(38,26,0,0.95)', glow: 'rgba(255,230,109,0.7)' },
  combo: { text: '#ff9f43', stroke: 'rgba(40,20,0,0.95)', glow: 'rgba(255,159,67,0.7)' },
  error: { text: '#ff8f9d', stroke: 'rgba(40,6,12,0.95)', glow: 'rgba(255,95,109,0.6)' },
  bonus: { text: '#ff9ff3', stroke: 'rgba(40,8,38,0.95)', glow: 'rgba(255,159,243,0.7)' },
  life: { text: '#ff6b9d', stroke: 'rgba(40,6,26,0.95)', glow: 'rgba(255,107,157,0.7)' },
};
function makePopupTexture(text, kind) {
  const c = document.createElement('canvas'); let ctx = c.getContext('2d');
  ctx.font = POPUP_STYLE.font; const tw = Math.ceil(ctx.measureText(text).width);
  c.width = tw + POPUP_STYLE.pad * 2; c.height = POPUP_STYLE.fontSize + POPUP_STYLE.pad * 2;
  ctx = c.getContext('2d'); const cx = c.width / 2, cy = c.height / 2; const st = KINDS[kind] || KINDS.points;
  ctx.font = POPUP_STYLE.font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = st.glow; ctx.shadowBlur = 26; ctx.lineJoin = 'round'; ctx.lineWidth = 20; ctx.strokeStyle = st.stroke; ctx.strokeText(text, cx, cy);
  ctx.shadowBlur = 0; ctx.lineWidth = 12; ctx.strokeStyle = st.stroke; ctx.strokeText(text, cx, cy);
  ctx.fillStyle = st.text; ctx.fillText(text, cx, cy);
  const grad = ctx.createLinearGradient(0, cy - 46, 0, cy + 46); grad.addColorStop(0, 'rgba(255,255,255,0.35)'); grad.addColorStop(0.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad; ctx.fillText(text, cx, cy);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; return tex;
}
class Popup {
  constructor(parent) {
    this.group = new THREE.Group(); parent.add(this.group);
    this.mat = new THREE.SpriteMaterial({ transparent: true, depthWrite: false, depthTest: false, opacity: 0 });
    this.sprite = new THREE.Sprite(this.mat); this.sprite.renderOrder = 20; this.group.add(this.sprite);
    this.active = false; this.t = 0; this.baseWorld = new THREE.Vector3();
  }
  show(text, worldPos, kind = 'points', scale = 1) {
    if (this.mat.map) this.mat.map.dispose();
    this.mat.map = makePopupTexture(text, kind); this.mat.needsUpdate = true; this.mat.opacity = 1;
    this.baseWorld.copy(worldPos); this.group.position.copy(worldPos); this.t = 0; this.active = true; this.sprite.visible = true;
    this.baseScale = 1.35 * scale;
    this.sprite.scale.set(this.baseScale * (this.mat.map.image.width / this.mat.map.image.height), this.baseScale, 1);
  }
  update(dt) {
    if (!this.active) return; this.t += dt / 1.05;
    if (this.t >= 1) { this.active = false; this.sprite.visible = false; return; }
    const t = this.t, rise = 2.6 * (1 - Math.pow(1 - t, 2.2));
    this.group.position.set(this.baseWorld.x + Math.sin(t * 5.2) * 0.12, this.baseWorld.y + rise, this.baseWorld.z);
    const pop = t < 0.22 ? 0.5 + 0.75 * Math.sin((t / 0.22) * Math.PI) : 1.0;
    const fade = t > 0.62 ? 1 - (t - 0.62) / 0.38 : 1; const s = this.baseScale * pop;
    this.sprite.scale.set(s * (this.mat.map.image.width / this.mat.map.image.height), s, 1); this.mat.opacity = fade;
  }
  dispose(parent) { parent.remove(this.group); if (this.mat.map) this.mat.map.dispose(); this.mat.dispose(); }
}
export class Popups3D {
  constructor(scene) {
    this.scene = scene; this.root = new THREE.Group(); scene.add(this.root);
    this.pool = []; for (let i = 0; i < 10; i++) this.pool.push(new Popup(this.root)); this.cursor = 0;
  }
  show(text, gx, gy, kind = 'points', opts = {}) {
    const p = this.pool[this.cursor]; this.cursor = (this.cursor + 1) % this.pool.length;
    const w = gridToWorld(gx, gy); w.y += (opts.lift !== undefined ? opts.lift : 1.5);
    p.show(text, w, kind, opts.scale || 1);
  }
  update(dt) { for (const p of this.pool) p.update(dt); }
  clear() { for (const p of this.pool) { p.active = false; p.sprite.visible = false; } }
}
