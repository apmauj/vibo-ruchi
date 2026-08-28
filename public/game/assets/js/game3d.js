// game3d.js — Motor de Snake de Sílabas 3D (estado, loop, lógica)
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { Scene3D } from './scene3d.js';
import { Snake3D } from './snake3d.js';
import { Items3D } from './items3d.js';
import { Particles3D } from './particles3d.js';
import { Popups3D } from './popups3d.js';
import { audio } from './audio3d.js';
import { pickWord, pickBonus, CHARACTERS, DIFFICULTIES } from './words.js';
import { LocalPlayerDataRepository } from './player-data-store.js';
import {
  SCORE_CORRECT, SCORE_BONUS, OBSTACLE_COUNT, DISTRACTOR_RATIO,
  createRulesSnapshot, wordCompletionBonus,
} from './game-rules.js';

const G = CONFIG.grid;
const STARTING_LIVES = 3, MAX_LIVES = 5;
const COMBO_WINDOW = 3.2;  // segundos para mantener combo
const CELEBRATE_DURATION = 1.6;
const GROW_EVERY = 2;      // crecer 1 segmento cada 2 sílabas correctas

export class Game3D {
  constructor(canvas, ui, playerData = new LocalPlayerDataRepository()) {
    this.canvas = canvas; this.ui = ui;
    this.playerData = playerData;
    this.scene = new Scene3D(canvas);
    this.snake3D = new Snake3D(this.scene.scene, this.scene.glowTexture);
    this.items3D = new Items3D(this.scene.scene, this.scene.glowTexture);
    this.particles = new Particles3D(this.scene.scene);
    this.popups = new Popups3D(this.scene.scene);
    this._lastTime = 0; this._running = false; this._paused = false;
    this._raf = 0;
    this._nextWordTimer = null;
    this._sessionId = 0;
    this.state = this._freshState();
    this._onKey = this._onKey.bind(this); this._onResize = this._onResize.bind(this);
    window.addEventListener('keydown', this._onKey);
    window.addEventListener('resize', this._onResize);
    this._onResize();
    // Arranca en modo menú: órbita + serpiente "idle"
    this.scene.cameraRig.setMode('menu');
  }

  _freshState() {
    return {
      mode: 'menu',        // menu | playing | paused | gameover
      snake: { body: [], prevBody: [], direction: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, alive: true, celebrateTimer: 0 },
      step: 0,
      moveT: 0,
      stepDuration: 0.3,
      score: 0, words: 0, lives: STARTING_LIVES, combo: 0, lastCorrectAt: 0,
      growPulse: 0, speedBoost: 0, starTimer: 0,
      difficulty: DIFFICULTIES[0],
      rules: createRulesSnapshot('easy'),
      currentWord: null, syllableIndex: 0,
      board: { syllables: [], bonuses: [] },
      obstacles: [],
      syllableCounterForGrow: 0,
      bonusCounter: 0,
      playerId: null,
      playerName: 'Jugador',
      characterId: 'lili',
      showWord: true,
      pendingNextWord: false,
      stats: { correctCount: 0, errorCount: 0 },
    };
  }

