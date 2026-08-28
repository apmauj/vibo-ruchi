// game-rules.js — Reglas puras y configuración serializable de una partida.

export const SPEED_LIMITS_MS = Object.freeze({ min: 160, max: 420, step: 10, default: 280 });

export const DEFAULT_GAME_OPTIONS = Object.freeze({
  speedMs: SPEED_LIMITS_MS.default,
  relaxedMode: true,
  obstaclesOn: false,
  distractorsOn: false,
});

export const SCORE_CORRECT = 10;
export const SCORE_BONUS = 25;
export const OBSTACLE_COUNT = 4;
export const DISTRACTOR_RATIO = 0.5;

export function normalizeGameOptions(value = {}) {
  return {
    speedMs: clampToStep(value.speedMs, SPEED_LIMITS_MS),
    relaxedMode: value.relaxedMode !== false,
    obstaclesOn: value.obstaclesOn === true,
    distractorsOn: value.distractorsOn === true,
  };
}

export function createRulesSnapshot(difficultyId, value = {}) {
  return { difficultyId, ...normalizeGameOptions(value) };
}

export function wordCompletionBonus(syllableCount) {
  const count = Math.max(1, Math.trunc(Number(syllableCount) || 1));
  return SCORE_BONUS * count;
}

function clampToStep(value, limits) {
  const number = Number(value);
  const finite = Number.isFinite(number) ? number : limits.default;
  const clamped = Math.max(limits.min, Math.min(limits.max, finite));
  return Math.round(clamped / limits.step) * limits.step;
}
