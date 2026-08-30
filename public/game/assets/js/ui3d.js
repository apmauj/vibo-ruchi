// ui3d.js — Overlay UI (HUD, menú, pausa, fin) + input + swipe para mobile.
// Estilo: glassmorphism neón sobre el canvas 3D.
import { audio } from './audio3d.js';
import { CHARACTERS, DIFFICULTIES, ALL_WORDS } from './words.js';
import { DEFAULT_GAME_OPTIONS, SPEED_LIMITS_MS, normalizeGameOptions } from './game-rules.js';
import { ProgressModal } from './progress-modal.js';

export class UI3D {
  constructor(root, game) {
    this.root = root; this.game = game;
    this._menuState = {
      characterId: 'lili', difficultyId: 'easy', showWord: true, soundOn: true, musicOn: true,
      ...DEFAULT_GAME_OPTIONS,
    };
    this._playerSnapshot = { activePlayerId: null, players: [], progress: {} };
    this._frameCache = { score: null, words: null, lives: null, relaxed: null, combo: null, boost: null, star: null };
    this._hudNameCache = null;
    this._wordCache = { word: null, syllableIndex: -1, showWord: null };
    this._buildDom(); this._loadPrefs();
    this.progressModal = new ProgressModal(this.root, this.game.playerData);
    this._renderCharGrid(); this._renderDiffGrid(); this._bind();
    this.showMenu();
  }