  // ---------- Setup de partida ----------
  startGame(opts) {
    this._sessionId++;
    this._clearNextWordTimer();
    Object.assign(this.state, opts);
    this.state.difficulty = DIFFICULTIES.find(d => d.id === (opts.difficultyId || 'easy')) || DIFFICULTIES[0];
    const s = this.state;
    s.rules = createRulesSnapshot(s.difficulty.id, opts);
    s.score = 0; s.words = 0; s.lives = STARTING_LIVES; s.combo = 0;
    s.stepDuration = s.rules.speedMs / 1000;
    s.syllableCounterForGrow = 0; s.bonusCounter = 0; s.growPulse = 0; s.speedBoost = 0; s.starTimer = 0;
    s.stats = { correctCount: 0, errorCount: 0 };
    s.currentWord = null; s.syllableIndex = 0; s.pendingNextWord = false;
    s.board = { syllables: [], bonuses: [] };
    s.snake.body = []; s.snake.prevBody = []; s.snake.direction = { x: 1, y: 0 }; s.snake.nextDir = { x: 1, y: 0 }; s.snake.alive = true; s.snake.celebrateTimer = 0;
    s.obstacles = this._spawnObstacles(s.rules.obstaclesOn ? OBSTACLE_COUNT : 0);

    // Cuerpo inicial: 4 segmentos en el centro, dirección +x
    const cx = (G / 2) | 0, cy = (G / 2) | 0;
    for (let i = 0; i < 4; i++) s.snake.body.push({ x: cx - i, y: cy });
    s.snake.prevBody = s.snake.body.map(p => ({ ...p }));

    s.mode = 'playing'; s.step = 0; s.moveT = 0;
    this.scene.cameraRig.setMode('follow');
    this.snake3D.setCharacter(s.characterId);
    this.items3D.clearAll();
    this.particles.clear();
    this.popups.clear();
    this._loadNextWord(true);
    this.snake3D.reset();
    audio.ensure(); audio.setEnabled(s.soundOn); audio.setMusic(s.musicOn);
    if (s.musicOn) audio.startMusic();
    if (!this._running) { this._running = true; this._lastTime = performance.now(); this._raf = requestAnimationFrame(this._loop.bind(this)); }
    this.ui.syncHUD();
  }

  // ---------- Loop principal ----------
  _loop(now) {
    if (!this._running) return;
    const dt = Math.min(0.05, (now - this._lastTime) / 1000); this._lastTime = now;
    if (!this._paused && this.state.mode === 'playing') this._update(dt);
    else if (this.state.mode === 'menu' || this.state.mode === 'gameover' || this.state.mode === 'paused') {
      this.scene.update(dt, this.state.mode === 'paused' ? this._viewerState() : this.state);
    }
    this.scene.render();
    this._raf = requestAnimationFrame(this._loop.bind(this));
  }

  _update(dt) {
    const s = this.state;
    // Speed boost y star timer decaen
    if (s.speedBoost > 0) { s.speedBoost -= dt; if (s.speedBoost < 0) s.speedBoost = 0; }
    if (s.starTimer > 0) { s.starTimer -= dt; if (s.starTimer < 0) s.starTimer = 0; }
    if (s.combo > 0 && now() - s.lastCorrectAt > COMBO_WINDOW * 1000) s.combo = 0;
    if (s.snake.celebrateTimer > 0) s.snake.celebrateTimer -= dt;
    if (s.growPulse > 0) s.growPulse = Math.max(0, s.growPulse - dt * 2.2);
    // Step de serpiente
    const speedMul = s.speedBoost > 0 ? 1.7 : 1.0;
    s.moveT += dt / (s.stepDuration / speedMul);
    while (s.moveT >= 1) { s.moveT -= 1; this._stepSnake(); if (s.mode !== 'playing') return; }
    // Update 3D
    const gameState3D = { snake: s.snake, moveT: s.moveT, speedBoost: s.speedBoost > 0, growPulse: s.growPulse };
    this.scene.update(dt, gameState3D);
    this.snake3D.update(dt, gameState3D, this.scene.elapsed);
    this.items3D.update(dt, this.scene.elapsed);
    this.particles.update(dt);
    this.popups.update(dt);
    // HUD: combo decae visualmente, etc
    this.ui.onFrame({ score: s.score, words: s.words, lives: s.lives, combo: s.combo, boost: s.speedBoost > 0, star: s.starTimer > 0 });
  }

  _viewerState() {
    // Para modo pausa: congelamos el snake para que no avance
    const s = this.state;
    return { snake: s.snake, moveT: s.moveT, speedBoost: false, growPulse: 0 };
  }

