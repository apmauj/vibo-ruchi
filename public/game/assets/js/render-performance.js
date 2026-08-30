export const RENDER_FPS = Object.freeze({
  active: 60,
  idle: 30,
});

export function targetFpsForMode(mode) {
  return mode === 'playing' ? RENDER_FPS.active : RENDER_FPS.idle;
}

export function frameIntervalForMode(mode) {
  return 1000 / targetFpsForMode(mode);
}

export function frameRemainder(elapsed, interval) {
  const remainder = elapsed % interval;
  return interval - remainder < 0.5 ? 0 : remainder;
}

export function percentile(values, ratio) {
  if (!values.length) return 0;
  const sorted = Array.from(values).sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * ratio) - 1));
  return sorted[index];
}

export function qualityLevelForGpuTime(p90Ms, currentLevel, minimumLevel = 0, frameBudgetMs = 1000 / 60) {
  if (!Number.isFinite(p90Ms) || p90Ms <= 0) return currentLevel;
  if (p90Ms > frameBudgetMs * 0.9 && currentLevel < 2) return currentLevel + 1;
  if (p90Ms < frameBudgetMs * 0.55 && currentLevel > minimumLevel) return currentLevel - 1;
  return currentLevel;
}

export function pixelRatioForQuality(devicePixelRatio, qualityLevel, maxPixelRatio = 1.5) {
  const safeDeviceRatio = Number.isFinite(devicePixelRatio) && devicePixelRatio > 0 ? devicePixelRatio : 1;
  const safeMaxRatio = Number.isFinite(maxPixelRatio) && maxPixelRatio > 0 ? maxPixelRatio : 1.5;
  const baseRatio = Math.min(safeDeviceRatio, safeMaxRatio);

  if (qualityLevel >= 2) return Math.min(baseRatio, 0.75);
  if (qualityLevel >= 1) return Math.min(baseRatio, 1);
  return baseRatio;
}

export function isSoftwareRendererName(rendererName = '') {
  return /swiftshader|llvmpipe|software rasterizer|warp|microsoft basic render/i.test(String(rendererName));
}
