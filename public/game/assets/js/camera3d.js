// camera3d.js — Rig de cámara cinematográfica
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { gridToWorld, surfaceY as surfaceYLocal } from './scene3d.js';
const CAM = CONFIG.camera;
export class CameraRig {
  constructor(camera) {
    this.camera = camera; this.mode = 'menu';
    this._pos = new THREE.Vector3(0, 18, 26);
    this._target = new THREE.Vector3(0, 0, 0);
    this._bank = 0; this._fovBase = CAM.fov; this._orbitAngle = 0;
    this._up = new THREE.Vector3(0, 1, 0);
    this._menuPos = new THREE.Vector3(); this._menuTarget = new THREE.Vector3(0, -1, 0);
    this._headWorld = new THREE.Vector3(); this._aheadWorld = new THREE.Vector3(); this._moveDir = new THREE.Vector3();
    this._side = new THREE.Vector3(); this._desiredPos = new THREE.Vector3(); this._lookAt = new THREE.Vector3();
    this._reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
  }
  setMode(mode) { this.mode = mode; }
  update(dt, gameState, elapsed) {
    if (this.mode === 'menu' || !gameState || !gameState.snake) this._updateMenuOrbit(dt, elapsed);
    else this._updateFollow(dt, gameState, elapsed);
    this.camera.position.copy(this._pos);
    this.camera.up.copy(this._up);
    this.camera.lookAt(this._target);
    this.camera.rotation.z += this._bank;
  }
  _updateMenuOrbit(dt, elapsed) {
    this._orbitAngle += CAM.menuOrbitSpeed * dt;
    const r = CAM.menuOrbitRadius;
    const x = Math.cos(this._orbitAngle) * r, z = Math.sin(this._orbitAngle) * r;
    const y = CAM.menuOrbitHeight + Math.sin(elapsed * 0.4) * 1.6;
    this._menuPos.set(x, y, z);
    this._pos.lerp(this._menuPos, 1 - Math.exp(-1.6 * dt));
    this._target.lerp(this._menuTarget, 1 - Math.exp(-2.0 * dt));
    this._bank = THREE.MathUtils.lerp(this._bank, 0, 1 - Math.exp(-3 * dt));
    this._applyFov(this._fovBase, dt);
  }
  _updateFollow(dt, gameState, elapsed) {
    const { snake, moveT, speedBoost } = gameState;
    const head = snake.body[0], dir = snake.direction;
    const prev = snake.prevBody[0] || head;
    const t = THREE.MathUtils.clamp(moveT, 0, 1);
    const gx = THREE.MathUtils.lerp(prev.x, head.x, t);
    const gy = THREE.MathUtils.lerp(prev.y, head.y, t);
    const headWorld = gridToWorld(gx, gy, this._headWorld);
    const aheadWorld = gridToWorld(gx + dir.x, gy + dir.y, this._aheadWorld);
    const moveDir = this._moveDir.subVectors(aheadWorld, headWorld);
    if (moveDir.lengthSq() < 1e-6) moveDir.set(0, 0, -1);
    moveDir.normalize();
    const side = this._side.crossVectors(moveDir, this._up).normalize();
    const desiredPos = this._desiredPos.copy(headWorld).addScaledVector(moveDir, -CAM.followDistance).addScaledVector(side, CAM.lateralOffset || 0);
    desiredPos.y += CAM.followHeight;
    const groundY = surfaceYLocal(desiredPos.x, desiredPos.z);
    desiredPos.y = Math.max(desiredPos.y, groundY + 2.2);
    this._pos.lerp(desiredPos, 1 - Math.exp(-CAM.posLerp * dt));
    const lookAt = this._lookAt.copy(headWorld).addScaledVector(moveDir, CAM.lookAhead);
    lookAt.y += 1.2;
    this._target.lerp(lookAt, 1 - Math.exp(-CAM.targetLerp * dt));
    const lateral = moveDir.x;
    const bankTarget = this._reducedMotion ? 0 : -lateral * CAM.bankAmount;
    this._bank = THREE.MathUtils.lerp(this._bank, bankTarget, 1 - Math.exp(-4.0 * dt));
    this._applyFov(this._fovBase + (speedBoost && !this._reducedMotion ? CAM.fovBoost : 0), dt);
  }
  _applyFov(targetFov, dt) {
    const fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, 1 - Math.exp(-3.5 * dt));
    if (Math.abs(fov - this.camera.fov) > 0.01) { this.camera.fov = fov; this.camera.updateProjectionMatrix(); }
  }
}