  // ---------- Step / movimiento ----------
  _stepSnake() {
    const s = this.state;
    // Aplicar dirección nueva (evita reversión instantánea)
    const nd = s.snake.nextDir, cd = s.snake.direction;
    if (!(nd.x === -cd.x && nd.y === -cd.y)) s.snake.direction = { ...nd };
    s.snake.prevBody = s.snake.body.map(p => ({ ...p }));

    const head = s.snake.body[0];
    const nh = { x: head.x + s.snake.direction.x, y: head.y + s.snake.direction.y };

    // Colisión con pared (modo relajado => wrap)
    let wrapped = false;
    if (nh.x < 0) { nh.x = G - 1; wrapped = true; }
    else if (nh.x >= G) { nh.x = 0; wrapped = true; }
    if (nh.y < 0) { nh.y = G - 1; wrapped = true; }
    else if (nh.y >= G) { nh.y = 0; wrapped = true; }

    // Colisión con obstáculo
    for (const o of s.obstacles) if (o.x === nh.x && o.y === nh.y) { this._die(); return; }
    // Colisión con cuerpo (no con la cola que se va a mover) — invencibilidad evita
    if (s.starTimer <= 0) {
      for (let i = 0; i < s.snake.body.length - 1; i++) if (s.snake.body[i].x === nh.x && s.snake.body[i].y === nh.y) { this._die(); return; }
    }
    s.snake.body.unshift(nh);

    // ¿Comió sílaba / bonus? Solo un acierto que completa el contador de
    // crecimiento conserva la cola; el resto de pickups no cambia longitud.
    let shouldGrow = false;
    const eatenSyl = s.board.syllables.find(sl => !sl.collected && sl.x === nh.x && sl.y === nh.y);
    if (eatenSyl) {
      shouldGrow = this._eatSyllable(eatenSyl);
    } else {
      const eatenBonus = s.board.bonuses.find(b => !b.collected && b.x === nh.x && b.y === nh.y);
      if (eatenBonus) this._eatBonus(eatenBonus);
    }

    if (!shouldGrow) s.snake.body.pop();
    s.step++; this.ui.syncHUD();
  }

  _die() {
    const s = this.state;
    if (s.starTimer > 0) return; // invencibilidad
    const losesLife = !s.rules.relaxedMode;
    if (losesLife) s.lives--;
    s.combo = 0;
    audio.gameOver();
    this.scene.addShake(0.9);
    const head = s.snake.body[0];
    this.particles.emitError(head.x, head.y);
    this.popups.show('OUCH!', head.x, head.y, 'error', { lift: 2.2, scale: 1.3 });
    s.stats.errorCount++;
    if (losesLife && s.lives <= 0) { this._gameOver(); return; }
    // Respawn: centro, dirección +x
    const cx = (G / 2) | 0, cy = (G / 2) | 0;
    const newBody = []; for (let i = 0; i < Math.min(4, s.snake.body.length); i++) newBody.push({ x: cx - i, y: cy });
    s.snake.body = newBody; s.snake.prevBody = newBody.map(p => ({ ...p }));
    s.snake.direction = { x: 1, y: 0 }; s.snake.nextDir = { x: 1, y: 0 };
    s.snake.celebrateTimer = 0.6;
    s.moveT = 0; this.ui.syncHUD();
  }

  _gameOver() {
    const s = this.state; s.mode = 'gameover'; s.snake.alive = false;
    this._clearNextWordTimer();
    audio.stopMusic();
    this.particles.emitGameOver();
    this.popups.show('GAME OVER', (G / 2) | 0, (G / 2) | 0, 'error', { lift: 4, scale: 2.2 });
    this.scene.addShake(1.4);
    const sessionId = this._sessionId;
    const summary = { score: s.score, words: s.words, correct: s.stats.correctCount, errors: s.stats.errorCount };
    const result = this.playerData.recordGame({
      playerId: s.playerId,
      score: s.score,
      words: s.words,
      difficultyId: s.difficulty.id,
      rules: s.rules,
      correct: s.stats.correctCount,
      errors: s.stats.errorCount,
    });
    Promise.resolve(result).then(ranking => {
      if (this._sessionId === sessionId && s.mode === 'gameover') this.ui.showGameOver({ ...summary, ...ranking });
    }).catch(() => {
      if (this._sessionId === sessionId && s.mode === 'gameover') {
        this.ui.showGameOver({ ...summary, ranking: [], isPersonalBest: false, rank: null, madeRanking: false });
      }
    });
  }

