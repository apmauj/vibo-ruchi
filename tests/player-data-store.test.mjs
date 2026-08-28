import assert from 'node:assert/strict';
import test from 'node:test';
import { LOCAL_RANKING_LIMIT, LocalPlayerDataRepository } from '../public/game/assets/js/player-data-store.js';

class MemoryStorage {
  constructor(initial = {}) { this.values = new Map(Object.entries(initial)); }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

function repository(storage = new MemoryStorage()) {
  let id = 0;
  return new LocalPlayerDataRepository({
    storage,
    createId: () => `id-${++id}`,
    now: () => new Date('2026-08-27T12:00:00.000Z'),
  });
}

test('crea perfiles con id interno y mantiene un jugador activo', async () => {
  const data = repository();
  const ana = await data.createPlayer('  Ana  ');
  const bruno = await data.createPlayer('Bruno');
  await data.selectPlayer(ana.id);
  const snapshot = await data.getSnapshot();

  assert.equal(snapshot.players.length, 2);
  assert.equal(snapshot.activePlayerId, ana.id);
  assert.equal(bruno.name, 'Bruno');
  assert.ok(snapshot.progress[ana.id]);
});

test('un nombre repetido selecciona el perfil existente', async () => {
  const data = repository();
  const original = await data.createPlayer('Lola');
  const repeated = await data.createPlayer('lola');
  const snapshot = await data.getSnapshot();

  assert.equal(repeated.id, original.id);
  assert.equal(snapshot.players.length, 1);
  assert.equal(snapshot.activePlayerId, original.id);
});

test('ranking local muestra los 15 mejores jugadores sin duplicarlos', async () => {
  const data = repository();
  for (let index = 1; index <= 18; index++) {
    const player = await data.createPlayer(`Jugador ${index}`);
    await data.recordGame({ playerId: player.id, score: index * 10, words: index, difficultyId: 'easy' });
  }
  const leader = (await data.getSnapshot()).players.find(player => player.name === 'Jugador 18');
  const result = await data.recordGame({ playerId: leader.id, score: 5, difficultyId: 'easy' });

  assert.equal(result.ranking.length, LOCAL_RANKING_LIMIT);
  assert.equal(result.ranking[0].playerName, 'Jugador 18');
  assert.equal(result.ranking.at(-1).playerName, 'Jugador 4');
  assert.equal(result.isPersonalBest, false);
});

test('registra progreso, mejores marcas y logros por perfil', async () => {
  const data = repository();
  const player = await data.createPlayer('Mia');
  const result = await data.recordGame({
    playerId: player.id, score: 520, words: 6, difficultyId: 'hard', correct: 8, errors: 0,
  });

  assert.equal(result.progress.stats.gamesPlayed, 1);
  assert.equal(result.progress.bestOverall.score, 520);
  assert.deepEqual(result.progress.achievements.map(item => item.id).sort(), [
    'first_game', 'hard_100', 'perfect_run', 'score_100', 'score_500', 'words_5',
  ]);
});

test('conserva el jugador y descarta el récord pre-alpha anterior', async () => {
  const storage = new MemoryStorage({
    snake3d_prefs: JSON.stringify({ playerName: 'Pablo' }),
    snake3d_record: JSON.stringify({ name: 'Pablo', score: 240, words: 4, date: '2026-08-20T10:00:00.000Z' }),
  });
  const snapshot = await repository(storage).getSnapshot();
  const player = snapshot.players[0];

  assert.equal(player.name, 'Pablo');
  assert.equal(snapshot.progress[player.id].bestOverall, null);
  assert.ok(storage.getItem('snake3d_player_data_v1'));
});

test('filtra el ranking por dificultad y conserva un solo mejor puntaje por jugador', async () => {
  const data = repository();
  const ana = await data.createPlayer('Ana');
  const bruno = await data.createPlayer('Bruno');
  await data.recordGame({ playerId: ana.id, score: 90, difficultyId: 'easy' });
  await data.recordGame({ playerId: ana.id, score: 180, difficultyId: 'hard' });
  await data.recordGame({ playerId: bruno.id, score: 120, difficultyId: 'easy' });
  await data.recordGame({ playerId: bruno.id, score: 80, difficultyId: 'hard' });

  const easy = await data.getRanking({ difficultyId: 'easy' });
  const hard = await data.getRanking({ difficultyId: 'hard' });

  assert.deepEqual(easy.map(item => [item.playerName, item.score]), [['Bruno', 120], ['Ana', 90]]);
  assert.deepEqual(hard.map(item => [item.playerName, item.score]), [['Ana', 180], ['Bruno', 80]]);
});

test('resetea progreso pre-alpha una sola vez sin borrar perfiles', async () => {
  const player = { id: 'p-1', name: 'Luz', createdAt: '2026-08-20T10:00:00.000Z' };
  const run = { id: 'r-1', playerId: player.id, score: 300, words: 4, difficultyId: 'easy', correct: 8, errors: 1, playedAt: '2026-08-20T10:00:00.000Z' };
  const storage = new MemoryStorage({
    snake3d_player_data_v1: JSON.stringify({
      version: 1,
      activePlayerId: player.id,
      players: [player],
      progress: {
        [player.id]: {
          stats: { gamesPlayed: 1, totalScore: 300, totalWords: 4, totalCorrect: 8, totalErrors: 1 },
          bestOverall: run,
          bestByDifficulty: { easy: run },
          achievements: [{ id: 'first_game', unlockedAt: run.playedAt }],
        },
      },
    }),
  });
  const data = repository(storage);
  const reset = await data.getSnapshot();
  assert.equal(reset.players[0].name, 'Luz');
  assert.equal(reset.progress[player.id].bestOverall, null);

  await data.recordGame({ playerId: player.id, score: 75, difficultyId: 'easy' });
  const preserved = await data.getSnapshot();
  assert.equal(preserved.progress[player.id].bestOverall.score, 75);
});