  // ---------- DOM ----------
  _buildDom() {
    this.root.innerHTML = `
      <div class="hud" id="hud" hidden>
        <div class="hud-top">
          <div class="hud-chip"><span class="hud-chip-label">JUGADOR</span><span class="hud-chip-val" id="hud-name">—</span></div>
          <div class="hud-chip"><span class="hud-chip-label">SCORE</span><span class="hud-chip-val accent" id="hud-score">0</span></div>
          <div class="hud-chip"><span class="hud-chip-label">PALABRAS</span><span class="hud-chip-val" id="hud-words">0</span></div>
          <div class="hud-chip lives"><span class="hud-chip-label">VIDAS</span><span class="hud-chip-val" id="hud-lives">♥♥♥</span></div>
          <div class="hud-chip" id="hud-combo-chip" hidden><span class="hud-chip-label">COMBO</span><span class="hud-chip-val combo" id="hud-combo">x1</span></div>
          <div class="hud-chip" id="hud-boost-chip" hidden><span class="hud-chip-label">⚡</span><span class="hud-chip-val turbo">TURBO</span></div>
          <div class="hud-chip" id="hud-star-chip" hidden><span class="hud-chip-label">⭐</span><span class="hud-chip-val star">INVENCIBLE</span></div>
          <button class="icon-btn" id="btn-pause" title="Pausa (Esc)">⏸</button>
        </div>
        <div class="word-panel" id="word-panel">
          <div class="word-label">PALABRA</div>
          <div class="word-syllables" id="word-syl"></div>
        </div>
        <div class="mobile-pad" id="mobile-pad">
          <div class="pad-row"><button data-dir="left" aria-label="Girar izquierda">◀</button><button data-dir="right" aria-label="Girar derecha">▶</button></div>
        </div>
      </div>

      <div class="screen menu-screen" id="menu-screen">
        <div class="menu-card">
          <div class="logo">
            <div class="logo-snake">🐍</div>
            <h1>SNAKE<br><span class="accent">DE SÍLABAS</span></h1>
            <div class="logo-3d">3D</div>
          </div>
          <p class="subtitle">Aprendé a leer jugando con la viborita</p>

          <div class="field">
            <label>JUGADOR</label>
            <div class="player-picker">
              <select id="player-select" aria-label="Jugador activo"></select>
              <button class="progress-btn" id="btn-progress" type="button" aria-label="Abrir progreso, logros y ranking" title="Progreso y ranking">🏆</button>
              <button class="add-player-btn" id="btn-add-player" type="button" aria-label="Agregar jugador">+</button>
            </div>
            <div class="player-create" id="player-create" hidden>
              <input id="in-new-player" maxlength="14" placeholder="Nombre del jugador" autocomplete="off">
              <button id="btn-create-player" type="button">&#10003;</button>
              <button id="btn-cancel-player" type="button">&times;</button>
            </div>
            <p class="player-error" id="player-error" role="alert" hidden></p>
          </div>

          <div class="field">
            <label>PERSONAJE</label>
            <div class="char-grid" id="char-grid"></div>
          </div>

          <div class="field">
            <label>DIFICULTAD</label>
            <div class="diff-grid" id="diff-grid"></div>
          </div>

          <div class="field">
            <label>REGLAS DE PARTIDA</label>
            <div class="settings-grid">
              <label class="setting-toggle"><input type="checkbox" id="opt-relaxed" checked><span class="toggle-mark"></span><span><b>Modo relajado</b><small>Los choques no quitan vidas</small></span></label>
              <label class="setting-toggle"><input type="checkbox" id="opt-obstacles"><span class="toggle-mark"></span><span><b>Obstáculos</b><small>Agrega barreras al tablero</small></span></label>
              <label class="setting-toggle"><input type="checkbox" id="opt-distractors"><span class="toggle-mark"></span><span><b>Distractores</b><small>Agrega sílabas que no pertenecen</small></span></label>
            </div>
            <div class="speed-setting">
              <div class="speed-heading"><span>VELOCIDAD</span><strong id="speed-label">Normal</strong></div>
              <input type="range" id="opt-speed" min="160" max="420" step="10" value="280" aria-label="Velocidad de la serpiente">
              <div class="speed-scale"><span>Rápida</span><span>Tranquila</span></div>
            </div>
          </div>

          <div class="field">
            <label>AYUDAS Y AUDIO</label>
            <div class="options">
              <label class="opt"><input type="checkbox" id="opt-showword" checked><span>Mostrar palabra completa</span></label>
              <label class="opt"><input type="checkbox" id="opt-sound" checked><span>Sonidos</span></label>
              <label class="opt"><input type="checkbox" id="opt-music" checked><span>Música</span></label>
            </div>
          </div>

          <button class="primary-btn" id="btn-start">▶ JUGAR</button>

          <div class="hint">◀ ▶ = girar (también A/D) · Espacio / Esc = pausa · En mobile: botones ◀ ▶ o deslizar</div>
        </div>
      </div>

      <div class="screen pause-screen" id="pause-screen" hidden>
        <div class="menu-card small">
          <h2>PAUSA</h2>
          <div class="pause-actions">
            <button class="primary-btn" id="btn-resume">▶ CONTINUAR</button>
            <button class="ghost-btn" id="btn-quit">🏁 FINALIZAR PARTIDA</button>
          </div>
        </div>
      </div>

      <div class="screen gameover-screen" id="gameover-screen" hidden>
        <div class="menu-card">
          <div class="go-emoji">🏁</div>
          <h2>¡PARTIDA<br><span class="accent">TERMINADA!</span></h2>
          <div class="go-stats" id="go-stats"></div>
          <div class="go-actions">
            <button class="primary-btn" id="btn-replay">↻ JUGAR DE NUEVO</button>
            <button class="ghost-btn trophy-action" id="btn-go-progress">🏆 VER PROGRESO Y RANKING</button>
            <button class="ghost-btn" id="btn-go-quit">⟲ MENÚ</button>
          </div>
        </div>
      </div>
    `;
    // Cache
    this.el = {
      hud: this.root.querySelector('#hud'),
      name: this.root.querySelector('#hud-name'),
      score: this.root.querySelector('#hud-score'),
      words: this.root.querySelector('#hud-words'),
      lives: this.root.querySelector('#hud-lives'),
      comboChip: this.root.querySelector('#hud-combo-chip'),
      combo: this.root.querySelector('#hud-combo'),
      boostChip: this.root.querySelector('#hud-boost-chip'),
      starChip: this.root.querySelector('#hud-star-chip'),
      pause: this.root.querySelector('#btn-pause'),
      wordPanel: this.root.querySelector('#word-panel'),
      wordSyl: this.root.querySelector('#word-syl'),
      mobilePad: this.root.querySelector('#mobile-pad'),
      menuScreen: this.root.querySelector('#menu-screen'),
      gameoverScreen: this.root.querySelector('#gameover-screen'),
      pauseScreen: this.root.querySelector('#pause-screen'),
      playerSelect: this.root.querySelector('#player-select'),
      btnProgress: this.root.querySelector('#btn-progress'),
      btnAddPlayer: this.root.querySelector('#btn-add-player'),
      playerCreate: this.root.querySelector('#player-create'),
      inNewPlayer: this.root.querySelector('#in-new-player'),
      btnCreatePlayer: this.root.querySelector('#btn-create-player'),
      btnCancelPlayer: this.root.querySelector('#btn-cancel-player'),
      playerError: this.root.querySelector('#player-error'),
      charGrid: this.root.querySelector('#char-grid'),
      diffGrid: this.root.querySelector('#diff-grid'),
      optRelaxed: this.root.querySelector('#opt-relaxed'),
      optObstacles: this.root.querySelector('#opt-obstacles'),
      optDistractors: this.root.querySelector('#opt-distractors'),
      optSpeed: this.root.querySelector('#opt-speed'),
      speedLabel: this.root.querySelector('#speed-label'),
      optShowWord: this.root.querySelector('#opt-showword'),
      optSound: this.root.querySelector('#opt-sound'),
      optMusic: this.root.querySelector('#opt-music'),
      btnStart: this.root.querySelector('#btn-start'),
      btnResume: this.root.querySelector('#btn-resume'),
      btnQuit: this.root.querySelector('#btn-quit'),
      btnReplay: this.root.querySelector('#btn-replay'),
      btnGoProgress: this.root.querySelector('#btn-go-progress'),
      btnGoQuit: this.root.querySelector('#btn-go-quit'),
      goStats: this.root.querySelector('#go-stats'),
    };
    this.el.optSpeed.min = String(SPEED_LIMITS_MS.min);
    this.el.optSpeed.max = String(SPEED_LIMITS_MS.max);
    this.el.optSpeed.step = String(SPEED_LIMITS_MS.step);
    this._renderCharGrid(); this._renderDiffGrid();
  }