  // ---------- Comida ----------
  _eatSyllable(sl) {
    const s = this.state;
    // Check if this is the next correct syllable in order
    const isCorrect = sl.isTarget && sl.order === s.syllableIndex;
    if (!isCorrect) { this._wrongSyllable(sl); return false; }
    sl.collected = true; s.stats.correctCount++;
    s.syllableCounterForGrow++;
    s.combo++; s.lastCorrectAt = now();
    const comboMul = s.combo >= 3 ? 2 : 1;
    const pts = SCORE_CORRECT * comboMul;
    s.score += pts;
    audio.correct();
    if (s.combo >= 3) audio.combo();
    this.particles.emitCorrect(sl.x, sl.y);
    const popKind = s.combo >= 3 ? 'combo' : 'points';
    this.popups.show(`+${pts}${comboMul > 1 ? ' x2' : ''}`, sl.x, sl.y, popKind, { lift: 1.6, scale: 1.0 });
    const shouldGrow = s.syllableCounterForGrow >= GROW_EVERY;
    s.growPulse = shouldGrow ? 1 : 0.45;
    if (shouldGrow) s.syllableCounterForGrow = 0;
    this.scene.addShake(0.18);
    s.syllableIndex++;
    this.ui.flashSyllable(s.syllableIndex - 1);
    if (s.syllableIndex >= s.currentWord.silabas.length) this._completeWord();
    else this.ui.syncHUD();
    this._syncBoard();
    return shouldGrow;
  }

  _wrongSyllable(sl) {
    const s = this.state;
    s.combo = 0; s.stats.errorCount++;
    audio.error();
    this.particles.emitError(sl.x, sl.y);
    this.popups.show('UPS!', sl.x, sl.y, 'error', { lift: 1.6, scale: 1.0 });
    this.scene.addShake(0.35);
    // El error es pedagógico, no punitivo: la sílaba permanece para que el
    // jugador pueda corregir el orden y el feedback visual rompe el combo.
    this.ui.syncHUD();
    this._syncBoard();
  }

  _eatBonus(b) {
    const s = this.state; b.collected = true; s.bonusCounter++;
    s.score += SCORE_BONUS;
    audio.bonus();
    this.particles.emitBonus(b.x, b.y, parseInt((b.info.color || '#ffe66d').replace('#', ''), 16));
    this.popups.show(b.info.label, b.x, b.y, 'bonus', { lift: 2.0, scale: 1.1 });
    this.scene.addShake(0.25);
    switch (b.info.kind) {
      case 'star': s.starTimer = 5.5; break;
      case 'speed': s.speedBoost = 5.0; break;
      case 'life': if (s.lives < MAX_LIVES) { s.lives++; audio.lifeUp(); } break;
      case 'shrink': {
        const removable = Math.min(3, Math.max(0, s.snake.body.length - 5));
        if (removable > 0) s.snake.body.splice(-removable, removable);
        break;
      }
      default: break;
    }
    this.ui.syncHUD();
    this._syncBoard();
  }

  _completeWord() {
    const s = this.state;
    if (s.pendingNextWord) return;
    const wordBonus = wordCompletionBonus(s.currentWord.silabas.length);
    s.words++; s.score += wordBonus;
    s.snake.celebrateTimer = CELEBRATE_DURATION;
    audio.word();
    this.particles.emitConfetti((G / 2) | 0, (G / 2) | 0, G);
    this.popups.show(`★ ${s.currentWord.palabra} ★`, (G / 2) | 0, (G / 2) | 0, 'word', { lift: 3.0, scale: 2.0 });
    this.popups.show(`+${wordBonus}`, (G / 2) | 0, (G / 2) | 0, 'points', { lift: 4.6, scale: 1.3 });
    // Bonus extra tras completar palabra cada N
    if (s.words % s.difficulty.bonusEvery === 0) this._spawnBonus(true);
    this.scene.addShake(0.45);
    s.growPulse = 1.4;
    this.ui.celebrateWord();
    s.pendingNextWord = true;
    // Esperar un toque antes de cargar siguiente palabra
    const sessionId = this._sessionId;
    this._clearNextWordTimer();
    this._nextWordTimer = setTimeout(() => {
      this._nextWordTimer = null;
      if (this._sessionId === sessionId && s.mode === 'playing') this._loadNextWord(false);
    }, 900);
  }

