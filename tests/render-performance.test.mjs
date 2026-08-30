import assert from 'node:assert/strict';
import test from 'node:test';

import {
  frameIntervalForMode,
  frameRemainder,
  isSoftwareRendererName,
  percentile,
  pixelRatioForQuality,
  qualityLevelForGpuTime,
  targetFpsForMode,
} from '../public/game/assets/js/render-performance.js';

test('caps active gameplay at 60 FPS and idle states at 30 FPS', () => {
  assert.equal(targetFpsForMode('playing'), 60);
  assert.equal(targetFpsForMode('menu'), 30);
  assert.equal(targetFpsForMode('paused'), 30);
  assert.equal(targetFpsForMode('gameover'), 30);
  assert.equal(frameIntervalForMode('playing'), 1000 / 60);
  assert.equal(frameIntervalForMode('menu'), 1000 / 30);
});

test('does not schedule a duplicate frame at floating-point interval boundaries', () => {
  const interval = 1000 / 30;
  assert.equal(frameRemainder(interval * 2 - Number.EPSILON, interval), 0);
  assert.ok(Math.abs(frameRemainder(interval + 1.25, interval) - 1.25) < 0.000001);
});

test('caps Retina resolution and degrades renderer and composer to the same DPR', () => {
  assert.equal(pixelRatioForQuality(2, 0), 1.5);
  assert.equal(pixelRatioForQuality(2, 1), 1);
  assert.equal(pixelRatioForQuality(2, 2), 0.75);
  assert.equal(pixelRatioForQuality(1.25, 0), 1.25);
  assert.equal(pixelRatioForQuality(0, 0), 1);
});

test('uses p90 GPU time with hysteresis to adjust quality', () => {
  assert.equal(percentile([4, 8, 12, 16, 20], 0.9), 20);
  assert.equal(qualityLevelForGpuTime(16, 0), 1);
  assert.equal(qualityLevelForGpuTime(16, 1), 2);
  assert.equal(qualityLevelForGpuTime(7, 2), 1);
  assert.equal(qualityLevelForGpuTime(7, 1, 1), 1);
  assert.equal(qualityLevelForGpuTime(11, 1), 1);
});

test('recognizes common software WebGL renderers without penalizing hardware Metal', () => {
  assert.equal(isSoftwareRendererName('ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device))'), true);
  assert.equal(isSoftwareRendererName('llvmpipe (LLVM 17.0.6, 256 bits)'), true);
  assert.equal(isSoftwareRendererName('Microsoft Basic Render Driver'), true);
  assert.equal(isSoftwareRendererName('ANGLE Metal Renderer: Apple M2'), false);
  assert.equal(isSoftwareRendererName('AMD Radeon Pro 5500M OpenGL Engine'), false);
});
