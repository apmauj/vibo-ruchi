// player-data-store.js — Perfiles y progreso local versionados.
// Todos los métodos públicos son async para que una implementación HTTP futura
// pueda reemplazar esta clase sin cambiar Game3D ni UI3D.
import { createRulesSnapshot } from './game-rules.js';

export const PLAYER_DATA_KEY = 'snake3d_player_data_v1';
export const LOCAL_RANKING_LIMIT = 15;
const PREFS_KEY = 'snake3d_prefs';
const LEGACY_RECORD_KEY = 'snake3d_record';
const PRE_ALPHA_RESET_KEY = 'snake3d_pre_alpha_progress_reset';
const SCHEMA_VERSION = 1;

export const ACHIEVEMENTS = Object.freeze([
  { id: 'first_game', icon: '🏁', name: 'Primera partida', description: 'Terminá una partida.' },
  { id: 'score_100', icon: '💯', name: 'Centenario', description: 'Alcanzá 100 puntos.' },
  { id: 'score_500', icon: '🚀', name: 'Imparable', description: 'Alcanzá 500 puntos.' },
  { id: 'words_5', icon: '📚', name: 'Lector veloz', description: 'Completá 5 palabras en una partida.' },
  { id: 'perfect_run', icon: '🎯', name: 'Precisión total', description: 'Terminá con al menos 5 aciertos y sin errores.' },
  { id: 'hard_100', icon: '💎', name: 'Sin miedo', description: 'Alcanzá 100 puntos en difícil.' },
]);

export class LocalPlayerDataRepository {
  constructor({ storage = globalThis.localStorage, now = () => new Date(), createId = defaultId } = {}) {
    this.storage = storage;
    this.now = now;
    this.createId = createId;
    this._memoryDocument = emptyDocument();
    this._memoryResetApplied = false;
  }

  async getSnapshot() {
    return clone(this._read());
  }

  async getRanking({ difficultyId = null, limit = LOCAL_RANKING_LIMIT } = {}) {
    return buildRanking(this._read(), difficultyId).slice(0, Math.max(1, Math.min(LOCAL_RANKING_LIMIT, limit))).map(clone);
  }

  async createPlayer(name) {
    const document = this._read();
    const cleanName = normalizeName(name);
    if (!cleanName) throw new Error('El nombre del jugador es obligatorio.');
    const duplicate = document.players.find(player => player.name.toLocaleLowerCase('es') === cleanName.toLocaleLowerCase('es'));
    if (duplicate) {
      document.activePlayerId = duplicate.id;
      this._write(document);
      return clone(duplicate);
    }
    const timestamp = this.now().toISOString();
    const player = { id: this.createId(), name: cleanName, createdAt: timestamp };
    document.players.push(player);
    document.progress[player.id] = emptyProgress();
    document.activePlayerId = player.id;
    this._write(document);
    return clone(player);
  }

  async selectPlayer(playerId) {
    const document = this._read();
    if (!document.players.some(player => player.id === playerId)) throw new Error('Jugador inexistente.');
    document.activePlayerId = playerId;
    this._write(document);
    return clone(document);
  }

  async recordGame(result) {
    const document = this._read();
    const player = document.players.find(item => item.id === result.playerId);
    if (!player) throw new Error('Jugador inexistente.');
    const progress = document.progress[player.id] || emptyProgress();
    const run = normalizeRun(result, { id: this.createId(), playedAt: this.now().toISOString() });
    const previousBest = progress.bestOverall;

    progress.stats.gamesPlayed += 1;
    progress.stats.totalScore += run.score;
    progress.stats.totalWords += run.words;
    progress.stats.totalCorrect += run.correct;
    progress.stats.totalErrors += run.errors;
    if (!previousBest || compareRuns(run, previousBest) < 0) progress.bestOverall = run;
    const difficultyBest = progress.bestByDifficulty[run.difficultyId];
    if (!difficultyBest || compareRuns(run, difficultyBest) < 0) progress.bestByDifficulty[run.difficultyId] = run;

    const unlocked = new Set(progress.achievements.map(item => item.id));
    for (const achievement of earnedAchievements(run)) {
      if (!unlocked.has(achievement.id)) progress.achievements.push({ id: achievement.id, unlockedAt: run.playedAt });
    }
    document.progress[player.id] = progress;
    this._write(document);

    const ranking = buildRanking(document);
    const rank = ranking.findIndex(item => item.playerId === player.id) + 1;
    return {
      player: clone(player),
      progress: clone(progress),
      isPersonalBest: progress.bestOverall?.id === run.id,
      rank: rank || null,
      madeRanking: rank > 0 && rank <= LOCAL_RANKING_LIMIT,
      ranking: ranking.slice(0, LOCAL_RANKING_LIMIT).map(clone),
      run,
    };
  }

  _read() {
    try {
      const raw = this.storage?.getItem(PLAYER_DATA_KEY);
      if (raw !== null && raw !== undefined) return this._applyPreAlphaReset(normalizeDocument(JSON.parse(raw)));
      const migrated = this._migrateLegacyData();
      this._write(migrated);
      this._markPreAlphaReset();
      return migrated;
    } catch {
      return normalizeDocument(this._memoryDocument);
    }
  }

  _write(document) {
    const normalized = normalizeDocument(document);
    this._memoryDocument = normalized;
    try { this.storage?.setItem(PLAYER_DATA_KEY, JSON.stringify(normalized)); } catch { /* fallback en memoria */ }
  }

  _applyPreAlphaReset(document) {
    if (this._memoryResetApplied || this.storage?.getItem(PRE_ALPHA_RESET_KEY) === 'done') return document;
    document.progress = Object.fromEntries(document.players.map(player => [player.id, emptyProgress()]));
    this._write(document);
    this._markPreAlphaReset();
    return document;
  }