  // ---------- Board / spawning ----------
  _loadNextWord(first) {
    const s = this.state;
    s.pendingNextWord = false;
    s.currentWord = pickWord(s.difficulty);
    s.syllableIndex = 0;
    s.board.syllables = [];
    s.board.bonuses = s.board.bonuses.filter(b => !b.collected); // mantener bonus no consumidos
    this._spawnSyllables();
    this._syncBoard();
    this.ui.showWord();
  }

  _freeCells() {
    const s = this.state; const occupied = new Set();
    for (const p of s.snake.body) occupied.add(`${p.x},${p.y}`);
    for (const o of s.obstacles) occupied.add(`${o.x},${o.y}`);
    for (const sl of s.board.syllables) if (!sl.collected) occupied.add(`${sl.x},${sl.y}`);
    for (const b of s.board.bonuses) if (!b.collected) occupied.add(`${b.x},${b.y}`);
    const free = [];
    for (let x = 0; x < G; x++) for (let y = 0; y < G; y++) if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    return free;
  }

  _randFreeCell(minDistFromHead = 3) {
    const s = this.state; const head = s.snake.body[0] || { x: (G/2)|0, y: (G/2)|0 };
    const free = this._freeCells().filter(c => Math.abs(c.x - head.x) + Math.abs(c.y - head.y) >= minDistFromHead);
    if (!free.length) return this._freeCells()[0];
    return free[(Math.random() * free.length) | 0];
  }

  _spawnSyllables() {
    const s = this.state; const word = s.currentWord;
    const free = this._freeCells();
    // Mezclar
    for (let i = free.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [free[i], free[j]] = [free[j], free[i]]; }
    let idx = 0;
    for (let i = 0; i < word.silabas.length; i++) {
      const c = free[idx++]; if (!c) break;
      s.board.syllables.push({ x: c.x, y: c.y, text: word.silabas[i], isTarget: true, isDistractor: false, collected: false, order: i });
    }
    // Distractores: sílabas inválidas que parecen válidas
    const distractorCount = s.rules.distractorsOn ? Math.max(1, Math.floor(word.silabas.length * DISTRACTOR_RATIO)) : 0;
    const DPOOL = ['TA','RA','PA','SA','LA','MA','NA','CA','LO','SO','MI','TI','EL','EN','OR','AN','DE','SE','RE','FE'];
    for (let i = 0; i < distractorCount; i++) {
      const c = free[idx++]; if (!c) break;
      const text = DPOOL[(Math.random() * DPOOL.length) | 0];
      s.board.syllables.push({ x: c.x, y: c.y, text, isTarget: false, isDistractor: true, collected: false });
    }
  }

  _spawnBonus(force) {
    const s = this.state;
    if (!force && s.bonusCounter > 0 && s.bonusCounter % s.difficulty.bonusEvery !== 0) return;
    const c = this._randFreeCell(4); if (!c) return;
    s.board.bonuses.push({ x: c.x, y: c.y, info: pickBonus(), collected: false });
    this._syncBoard();
  }

  _spawnObstacles(count) {
    const arr = []; const cx = (G / 2) | 0, cy = (G / 2) | 0;
    const used = new Set([`${cx},${cy}`]);
    // No poner obstáculos cerca del centro (zona de spawn)
    let attempts = 0;
    while (arr.length < count && attempts < count * 30) {
      attempts++;
      const x = (Math.random() * G) | 0, y = (Math.random() * G) | 0;
      const key = `${x},${y}`;
      if (used.has(key)) continue;
      if (Math.abs(x - cx) + Math.abs(y - cy) < 4) continue;
      used.add(key); arr.push({ x, y });
    }
    return arr;
  }

  _syncBoard() { this.items3D.syncBoard(this.state.board, this.state.showWord); this.items3D.syncObstacles(this.state.obstacles); }

