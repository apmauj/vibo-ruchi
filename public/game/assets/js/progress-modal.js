import { ACHIEVEMENTS } from './player-data-store.js';
import { DIFFICULTIES } from './words.js';

export class ProgressModal {
  constructor(root, repository) {
    this.root = root;
    this.repository = repository;
    this.activePlayerId = null;
    this.activeTab = 'summary';
    this.rankingDifficulty = null;
    this.lastFocus = null;
    this._build();
    this._bind();
  }

  _build() {
    const overlay = document.createElement('div');
    overlay.className = 'screen progress-screen';
    overlay.id = 'progress-screen';
    overlay.hidden = true;
    overlay.innerHTML = `
      <section class="menu-card progress-modal" role="dialog" aria-modal="true" aria-labelledby="progress-title">
        <header class="progress-modal-header">
          <div><span class="progress-kicker">CENTRO DE PROGRESO</span><h2 id="progress-title">Jugador</h2></div>
          <button class="modal-close" type="button" aria-label="Cerrar">×</button>
        </header>
        <div class="progress-tabs" role="tablist" aria-label="Secciones de progreso">
          <button type="button" role="tab" data-tab="summary">Resumen</button>
          <button type="button" role="tab" data-tab="achievements">Logros</button>
          <button type="button" role="tab" data-tab="ranking">Ranking</button>
        </div>
        <div class="progress-content" id="progress-content" role="tabpanel"></div>
      </section>`;
    this.root.appendChild(overlay);
    this.backgroundElements = [...this.root.children].filter(element => element !== overlay);
    this.el = {
      overlay,
      dialog: overlay.querySelector('.progress-modal'),
      title: overlay.querySelector('#progress-title'),
      close: overlay.querySelector('.modal-close'),
      tabs: [...overlay.querySelectorAll('[data-tab]')],
      content: overlay.querySelector('#progress-content'),
    };
  }

  _bind() {
    this.el.close.onclick = () => this.close();
    this.el.overlay.addEventListener('mousedown', event => { if (event.target === this.el.overlay) this.close(); });
    this.el.tabs.forEach(button => { button.onclick = () => { void this._selectTab(button.dataset.tab); }; });
    this.el.overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); this.close(); return; }
      if (event.key !== 'Tab') return;
      const focusable = [...this.el.dialog.querySelectorAll('button:not([disabled]), select:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }

  async open(playerId, tab = 'summary') {
    if (!playerId) return;
    this.lastFocus = document.activeElement;
    this.activePlayerId = playerId;
    this.activeTab = tab;
    this.backgroundElements.forEach(element => { element.inert = true; });
    this.el.overlay.hidden = false;
    await this._render();
    this.el.close.focus();
  }

  close() {
    if (this.el.overlay.hidden) return;
    this.el.overlay.hidden = true;
    this.backgroundElements.forEach(element => { element.inert = false; });
    this.lastFocus?.focus?.();
  }

  async _selectTab(tab) {
    this.activeTab = tab;
    await this._render();
  }

  async _render() {
    const snapshot = await this.repository.getSnapshot();
    const player = snapshot.players.find(item => item.id === this.activePlayerId);
    if (!player) { this.close(); return; }
    this.el.title.textContent = player.name;
    this.el.tabs.forEach(button => {
      const selected = button.dataset.tab === this.activeTab;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    if (this.activeTab === 'achievements') this._renderAchievements(snapshot.progress[player.id]);
    else if (this.activeTab === 'ranking') await this._renderRanking();
    else this._renderSummary(snapshot.progress[player.id]);
  }

  _renderSummary(progress) {
    const attempts = progress.stats.totalCorrect + progress.stats.totalErrors;
    const accuracy = attempts ? Math.round(progress.stats.totalCorrect / attempts * 100) : 0;
    const cards = [
      ['Mejor puntaje', progress.bestOverall?.score || 0],
      ['Partidas', progress.stats.gamesPlayed],
      ['Palabras', progress.stats.totalWords],
      ['Precisión', `${accuracy}%`],
    ];
    this.el.content.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'progress-stat-grid';
    cards.forEach(([label, value]) => {
      const card = document.createElement('div');
      card.className = 'progress-stat-card';
      card.innerHTML = `<span>${label}</span><strong>${value}</strong>`;
      grid.appendChild(card);
    });
    const bests = document.createElement('div');
    bests.className = 'difficulty-score-list';
    DIFFICULTIES.forEach(difficulty => {
      const row = document.createElement('div');
      const score = progress.bestByDifficulty[difficulty.id]?.score || 0;
      row.innerHTML = `<span>${difficulty.name}<small>${difficulty.desc}</small></span><strong>${score}</strong>`;
      bests.appendChild(row);
    });
    this.el.content.append(grid, bests);
  }

  _renderAchievements(progress) {
    const unlocked = new Map(progress.achievements.map(item => [item.id, item]));
    this.el.content.innerHTML = '';
    const heading = document.createElement('p');
    heading.className = 'achievement-count';
    heading.textContent = `${unlocked.size} de ${ACHIEVEMENTS.length} logros desbloqueados`;
    const grid = document.createElement('div');
    grid.className = 'modal-achievements';
    ACHIEVEMENTS.forEach(achievement => {
      const earned = unlocked.has(achievement.id);
      const card = document.createElement('article');
      card.className = `modal-achievement ${earned ? 'unlocked' : 'locked'}`;
      card.innerHTML = `<span class="achievement-icon">${achievement.icon}</span><div><strong>${achievement.name}</strong><p>${achievement.description}</p></div>`;
      grid.appendChild(card);
    });
    this.el.content.append(heading, grid);
  }

  async _renderRanking() {
    const ranking = await this.repository.getRanking({ difficultyId: this.rankingDifficulty });
    this.el.content.innerHTML = '';
    const filters = document.createElement('div');
    filters.className = 'ranking-filters';
    const options = [{ id: null, name: 'Todos' }, ...DIFFICULTIES];
    options.forEach(option => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = option.name;
      button.className = option.id === this.rankingDifficulty ? 'selected' : '';
      button.onclick = async () => { this.rankingDifficulty = option.id; await this._renderRanking(); };
      filters.appendChild(button);
    });
    const list = document.createElement('ol');
    list.className = 'ranking-list modal-ranking-list';
    ranking.forEach((item, index) => {
      const row = document.createElement('li');
      row.className = `ranking-row ${item.playerId === this.activePlayerId ? 'current' : ''}`;
      const position = document.createElement('span'); position.className = 'ranking-position'; position.textContent = String(index + 1);
      const name = document.createElement('span'); name.className = 'ranking-player'; name.textContent = item.playerName;
      const score = document.createElement('strong'); score.className = 'ranking-score'; score.textContent = String(item.score);
      row.append(position, name, score); list.appendChild(row);
    });
    this.el.content.appendChild(filters);
    if (ranking.length) this.el.content.appendChild(list);
    else {
      const empty = document.createElement('p'); empty.className = 'ranking-empty'; empty.textContent = 'Todavía no hay puntajes en esta categoría.';
      this.el.content.appendChild(empty);
    }
  }
}