  _renderCharGrid() {
    this.el.charGrid.innerHTML = '';
    for (const c of CHARACTERS) {
      const b = document.createElement('button');
      b.className = 'char-btn' + (c.id === this._menuState.characterId ? ' sel' : '');
      b.style.setProperty('--char-color', c.color);
      b.innerHTML = `<div class="char-dot"></div><div class="char-name">${c.name}</div><div class="char-desc">${c.desc}</div>`;
      b.onclick = () => { this._menuState.characterId = c.id; this._savePrefs(); this._renderCharGrid(); audio.ensure(); audio.click(); };
      this.el.charGrid.appendChild(b);
    }
  }

  _renderDiffGrid() {
    this.el.diffGrid.innerHTML = '';
    for (const d of DIFFICULTIES) {
      const b = document.createElement('button');
      b.className = 'diff-btn' + (d.id === this._menuState.difficultyId ? ' sel' : '');
      b.innerHTML = `<div class="diff-name">${d.name}</div><div class="diff-desc">${d.desc}</div>`;
      b.onclick = () => { this._menuState.difficultyId = d.id; this._savePrefs(); this._renderDiffGrid(); audio.ensure(); audio.click(); };
      this.el.diffGrid.appendChild(b);
    }
  }

  _bind() {
    this.el.playerSelect.onchange = async (e) => {
      await this.game.playerData.selectPlayer(e.target.value);
      await this._refreshPlayerData();
      audio.ensure(); audio.click();
    };
    this.el.btnProgress.onclick = () => {
      audio.ensure(); audio.click();
      void this.progressModal.open(this._activePlayer()?.id, 'summary');
    };
    this.el.btnAddPlayer.onclick = () => this._showPlayerCreate();
    this.el.btnCancelPlayer.onclick = () => this._hidePlayerCreate();
    this.el.btnCreatePlayer.onclick = () => { void this._createPlayer(); };
    this.el.inNewPlayer.onkeydown = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); void this._createPlayer(); }
      if (e.key === 'Escape') { e.preventDefault(); this._hidePlayerCreate(); }
    };
    this.el.optRelaxed.onchange = (e) => { this._menuState.relaxedMode = e.target.checked; this._savePrefs(); };
    this.el.optObstacles.onchange = (e) => { this._menuState.obstaclesOn = e.target.checked; this._savePrefs(); };
    this.el.optDistractors.onchange = (e) => { this._menuState.distractorsOn = e.target.checked; this._savePrefs(); };
    this.el.optSpeed.oninput = (e) => {
      this._menuState.speedMs = Number(e.target.value);
      this._updateSpeedLabel();
    };
    this.el.optSpeed.onchange = () => this._savePrefs();
    this.el.optShowWord.onchange = (e) => { this._menuState.showWord = e.target.checked; this._savePrefs(); };
    this.el.optSound.onchange = (e) => { this._menuState.soundOn = e.target.checked; this._savePrefs(); audio.setEnabled(e.target.checked); };
    this.el.optMusic.onchange = (e) => { this._menuState.musicOn = e.target.checked; this._savePrefs(); audio.setMusic(e.target.checked); };
    this.el.btnStart.onclick = () => { audio.ensure(); audio.resume(); audio.click(); this._start(); };
    this.el.btnResume.onclick = () => { audio.click(); this.game.resume(); };
    this.el.btnQuit.onclick = () => { audio.click(); this.game.finishGame(); };
    this.el.btnReplay.onclick = () => { audio.click(); this._start(); };
    this.el.btnGoProgress.onclick = () => {
      audio.click();
      void this.progressModal.open(this._activePlayer()?.id, 'ranking');
    };
    this.el.btnGoQuit.onclick = () => { audio.click(); this.game.quitToMenu(); };
    this.el.pause.onclick = () => { audio.click(); this.game.pause(); };
    // Mobile pad
    this.el.mobilePad.querySelectorAll('button').forEach(b => {
      const dir = b.dataset.dir;
      const fire = (e) => { e.preventDefault(); this.game.swipe(dir); };
      b.addEventListener('touchstart', fire, { passive: false });
      b.addEventListener('mousedown', fire);
    });
    // Swipe sobre el documento
    let sx = 0, sy = 0;
    document.addEventListener('touchstart', (e) => { const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; }, { passive: true });
    document.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0]; const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;
      if (Math.abs(dx) > Math.abs(dy)) this.game.swipe(dx > 0 ? 'right' : 'left');
      else this.game.swipe(dy > 0 ? 'down' : 'up');
    }, { passive: true });
  }

  async _refreshPlayerData() {
    this._playerSnapshot = await this.game.playerData.getSnapshot();
    this.el.playerSelect.replaceChildren();
    for (const player of this._playerSnapshot.players) {
      const option = document.createElement('option');
      option.value = player.id;
      option.textContent = player.name;
      option.selected = player.id === this._playerSnapshot.activePlayerId;
      this.el.playerSelect.appendChild(option);
    }
    const hasPlayer = Boolean(this._activePlayer());
    this.el.playerSelect.disabled = !hasPlayer;
    this.el.btnProgress.disabled = !hasPlayer;
    this.el.btnStart.disabled = !hasPlayer;
    if (!hasPlayer) this._showPlayerCreate();
  }

  _showPlayerCreate() {
    this.el.playerCreate.hidden = false;
    this.el.playerError.hidden = true;
    this.el.inNewPlayer.value = '';
    this.el.inNewPlayer.focus();
  }

  _hidePlayerCreate() {
    if (!this._activePlayer()) return;
    this.el.playerCreate.hidden = true;
    this.el.playerError.hidden = true;
  }

  async _createPlayer() {
    try {
      await this.game.playerData.createPlayer(this.el.inNewPlayer.value);
      this.el.playerCreate.hidden = true;
      this.el.playerError.hidden = true;
      await this._refreshPlayerData();
      audio.ensure(); audio.click();
    } catch (error) {
      this.el.playerError.textContent = error?.message || 'No se pudo crear el jugador.';
      this.el.playerError.hidden = false;
      this.el.inNewPlayer.focus();
    }
  }

  _activePlayer() {
    return this._playerSnapshot.players.find(player => player.id === this._playerSnapshot.activePlayerId) || null;
  }

  _loadPrefs() {
    try {
      const p = JSON.parse(localStorage.getItem('snake3d_prefs') || '{}');
      Object.assign(this._menuState, p);
      Object.assign(this._menuState, normalizeGameOptions(p));
      delete this._menuState.playerName;
      this.el.optRelaxed.checked = this._menuState.relaxedMode;
      this.el.optObstacles.checked = this._menuState.obstaclesOn;
      this.el.optDistractors.checked = this._menuState.distractorsOn;
      this.el.optSpeed.value = String(this._menuState.speedMs);
      this._updateSpeedLabel();
      this.el.optShowWord.checked = this._menuState.showWord;
      this.el.optSound.checked = this._menuState.soundOn;
      this.el.optMusic.checked = this._menuState.musicOn;
    } catch (e) {}
  }
  _savePrefs() { try { localStorage.setItem('snake3d_prefs', JSON.stringify(this._menuState)); } catch (e) {} }
  _updateSpeedLabel() {
    const speed = this._menuState.speedMs;
    const pace = speed <= 210 ? 'Rápida' : speed <= 320 ? 'Normal' : 'Tranquila';
    this.el.speedLabel.textContent = pace + ' · ' + speed + ' ms';
  }

  _start() {
    const player = this._activePlayer();
    if (!player) { this._showPlayerCreate(); return; }
    this.el.menuScreen.hidden = true;
    this.el.gameoverScreen.hidden = true;
    this.el.pauseScreen.hidden = true;
    this.el.hud.hidden = false;
    this.game.startGame({
      playerId: player.id,
      playerName: player.name,
      characterId: this._menuState.characterId,
      difficultyId: this._menuState.difficultyId,
      speedMs: this._menuState.speedMs,
      relaxedMode: this._menuState.relaxedMode,
      obstaclesOn: this._menuState.obstaclesOn,
      distractorsOn: this._menuState.distractorsOn,
      showWord: this._menuState.showWord,
      soundOn: this._menuState.soundOn,
      musicOn: this._menuState.musicOn,
    });
  }

  // ---------- Pantallas ----------
  showMenu() {
    this.el.hud.hidden = true;
    this.el.pauseScreen.hidden = true;
    this.el.gameoverScreen.hidden = true;
    this.el.menuScreen.hidden = false;
    void this._refreshPlayerData();
  }
  showPause() { this.el.pauseScreen.hidden = false; }
  hidePause() { this.el.pauseScreen.hidden = true; }
  showGameOver({ score, words, ranking = [], isPersonalBest, rank, madeRanking, correct, errors }) {
    this.el.hud.hidden = true;
    this.el.pauseScreen.hidden = true;
    this.el.gameoverScreen.hidden = false;
    const acc = correct + errors > 0 ? Math.round((correct / (correct + errors)) * 100) : 0;
    const record = { score: ranking[0]?.score || 0 };
    const isRecord = isPersonalBest;
    this.el.goStats.innerHTML = `
      ${isRecord ? '<div class="record-badge">★ ¡NUEVO RÉCORD! ★</div>' : ''}
      <div class="stat"><span>SCORE</span><b>${score}</b></div>
      <div class="stat"><span>PALABRAS</span><b>${words}</b></div>
      <div class="stat"><span>CORRECTAS</span><b>${correct}</b></div>
      <div class="stat"><span>ERRORES</span><b>${errors}</b></div>
      <div class="stat"><span>PRECISIÓN</span><b>${acc}%</b></div>
      <div class="stat record"><span>RÉCORD</span><b>${record.score || 0}</b></div>
    `;
    if (isPersonalBest) {
      const badge = this.el.goStats.querySelector('.record-badge');
      badge.textContent = '★ ¡NUEVO RÉCORD PERSONAL!' + (madeRanking && rank ? ' · PUESTO #' + rank : '') + ' ★';
    }
    if (rank && !isPersonalBest) {
      const position = document.createElement('div');
      position.className = 'stat';
      position.innerHTML = '<span>POSICIÓN LOCAL</span><b>#' + rank + '</b>';
      this.el.goStats.appendChild(position);
    }
  }

  // ---------- HUD sync ----------
  syncHUD() {
    const s = this.game.state;
    if (this._hudNameCache !== s.playerName) { this._hudNameCache = s.playerName; this.el.name.textContent = s.playerName; }
    this._syncFastHud(s.score, s.words, s.lives, s.combo, s.speedBoost > 0, s.starTimer > 0);
    if (s.currentWord) this._renderWord();
  }

  _renderWord() {
    const s = this.game.state; const word = s.currentWord; if (!word) return;
    const cache = this._wordCache;
    if (cache.word === word && cache.syllableIndex === s.syllableIndex && cache.showWord === s.showWord) return;
    cache.word = word; cache.syllableIndex = s.syllableIndex; cache.showWord = s.showWord;
    this.el.wordPanel.classList.toggle('hidden-word', !s.showWord);
    this.el.wordSyl.innerHTML = word.silabas.map((sy, i) => {
      const done = i < s.syllableIndex; const current = i === s.syllableIndex;
      return `<span class="syl ${done ? 'done' : ''} ${current ? 'current' : ''}">${s.showWord || done || current ? sy : '—'}</span>`;
    }).join('');
  }

  showWord() { this._renderWord(); this.el.wordPanel.classList.add('flash'); setTimeout(() => this.el.wordPanel.classList.remove('flash'), 400); }
  flashSyllable(idx) { this._renderWord(); }
  celebrateWord() { this.el.wordPanel.classList.add('celebrate'); setTimeout(() => this.el.wordPanel.classList.remove('celebrate'), 900); }

  onFrame({ score, words, lives, combo, boost, star }) {
    // Solo actualiza lo que cambia rápido
    this._syncFastHud(score, words, lives, combo, boost, star);
  }

  _syncFastHud(score, words, lives, combo, boost, star) {
    const cache = this._frameCache;
    if (cache.score !== score) { cache.score = score; this.el.score.textContent = score; }
    if (cache.words !== words) { cache.words = words; this.el.words.textContent = words; }
    const relaxed = this.game.state.rules?.relaxedMode === true;
    if (cache.lives !== lives || cache.relaxed !== relaxed) {
      cache.lives = lives; cache.relaxed = relaxed;
      this.el.lives.textContent = relaxed ? '∞' : ('♥'.repeat(Math.max(0, lives)) || '—');
    }
    if (cache.combo !== combo) { cache.combo = combo; this.el.combo.textContent = 'x' + combo; this.el.comboChip.hidden = combo < 2; }
    if (cache.boost !== boost) { cache.boost = boost; this.el.boostChip.hidden = !boost; }
    if (cache.star !== star) { cache.star = star; this.el.starChip.hidden = !star; }
  }
}