  // ---------- Input ----------
  // Esquema de giro relativo (estilo "girar a la izquierda / derecha").
  // La serpiente avanza sola; Izquierda rota 90° CCW y Derecha 90° CW
  // respecto de la dirección actual. La cámara acompaña la nueva heading.
  // Arriba/Abajo no hacen nada. Espacio/P = pausa (igual que Esc).
  // IMPORTANTE: si el foco está en un input/textarea (menú: nombre, etc.),
  // NO interceptamos las teclas — dejamos que lleguen al campo para poder
  // escribir 'p', espacios, etc. Solo Esc sigue funcionando para cerrar.
  _onKey(e) {
    const s = this.state;
    const k = e.key.toLowerCase();
    const tag = (e.target?.tagName || '').toLowerCase();
    const isTyping = tag === 'input' || tag === 'textarea';

    // Escape: pausa/reanuda solo en juego/pausa; nunca intercepta en inputs
    // del menú (deja que el navegador haga lo suyo, p.ej. blur).
    if (k === 'escape') {
      if (s.mode === 'playing') { this.pause(); e.preventDefault(); return; }
      if (s.mode === 'paused') { this.resume(); e.preventDefault(); return; }
      return;
    }

    // Pausa con P o Espacio: solo cuando NO se está escribiendo en un input
    // y solo en modo playing/paused. En menú/gameover las teclas pasan.
    if (!isTyping && (k === 'p' || k === ' ')) {
      if (s.mode === 'playing') { this.pause(); e.preventDefault(); return; }
      if (s.mode === 'paused') { this.resume(); e.preventDefault(); return; }
    }

    if (s.mode !== 'playing') return;

    const cd = s.snake.direction;
    let nd = null;
    if (k === 'arrowleft' || k === 'a') {
      // Giro 90° a la izquierda (CCW desde el POV del jugador)
      nd = { x: cd.y, y: -cd.x };
    } else if (k === 'arrowright' || k === 'd') {
      // Giro 90° a la derecha (CW desde el POV del jugador)
      nd = { x: -cd.y, y: cd.x };
    }
    // Arriba/Abajo/W/S: intencionalmente no hacen nada
    if (nd) { s.snake.nextDir = nd; e.preventDefault(); }
  }

  swipe(dir) {
    const s = this.state; if (s.mode !== 'playing') return;
    const cd = s.snake.direction;
    let nd = null;
    if (dir === 'left') nd = { x: cd.y, y: -cd.x };
    else if (dir === 'right') nd = { x: -cd.y, y: cd.x };
    // up/down ignorados (igual que en teclado)
    if (nd) s.snake.nextDir = nd;
  }

  // ---------- Pausa / reanudación ----------
  pause() { if (this.state.mode !== 'playing') return; this.state.mode = 'paused'; this._paused = true; this.ui.showPause(); }
  resume() { if (this.state.mode !== 'paused') return; this.state.mode = 'playing'; this._paused = false; this._lastTime = performance.now(); this.ui.hidePause(); }
  finishGame() {
    if (this.state.mode !== 'playing' && this.state.mode !== 'paused') return;
    this._paused = false;
    this._gameOver();
  }
  quitToMenu() { this._clearNextWordTimer(); this.state.mode = 'menu'; this._paused = false; audio.stopMusic(); this.scene.cameraRig.setMode('menu'); this.ui.showMenu(); }

  _clearNextWordTimer() {
    if (this._nextWordTimer !== null) {
      clearTimeout(this._nextWordTimer);
      this._nextWordTimer = null;
    }
  }

  // ---------- Resize ----------
  _onResize() {
    const w = this.canvas.clientWidth || window.innerWidth;
    const h = this.canvas.clientHeight || window.innerHeight;
    this.scene.resize(w, h);
  }

  // ---------- Destroy ----------
  dispose() {
    this._running = false;
    cancelAnimationFrame(this._raf);
    this._clearNextWordTimer();
    window.removeEventListener('keydown', this._onKey);
    window.removeEventListener('resize', this._onResize);
    audio.stopMusic();
  }
}

function now() { return performance.now(); }
