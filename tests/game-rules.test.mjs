import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DEFAULT_GAME_OPTIONS,
  createRulesSnapshot,
  normalizeGameOptions,
  wordCompletionBonus,
} from '../public/game/assets/js/game-rules.js';
import { ALL_WORDS, DIFFICULTIES } from '../public/game/assets/js/words.js';

test('normaliza reglas independientes y limita la velocidad al slider', () => {
  assert.deepEqual(normalizeGameOptions(), DEFAULT_GAME_OPTIONS);
  assert.deepEqual(normalizeGameOptions({
    speedMs: 157,
    relaxedMode: false,
    obstaclesOn: true,
    distractorsOn: true,
  }), {
    speedMs: 160,
    relaxedMode: false,
    obstaclesOn: true,
    distractorsOn: true,
  });
  assert.equal(normalizeGameOptions({ speedMs: 999 }).speedMs, 420);
  assert.equal(normalizeGameOptions({ speedMs: 274 }).speedMs, 270);
});

test('serializa una instantánea de reglas preparada para un repositorio remoto', () => {
  assert.deepEqual(createRulesSnapshot('hard', { speedMs: 200, obstaclesOn: true }), {
    difficultyId: 'hard',
    speedMs: 200,
    relaxedMode: true,
    obstaclesOn: true,
    distractorsOn: false,
  });
});

test('el bonus de palabra escala 25 puntos por sílaba', () => {
  assert.equal(wordCompletionBonus(1), 25);
  assert.equal(wordCompletionBonus(2), 50);
  assert.equal(wordCompletionBonus(5), 125);
  assert.equal(wordCompletionBonus(7), 175);
});

test('cada dificultad tiene palabras válidas y los rangos acordados', () => {
  assert.deepEqual(DIFFICULTIES.map(item => [item.id, item.syllablesMin, item.syllablesMax]), [
    ['easy', 1, 3],
    ['medium', 3, 5],
    ['hard', 5, 7],
  ]);
  for (const difficulty of DIFFICULTIES) {
    const eligible = ALL_WORDS.filter(word =>
      word.silabas.length >= difficulty.syllablesMin && word.silabas.length <= difficulty.syllablesMax);
    assert.ok(eligible.length >= 10, `${difficulty.name} necesita un banco suficiente`);
  }
  assert.equal(new Set(ALL_WORDS.map(word => word.palabra)).size, ALL_WORDS.length);
});