  _markPreAlphaReset() {
    this._memoryResetApplied = true;
    try { this.storage?.setItem(PRE_ALPHA_RESET_KEY, 'done'); } catch { /* fallback en memoria */ }
  }

  _migrateLegacyData() {
    let prefs = {};
    let legacy = null;
    try { prefs = JSON.parse(this.storage?.getItem(PREFS_KEY) || '{}'); } catch { /* preferencias inválidas */ }
    try { legacy = JSON.parse(this.storage?.getItem(LEGACY_RECORD_KEY) || 'null'); } catch { /* récord inválido */ }

    const name = normalizeName(prefs.playerName || legacy?.name);
    if (!name) return emptyDocument();
    const timestamp = this.now().toISOString();
    const player = { id: this.createId(), name, createdAt: timestamp };
    return { version: SCHEMA_VERSION, activePlayerId: player.id, players: [player], progress: { [player.id]: emptyProgress() } };
  }
}

function emptyDocument() {
  return { version: SCHEMA_VERSION, activePlayerId: null, players: [], progress: {} };
}

function emptyProgress() {
  return {
    stats: { gamesPlayed: 0, totalScore: 0, totalWords: 0, totalCorrect: 0, totalErrors: 0 },
    bestOverall: null,
    bestByDifficulty: {},
    achievements: [],
  };
}

function normalizeDocument(value) {
  const document = emptyDocument();
  const seenIds = new Set();
  const seenNames = new Set();
  for (const valuePlayer of Array.isArray(value?.players) ? value.players : []) {
    const player = normalizePlayer(valuePlayer);
    const nameKey = player.name.toLocaleLowerCase('es');
    if (!player.id || !player.name || seenIds.has(player.id) || seenNames.has(nameKey)) continue;
    seenIds.add(player.id); seenNames.add(nameKey); document.players.push(player);
    document.progress[player.id] = normalizeProgress(value?.progress?.[player.id], player.id);
  }
  document.activePlayerId = seenIds.has(value?.activePlayerId) ? value.activePlayerId : document.players[0]?.id || null;
  return document;
}

function normalizePlayer(value) {
  return {
    id: cleanText(value?.id, 80),
    name: normalizeName(value?.name),
    createdAt: validIsoDate(value?.createdAt) || new Date().toISOString(),
  };
}

function normalizeProgress(value, playerId) {
  const progress = emptyProgress();
  progress.stats = {
    gamesPlayed: nonNegativeInteger(value?.stats?.gamesPlayed),
    totalScore: nonNegativeInteger(value?.stats?.totalScore),
    totalWords: nonNegativeInteger(value?.stats?.totalWords),
    totalCorrect: nonNegativeInteger(value?.stats?.totalCorrect),
    totalErrors: nonNegativeInteger(value?.stats?.totalErrors),
  };
  if (value?.bestOverall) progress.bestOverall = normalizeRun({ ...value.bestOverall, playerId }, { id: defaultId(), playedAt: new Date().toISOString() });
  for (const [difficultyId, run] of Object.entries(value?.bestByDifficulty || {})) {
    progress.bestByDifficulty[cleanText(difficultyId, 20)] = normalizeRun({ ...run, playerId }, { id: defaultId(), playedAt: new Date().toISOString() });
  }
  const validAchievements = new Set(ACHIEVEMENTS.map(item => item.id));
  progress.achievements = (Array.isArray(value?.achievements) ? value.achievements : [])
    .filter(item => validAchievements.has(item?.id))
    .map(item => ({ id: item.id, unlockedAt: validIsoDate(item.unlockedAt) || new Date().toISOString() }));
  return progress;
}

function normalizeRun(value, fallback) {
  const difficultyId = cleanText(value?.difficultyId, 20) || 'unknown';
  return {
    id: cleanText(value?.id, 80) || fallback.id,
    playerId: cleanText(value?.playerId, 80),
    score: nonNegativeInteger(value?.score),
    words: nonNegativeInteger(value?.words),
    difficultyId,
    rules: createRulesSnapshot(difficultyId, value?.rules),
    correct: nonNegativeInteger(value?.correct),
    errors: nonNegativeInteger(value?.errors),
    playedAt: validIsoDate(value?.playedAt) || fallback.playedAt,
  };
}

function earnedAchievements(run) {
  return ACHIEVEMENTS.filter(item => {
    if (item.id === 'first_game') return true;
    if (item.id === 'score_100') return run.score >= 100;
    if (item.id === 'score_500') return run.score >= 500;
    if (item.id === 'words_5') return run.words >= 5;
    if (item.id === 'perfect_run') return run.correct >= 5 && run.errors === 0;
    if (item.id === 'hard_100') return run.difficultyId === 'hard' && run.score >= 100;
    return false;
  });
}

function buildRanking(document, difficultyId = null) {
  return document.players.flatMap(player => {
    const progress = document.progress[player.id];
    const best = difficultyId ? progress?.bestByDifficulty[difficultyId] : progress?.bestOverall;
    return best ? [{ playerId: player.id, playerName: player.name, ...best }] : [];
  }).sort(compareRuns);
}

function compareRuns(a, b) {
  return b.score - a.score || b.words - a.words || b.correct - a.correct || a.playedAt.localeCompare(b.playedAt);
}

function normalizeName(value) {
  return cleanText(value, 14);
}

function cleanText(value, maxLength) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function nonNegativeInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
}

function validIsoDate(value) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) return null;
  return new Date(value).toISOString();
}

function defaultId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function clone(value) {
  return structuredClone(value);
}
