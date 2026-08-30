// ============================================================
// config.js — Tunables centralizados del render 3D AAA
// ============================================================

export const CONFIG = {
  grid: 20,
  cell: 1.0,
  get boardW() { return this.grid * this.cell; },

  // --- Superficie curva (valle + horizonte) ---
  valleyDepth: 2.0,
  horizonRise: 1.1,
  surfaceSegments: 48,
  surfaceModes: {
    flat:  { valleyDepth: 0,   horizonRise: 0 },
    soft:  { valleyDepth: 2.0, horizonRise: 1.1 },
    curve: { valleyDepth: 5.5, horizonRise: 2.6 },
  },

  camera: {
    fov: 58, near: 0.1, far: 400,
    followDistance: 17.6, followHeight: 9.6, lookAhead: 4.5,
    lateralOffset: 2.3, posLerp: 5.0, targetLerp: 6.0,
    bankAmount: 0.22, menuOrbitRadius: 26, menuOrbitHeight: 14,
    menuOrbitSpeed: 0.12, shakeDecay: 6.0, fovBoost: 8,
  },

  bloom: { strength: 0.88, radius: 0.42, threshold: 0.45 },

  snake: {
    headRadius: 0.62, bodyRadius: 0.46, bodyTaper: 0.55, tailPinch: 0.16,
    bodyLift: 0.38, maxTubeCells: 120, tubeSubdiv: 4, tubeRadialSegs: 12,
    slitherAmp: 0.085, slitherFreq: 1.6, slitherSpeed: 2.1, undulateAmp: 0.03,
    energyWaveAmp: 0.05, energyWaveFreq: 2.2, energyWaveSpeed: 3.4, rippleDuration: 0.7,
    trailWidth: 0.46, trailFade: 0.9, trailMaxPoints: 320, trailSpawnDist: 0.04,
    headLightIntensity: 0.85, headLightDistance: 10, bankAmount: 0.16,
    blinkMinInterval: 2.2, blinkMaxInterval: 5.5, breatheAmp: 0.04, breatheSpeed: 3.0,
  },

  items: {
    orbRadius: 0.46, bobAmp: 0.16, bobSpeed: 2.2, targetHaloSpeed: 2.4,
    beamHeight: 6.0, spawnPopDuration: 0.35, labelHeight: 1.42, labelMaxWidth: 2.9,
  },

  particles: {
    max: 900, gravity: -4.2, drag: 0.92,
    burstCorrect: 26, burstConfetti: 90, burstBonus: 18, burstError: 12, burstGameOver: 120,
  },

  maxPixelRatio: 1.5,

  characters: {
    lili: { main: 0x4ecdc4, head: 0x45b7d1, glow: 0x7cf7ec, cheek: 0xff9fc0 },
    toto: { main: 0x54a0ff, head: 0x2e86de, glow: 0x9ec9ff, cheek: 0xffb3d1 },
    mimi: { main: 0xff6b9d, head: 0xe84393, glow: 0xffb3d1, cheek: 0xffc9d9 },
    sol:  { main: 0xfeca57, head: 0xf9ca24, glow: 0xffe9a3, cheek: 0xff9f9f },
  },

  env: {
    bgTop: 0x0a0618, bgBottom: 0x1a0f2e, gridLine: 0x2ea8ff, gridLineDim: 0x1b3a5c,
    railColor: 0x00e5ff, valleyGlow: 0x0e2a4a, starCount: 900,
    fogNear: 30, fogFar: 120, ambient: 0x334466, ambientIntensity: 0.55,
    keyLight: 0xbfd4ff, keyIntensity: 0.9,
  },

  itemColors: {
    target: 0xffe66d, targetGlow: 0xfff3b0, normal: 0x59d9ff, distractor: 0x8a7fa8,
    bonus: 0xff9ff3, obstacle: 0x7f5af0, error: 0xff5f6d,
  },
};
