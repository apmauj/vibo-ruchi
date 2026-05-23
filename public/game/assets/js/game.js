// ============================================================
// words.js
// ============================================================

const WORD_DATABASE = {
  animales: [
    { palabra: "GATO", silabas: ["GA", "TO"], dificultad: 1 },
    { palabra: "PERRO", silabas: ["PE", "RRO"], dificultad: 1 },
    { palabra: "PATO", silabas: ["PA", "TO"], dificultad: 1 },
    { palabra: "LOBO", silabas: ["LO", "BO"], dificultad: 1 },
    { palabra: "OSO", silabas: ["O", "SO"], dificultad: 1 },
    { palabra: "VACA", silabas: ["VA", "CA"], dificultad: 1 },
    { palabra: "RANA", silabas: ["RA", "NA"], dificultad: 1 },
    { palabra: "LLAMA", silabas: ["LLA", "MA"], dificultad: 1 },
    { palabra: "PUMA", silabas: ["PU", "MA"], dificultad: 1 },
    { palabra: "LEÑA", silabas: ["LE", "ÑA"], dificultad: 1 },
    { palabra: "CONEJO", silabas: ["CO", "NE", "JO"], dificultad: 2 },
    { palabra: "CABALLO", silabas: ["CA", "BA", "LLO"], dificultad: 2 },
    { palabra: "MONO", silabas: ["MO", "NO"], dificultad: 2 },
    { palabra: "SAPO", silabas: ["SA", "PO"], dificultad: 2 },
    { palabra: "LAGO", silabas: ["LA", "GO"], dificultad: 2 },
    { palabra: "ARAÑA", silabas: ["A", "RA", "ÑA"], dificultad: 2 },
    { palabra: "JIRAFA", silabas: ["JI", "RA", "FA"], dificultad: 2 },
    { palabra: "TORTUGA", silabas: ["TOR", "TU", "GA"], dificultad: 2 },
    { palabra: "ABEJA", silabas: ["A", "BE", "JA"], dificultad: 2 },
    { palabra: "MARIPOSA", silabas: ["MA", "RI", "PO", "SA"], dificultad: 3 },
    { palabra: "ELEFANTE", silabas: ["E", "LE", "FAN", "TE"], dificultad: 3 },
    { palabra: "COCODRILO", silabas: ["CO", "CO", "DRI", "LO"], dificultad: 3 },
    { palabra: "DELFIN", silabas: ["DEL", "FIN"], dificultad: 2 },
    { palabra: "CANGURO", silabas: ["CAN", "GU", "RO"], dificultad: 3 },
  ],

  colores: [
    { palabra: "ROJO", silabas: ["RO", "JO"], dificultad: 1 },
    { palabra: "AZUL", silabas: ["A", "ZUL"], dificultad: 1 },
    { palabra: "GRIS", silabas: ["GRIS"], dificultad: 1 },
    { palabra: "VERDE", silabas: ["VER", "DE"], dificultad: 2 },
    { palabra: "BLANCO", silabas: ["BLAN", "CO"], dificultad: 2 },
    { palabra: "NEGRO", silabas: ["NE", "GRO"], dificultad: 2 },
    { palabra: "MORADO", silabas: ["MO", "RA", "DO"], dificultad: 2 },
    { palabra: "NARANJA", silabas: ["NA", "RAN", "JA"], dificultad: 3 },
    { palabra: "AMARILLO", silabas: ["A", "MA", "RI", "LLO"], dificultad: 3 },
    { palabra: "CELESTE", silabas: ["CE", "LES", "TE"], dificultad: 2 },
    { palabra: "DORADO", silabas: ["DO", "RA", "DO"], dificultad: 2 },
    { palabra: "PLATEADO", silabas: ["PLA", "TE", "A", "DO"], dificultad: 3 },
  ],

  frutas: [
    { palabra: "PERA", silabas: ["PE", "RA"], dificultad: 1 },
    { palabra: "MANZANA", silabas: ["MAN", "ZA", "NA"], dificultad: 2 },
    { palabra: "UVA", silabas: ["U", "VA"], dificultad: 1 },
    { palabra: "MORA", silabas: ["MO", "RA"], dificultad: 1 },
    { palabra: "LIMA", silabas: ["LI", "MA"], dificultad: 1 },
    { palabra: "MANGO", silabas: ["MAN", "GO"], dificultad: 2 },
    { palabra: "FRESA", silabas: ["FRE", "SA"], dificultad: 2 },
    { palabra: "SANDIA", silabas: ["SAN", "DI", "A"], dificultad: 2 },
    { palabra: "NARANJA", silabas: ["NA", "RAN", "JA"], dificultad: 2 },
    { palabra: "CEREZA", silabas: ["CE", "RE", "ZA"], dificultad: 2 },
    { palabra: "BANANA", silabas: ["BA", "NA", "NA"], dificultad: 2 },
    { palabra: "MANDARINA", silabas: ["MAN", "DA", "RI", "NA"], dificultad: 3 },
    { palabra: "FRUTILLA", silabas: ["FRU", "TI", "LLA"], dificultad: 3 },
    { palabra: "COCO", silabas: ["CO", "CO"], dificultad: 1 },
    { palabra: "KIWI", silabas: ["KI", "WI"], dificultad: 1 },
  ],

  objetos: [
    { palabra: "MESA", silabas: ["ME", "SA"], dificultad: 1 },
    { palabra: "SILLA", silabas: ["SI", "LLA"], dificultad: 1 },
    { palabra: "CAMA", silabas: ["CA", "MA"], dificultad: 1 },
    { palabra: "PUERTA", silabas: ["PUER", "TA"], dificultad: 2 },
    { palabra: "VENTANA", silabas: ["VEN", "TA", "NA"], dificultad: 2 },
    { palabra: "LAPIZ", silabas: ["LA", "PIZ"], dificultad: 1 },
    { palabra: "CUADERNO", silabas: ["CUA", "DER", "NO"], dificultad: 2 },
    { palabra: "RELOJ", silabas: ["RE", "LOJ"], dificultad: 2 },
    { palabra: "ESPEJO", silabas: ["ES", "PE", "JO"], dificultad: 2 },
    { palabra: "TAZA", silabas: ["TA", "ZA"], dificultad: 1 },
    { palabra: "ZAPATO", silabas: ["ZA", "PA", "TO"], dificultad: 2 },
    { palabra: "CAMISA", silabas: ["CA", "MI", "SA"], dificultad: 2 },
    { palabra: "MOCHILA", silabas: ["MO", "CHI", "LA"], dificultad: 2 },
    { palabra: "PARAGUAS", silabas: ["PA", "RA", "GUAS"], dificultad: 3 },
    { palabra: "TECLADO", silabas: ["TE", "CLA", "DO"], dificultad: 2 },
  ],

  transporte: [
    { palabra: "TREN", silabas: ["TREN"], dificultad: 1 },
    { palabra: "BUS", silabas: ["BUS"], dificultad: 1 },
    { palabra: "BARCO", silabas: ["BAR", "CO"], dificultad: 1 },
    { palabra: "AVION", silabas: ["A", "VION"], dificultad: 2 },
    { palabra: "MOTO", silabas: ["MO", "TO"], dificultad: 1 },
    { palabra: "BICICLETA", silabas: ["BI", "CI", "CLE", "TA"], dificultad: 3 },
    { palabra: "CAMION", silabas: ["CA", "MION"], dificultad: 2 },
    { palabra: "HELICOPTERO", silabas: ["HE", "LI", "COP", "TE", "RO"], dificultad: 3 },
    { palabra: "AMBULANCIA", silabas: ["AM", "BU", "LAN", "CIA"], dificultad: 3 },
    { palabra: "VELERO", silabas: ["VE", "LE", "RO"], dificultad: 2 },
  ],

  verbos: [
    { palabra: "CORRER", silabas: ["CO", "RRER"], dificultad: 2 },
    { palabra: "SALTAR", silabas: ["SAL", "TAR"], dificultad: 2 },
    { palabra: "COMER", silabas: ["CO", "MER"], dificultad: 1 },
    { palabra: "BEBER", silabas: ["BE", "BER"], dificultad: 1 },
    { palabra: "JUGAR", silabas: ["JU", "GAR"], dificultad: 1 },
    { palabra: "REIR", silabas: ["RE", "IR"], dificultad: 2 },
    { palabra: "DORMIR", silabas: ["DOR", "MIR"], dificultad: 2 },
    { palabra: "ESCRIBIR", silabas: ["ES", "CRI", "BIR"], dificultad: 3 },
    { palabra: "NADAR", silabas: ["NA", "DAR"], dificultad: 1 },
    { palabra: "VOLAR", silabas: ["VO", "LAR"], dificultad: 1 },
    { palabra: "CANTAR", silabas: ["CAN", "TAR"], dificultad: 2 },
    { palabra: "BAILAR", silabas: ["BAI", "LAR"], dificultad: 2 },
    { palabra: "PINTAR", silabas: ["PIN", "TAR"], dificultad: 2 },
    { palabra: "LEER", silabas: ["LE", "ER"], dificultad: 1 },
    { palabra: "CAMINAR", silabas: ["CA", "MI", "NAR"], dificultad: 2 },
  ],

  naturaleza: [
    { palabra: "SOL", silabas: ["SOL"], dificultad: 1 },
    { palabra: "LUNA", silabas: ["LU", "NA"], dificultad: 1 },
    { palabra: "FLOR", silabas: ["FLOR"], dificultad: 1 },
    { palabra: "ARBOL", silabas: ["AR", "BOL"], dificultad: 2 },
    { palabra: "RIO", silabas: ["RI", "O"], dificultad: 1 },
    { palabra: "MAR", silabas: ["MAR"], dificultad: 1 },
    { palabra: "NUBE", silabas: ["NU", "BE"], dificultad: 1 },
    { palabra: "ESTRELLA", silabas: ["ES", "TRE", "LLA"], dificultad: 2 },
    { palabra: "MONTANA", silabas: ["MON", "TA", "ÑA"], dificultad: 2 },
    { palabra: "SELVA", silabas: ["SEL", "VA"], dificultad: 2 },
    { palabra: "PLAYA", silabas: ["PLA", "YA"], dificultad: 2 },
    { palabra: "BOSQUE", silabas: ["BOS", "QUE"], dificultad: 2 },
    { palabra: "ARCOIRIS", silabas: ["AR", "CO", "I", "RIS"], dificultad: 3 },
    { palabra: "CASCADA", silabas: ["CAS", "CA", "DA"], dificultad: 2 },
    { palabra: "VOLCAN", silabas: ["VOL", "CAN"], dificultad: 2 },
  ],

  familia: [
    { palabra: "MAMA", silabas: ["MA", "MA"], dificultad: 1 },
    { palabra: "PAPA", silabas: ["PA", "PA"], dificultad: 1 },
    { palabra: "HERMANO", silabas: ["HER", "MA", "NO"], dificultad: 2 },
    { palabra: "ABUELA", silabas: ["A", "BUE", "LA"], dificultad: 2 },
    { palabra: "ABUELO", silabas: ["A", "BUE", "LO"], dificultad: 2 },
    { palabra: "PRIMO", silabas: ["PRI", "MO"], dificultad: 2 },
    { palabra: "TIA", silabas: ["TI", "A"], dificultad: 1 },
    { palabra: "TIO", silabas: ["TI", "O"], dificultad: 1 },
    { palabra: "SOBRINO", silabas: ["SO", "BRI", "NO"], dificultad: 2 },
    { palabra: "FAMILIA", silabas: ["FA", "MI", "LIA"], dificultad: 2 },
  ],

  comida: [
    { palabra: "PAN", silabas: ["PAN"], dificultad: 1 },
    { palabra: "LECHE", silabas: ["LE", "CHE"], dificultad: 1 },
    { palabra: "AGUA", silabas: ["A", "GUA"], dificultad: 1 },
    { palabra: "HUEVO", silabas: ["HUE", "VO"], dificultad: 2 },
    { palabra: "SOPA", silabas: ["SO", "PA"], dificultad: 1 },
    { palabra: "CARNE", silabas: ["CAR", "NE"], dificultad: 1 },
    { palabra: "POLLO", silabas: ["PO", "LLO"], dificultad: 1 },
    { palabra: "ARROZ", silabas: ["A", "RROZ"], dificultad: 2 },
    { palabra: "PASTA", silabas: ["PAS", "TA"], dificultad: 1 },
    { palabra: "HELADO", silabas: ["HE", "LA", "DO"], dificultad: 2 },
    { palabra: "GALLETAS", silabas: ["GA", "LLE", "TAS"], dificultad: 2 },
    { palabra: "CHOCLO", silabas: ["CHO", "CLO"], dificultad: 2 },
    { palabra: "EMPANADA", silabas: ["EM", "PA", "NA", "DA"], dificultad: 3 },
    { palabra: "CHURRO", silabas: ["CHU", "RRO"], dificultad: 2 },
    { palabra: "TORTA", silabas: ["TOR", "TA"], dificultad: 1 },
  ],
};

// Obtener todas las palabras como lista plana
function getAllWords() {
  const all = [];
  for (const category in WORD_DATABASE) {
    for (const word of WORD_DATABASE[category]) {
      all.push({ ...word, categoria: category });
    }
  }
  return all;
}

// Obtener palabras por dificultad
function getWordsByDifficulty(maxDifficulty) {
  return getAllWords().filter((w) => w.dificultad <= maxDifficulty);
}

// Generar sílabas distractoras
function getDistractorSyllables(currentWord, count) {
  const allWords = getAllWords();
  const currentSilabas = new Set(currentWord.silabas);
  const available = [];

  for (const w of allWords) {
    for (const s of w.silabas) {
      if (!currentSilabas.has(s)) {
        available.push(s);
      }
    }
  }

  // Mezclar y seleccionar
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Sistema inteligente de selección de palabras
class WordManager {
  constructor() {
    this.recentWords = [];
    this.maxRecent = 10;
    this.currentWord = null;
    this.currentSyllableIndex = 0;
    this.completedWords = 0;
  }

  selectWord(difficulty) {
    const maxDiff = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 3;
    let candidates = getWordsByDifficulty(maxDiff);

    // Filtrar palabras recientes
    candidates = candidates.filter(
      (w) => !this.recentWords.includes(w.palabra)
    );

    if (candidates.length === 0) {
      this.recentWords = [];
      candidates = getWordsByDifficulty(maxDiff);
    }

    // Evitar sílabas muy largas al inicio
    if (this.completedWords < 3) {
      candidates = candidates.filter(
        (w) => w.silabas.length <= (maxDiff === 1 ? 2 : 3)
      );
    }

    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    this.currentWord = selected;
    this.currentSyllableIndex = 0;
    this.recentWords.push(selected.palabra);

    if (this.recentWords.length > this.maxRecent) {
      this.recentWords.shift();
    }

    return selected;
  }

  getCurrentTarget() {
    if (!this.currentWord) return null;
    return this.currentWord.silabas[this.currentSyllableIndex];
  }

  checkSyllable(syllable) {
    if (!this.currentWord) return { correct: false, complete: false };

    const target = this.getCurrentTarget();
    if (syllable === target) {
      this.currentSyllableIndex++;
      const isComplete =
        this.currentSyllableIndex >= this.currentWord.silabas.length;

      if (isComplete) {
        this.completedWords++;
      }

      return { correct: true, complete: isComplete };
    }

    return { correct: false, complete: false };
  }

  getProgress() {
    if (!this.currentWord) return { current: 0, total: 0 };
    return {
      current: this.currentSyllableIndex,
      total: this.currentWord.silabas.length,
    };
  }

  reset() {
    this.recentWords = [];
    this.currentWord = null;
    this.currentSyllableIndex = 0;
    this.completedWords = 0;
  }
}

// ============================================================
// storage.js
// ============================================================

const STORAGE_KEYS = {
  HIGH_SCORE: "snakeSilabas_highScore",
  FAVORITE_CHARACTER: "snakeSilabas_favoriteCharacter",
  DIFFICULTY: "snakeSilabas_difficulty",
  SOUND_ENABLED: "snakeSilabas_soundEnabled",
  MUSIC_ENABLED: "snakeSilabas_musicEnabled",
  SHOW_WORD: "snakeSilabas_showWord",
  RELAXED_MODE: "snakeSilabas_relaxedMode",
  PLAYER_NAME: "snakeSilabas_playerName",
  UNLOCKED_SKINS: "snakeSilabas_unlockedSkins",
  TOTAL_WORDS: "snakeSilabas_totalWords",
  GAMES_PLAYED: "snakeSilabas_gamesPlayed",
};

class Storage {
  static get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently fail if storage is full
    }
  }

  static getHighScore() {
    return this.get(STORAGE_KEYS.HIGH_SCORE, 0);
  }

  static setHighScore(score) {
    const current = this.getHighScore();
    if (score > current) {
      this.set(STORAGE_KEYS.HIGH_SCORE, score);
      return true; // New record!
    }
    return false;
  }

  static getFavoriteCharacter() {
    return this.get(STORAGE_KEYS.FAVORITE_CHARACTER, "lili");
  }

  static setFavoriteCharacter(character) {
    this.set(STORAGE_KEYS.FAVORITE_CHARACTER, character);
  }

  static getDifficulty() {
    return this.get(STORAGE_KEYS.DIFFICULTY, 1);
  }

  static setDifficulty(difficulty) {
    this.set(STORAGE_KEYS.DIFFICULTY, difficulty);
  }

  static getSoundEnabled() {
    return this.get(STORAGE_KEYS.SOUND_ENABLED, true);
  }

  static setSoundEnabled(enabled) {
    this.set(STORAGE_KEYS.SOUND_ENABLED, enabled);
  }

  static getMusicEnabled() {
    return this.get(STORAGE_KEYS.MUSIC_ENABLED, true);
  }

  static setMusicEnabled(enabled) {
    this.set(STORAGE_KEYS.MUSIC_ENABLED, enabled);
  }

  static getShowWord() {
    return this.get(STORAGE_KEYS.SHOW_WORD, true);
  }

  static setShowWord(show) {
    this.set(STORAGE_KEYS.SHOW_WORD, show);
  }

  static getRelaxedMode() {
    return this.get(STORAGE_KEYS.RELAXED_MODE, true);
  }

  static setRelaxedMode(relaxed) {
    this.set(STORAGE_KEYS.RELAXED_MODE, relaxed);
  }

  static getPlayerName() {
    return this.get(STORAGE_KEYS.PLAYER_NAME, "");
  }

  static setPlayerName(name) {
    this.set(STORAGE_KEYS.PLAYER_NAME, name);
  }

  static getUnlockedSkins() {
    return this.get(STORAGE_KEYS.UNLOCKED_SKINS, ["lili"]);
  }

  static unlockSkin(skinId) {
    const skins = this.getUnlockedSkins();
    if (!skins.includes(skinId)) {
      skins.push(skinId);
      this.set(STORAGE_KEYS.UNLOCKED_SKINS, skins);
    }
  }

  static getTotalWords() {
    return this.get(STORAGE_KEYS.TOTAL_WORDS, 0);
  }

  static addTotalWords(count) {
    this.set(STORAGE_KEYS.TOTAL_WORDS, this.getTotalWords() + count);
  }

  static getGamesPlayed() {
    return this.get(STORAGE_KEYS.GAMES_PLAYED, 0);
  }

  static incrementGamesPlayed() {
    this.set(STORAGE_KEYS.GAMES_PLAYED, this.getGamesPlayed() + 1);
  }

  // Instance method wrappers that delegate to static methods
  // (Game class uses `new Storage()` and calls methods on the instance)
  getPlayerName() { return Storage.getPlayerName(); }
  setPlayerName(name) { return Storage.setPlayerName(name); }
  getFavoriteCharacter() { return Storage.getFavoriteCharacter(); }
  setFavoriteCharacter(char) { return Storage.setFavoriteCharacter(char); }
  getDifficulty() { return Storage.getDifficulty(); }
  setDifficulty(d) { return Storage.setDifficulty(d); }
  getSoundEnabled() { return Storage.getSoundEnabled(); }
  setSoundEnabled(e) { return Storage.setSoundEnabled(e); }
  getMusicEnabled() { return Storage.getMusicEnabled(); }
  setMusicEnabled(e) { return Storage.setMusicEnabled(e); }
  getShowWord() { return Storage.getShowWord(); }
  setShowWord(s) { return Storage.setShowWord(s); }
  getRelaxedMode() { return Storage.getRelaxedMode(); }
  setRelaxedMode(r) { return Storage.setRelaxedMode(r); }
  getHighScore() { return Storage.getHighScore(); }
  setHighScore(s) { return Storage.setHighScore(s); }
  getUnlockedSkins() { return Storage.getUnlockedSkins(); }
  unlockSkin(s) { return Storage.unlockSkin(s); }
  getTotalWords() { return Storage.getTotalWords(); }
  addTotalWords(c) { return Storage.addTotalWords(c); }
  getGamesPlayed() { return Storage.getGamesPlayed(); }
  incrementGamesPlayed() { return Storage.incrementGamesPlayed(); }
}

// ============================================================
// audio.js
// ============================================================

class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicEnabled = true;
    this.musicPlaying = false;
    this.musicNodes = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API no disponible");
      this.enabled = false;
    }
  }

  ensureContext() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Sonido "ding" para sílaba correcta
  playCorrect() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.08); // E5

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Sonido "boop" suave para error
  playError() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.setValueAtTime(200, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Mini fanfarria para palabra completada
  playWordComplete() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const duration = 0.12;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * duration);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * duration);
      gain.gain.linearRampToValueAtTime(
        0.3,
        this.ctx.currentTime + i * duration + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.ctx.currentTime + i * duration + 0.3
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * duration);
      osc.stop(this.ctx.currentTime + i * duration + 0.3);
    });
  }

  // Sonido pop para bonus
  playBonus() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.2);
  }

  // Sonido de Game Over (suave, no alarmante)
  playGameOver() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [392, 349.23, 329.63, 261.63]; // G4, F4, E4, C4
    const duration = 0.2;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * duration);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * duration);
      gain.gain.linearRampToValueAtTime(
        0.2,
        this.ctx.currentTime + i * duration + 0.02
      );
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.ctx.currentTime + i * duration + 0.4
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * duration);
      osc.stop(this.ctx.currentTime + i * duration + 0.4);
    });
  }

  // Música de fondo infantil (loop suave)
  startMusic() {
    if (!this.musicEnabled || this.musicPlaying) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.musicPlaying = true;
    this._playMusicLoop();
  }

  _playMusicLoop() {
    if (!this.musicPlaying || !this.ctx) return;

    // Melodía pentatónica infantil: C D E G A en varias octavas
    const scale = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];
    const pattern = [0, 2, 4, 2, 3, 5, 4, 2, 0, 2, 3, 4, 5, 4, 2, 0];
    const noteLength = 0.25;
    const totalTime = pattern.length * noteLength;

    pattern.forEach((noteIdx, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(
        scale[noteIdx],
        this.ctx.currentTime + i * noteLength
      );

      gain.gain.setValueAtTime(0, this.ctx.currentTime + i * noteLength);
      gain.gain.linearRampToValueAtTime(
        0.06,
        this.ctx.currentTime + i * noteLength + 0.02
      );
      gain.gain.setValueAtTime(
        0.06,
        this.ctx.currentTime + i * noteLength + noteLength * 0.7
      );
      gain.gain.linearRampToValueAtTime(
        0,
        this.ctx.currentTime + i * noteLength + noteLength
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + i * noteLength);
      osc.stop(this.ctx.currentTime + i * noteLength + noteLength + 0.01);
    });

    // Programar siguiente loop
    this._musicTimeout = setTimeout(() => {
      if (this.musicPlaying) {
        this._playMusicLoop();
      }
    }, totalTime * 1000);
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this._musicTimeout) {
      clearTimeout(this._musicTimeout);
    }
  }

  // Narración: pronunciar sílaba con Speech Synthesis
  speak(text) {
    if (!this.enabled) return;
    try {
      if ("speechSynthesis" in window) {
        // Cancelar cualquier habla anterior
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;

        // Intentar usar voz en español
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(
          (v) => v.lang.startsWith("es") && v.name.includes("female")
        ) || voices.find((v) => v.lang.startsWith("es"));
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }

        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Speech synthesis not available
    }
  }

  // Pronunciar palabra completa separada en sílabas
  speakWord(word, silabas) {
    if (!this.enabled) return;
    const syllableText = silabas.join("... ");
    this.speak(syllableText);
    // Luego pronunciar la palabra completa
    setTimeout(() => {
      this.speak(word);
    }, silabas.length * 600 + 500);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) this.stopMusic();
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (!enabled) this.stopMusic();
    else this.startMusic();
  }
}

// Singleton
const audioManager = new AudioManager();

// ============================================================
// particles.js
// ============================================================

class Particle {
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = options.vx || (Math.random() - 0.5) * 4;
    this.vy = options.vy || (Math.random() - 0.5) * 4 - 2;
    this.life = options.life || 1.0;
    this.decay = options.decay || 0.02 + Math.random() * 0.02;
    this.size = options.size || 3 + Math.random() * 4;
    this.color = options.color || this.randomColor();
    this.gravity = options.gravity || 0.05;
    this.shape = options.shape || "circle"; // circle, star, heart
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.2;
  }

  randomColor() {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFE66D",
      "#95E1D3",
      "#F38181",
      "#AA96DA",
      "#FCBAD3",
      "#A8D8EA",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.life -= this.decay;
    this.rotation += this.rotationSpeed;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    } else if (this.shape === "star") {
      this.drawStar(ctx, this.size);
    } else if (this.shape === "heart") {
      this.drawHeart(ctx, this.size);
    }

    ctx.restore();
  }

  drawStar(ctx, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const method = i === 0 ? "moveTo" : "lineTo";
      ctx[method](Math.cos(angle) * size, Math.sin(angle) * size);
    }
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  drawHeart(ctx, size) {
    ctx.beginPath();
    ctx.moveTo(0, size * 0.3);
    ctx.bezierCurveTo(-size, -size * 0.5, -size * 0.5, -size, 0, -size * 0.4);
    ctx.bezierCurveTo(size * 0.5, -size, size, -size * 0.5, 0, size * 0.3);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  // Efecto de brillo al comer sílaba correcta
  emitCorrect(x, y) {
    for (let i = 0; i < 12; i++) {
      this.particles.push(
        new Particle(x, y, {
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6 - 1,
          color: ["#4ECDC4", "#45B7D1", "#96E6A1", "#FFE66D"][
            Math.floor(Math.random() * 4)
          ],
          size: 3 + Math.random() * 5,
          shape: Math.random() > 0.5 ? "star" : "circle",
          gravity: 0.03,
          decay: 0.015,
        })
      );
    }
  }

  // Efecto de confetti al completar palabra
  emitConfetti(x, y, width, height) {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFE66D",
      "#AA96DA",
      "#FCBAD3",
      "#A8D8EA",
      "#FF9FF3",
      "#54A0FF",
    ];
    for (let i = 0; i < 40; i++) {
      this.particles.push(
        new Particle(x + Math.random() * width, y, {
          vx: (Math.random() - 0.5) * 8,
          vy: -Math.random() * 8 - 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 6,
          shape: ["circle", "star", "heart"][Math.floor(Math.random() * 3)],
          gravity: 0.12,
          decay: 0.008,
          life: 1.0 + Math.random() * 0.5,
        })
      );
    }
  }

  // Efecto de bonus
  emitBonus(x, y) {
    for (let i = 0; i < 8; i++) {
      this.particles.push(
        new Particle(x, y, {
          vx: (Math.random() - 0.5) * 5,
          vy: (Math.random() - 0.5) * 5,
          color: ["#FFE66D", "#FF9FF3", "#54A0FF"][Math.floor(Math.random() * 3)],
          size: 2 + Math.random() * 4,
          shape: "star",
          gravity: 0.02,
          decay: 0.02,
        })
      );
    }
  }

  // Efecto de error (partículas rojas pequeñas)
  emitError(x, y) {
    for (let i = 0; i < 6; i++) {
      this.particles.push(
        new Particle(x, y, {
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          color: "#F38181",
          size: 2 + Math.random() * 3,
          gravity: 0.04,
          decay: 0.03,
        })
      );
    }
  }

  // Efecto de game over (partículas lentas cayendo)
  emitGameOver(x, y, width, height) {
    for (let i = 0; i < 25; i++) {
      this.particles.push(
        new Particle(x + Math.random() * width, y + Math.random() * height * 0.5, {
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2,
          color: ["#A8D8EA", "#AA96DA", "#FCBAD3"][Math.floor(Math.random() * 3)],
          size: 3 + Math.random() * 5,
          gravity: 0.06,
          decay: 0.005,
          life: 1.5,
        })
      );
    }
  }

  update() {
    this.particles = this.particles.filter((p) => p.update());
  }

  draw(ctx) {
    for (const p of this.particles) {
      p.draw(ctx);
    }
  }

  clear() {
    this.particles = [];
  }

  get count() {
    return this.particles.length;
  }
}

// ============================================================
// snake.js
// ============================================================

const CHARACTERS = {
  lili: {
    name: "Lili",
    color: "#4ECDC4",
    headColor: "#45B7D1",
    eyeColor: "#2C3E50",
    cheekColor: "#FF6B6B",
    bodyGradient: ["#4ECDC4", "#44BDB4", "#3AA89E"],
    expression: "happy",
    unlockAt: 0, // Always unlocked
  },
  toto: {
    name: "Toto",
    color: "#54A0FF",
    headColor: "#2E86DE",
    eyeColor: "#2C3E50",
    cheekColor: "#FF9FF3",
    bodyGradient: ["#54A0FF", "#4A90E8", "#3D7FCC"],
    expression: "curious",
    unlockAt: 5,
  },
  mimi: {
    name: "Mimi",
    color: "#FF6B9D",
    headColor: "#E84393",
    eyeColor: "#2C3E50",
    cheekColor: "#FD79A8",
    bodyGradient: ["#FF6B9D", "#E86090", "#D05583"],
    expression: "shy",
    unlockAt: 15,
  },
  sol: {
    name: "Sol",
    color: "#FECA57",
    headColor: "#F9CA24",
    eyeColor: "#2C3E50",
    cheekColor: "#FF6B6B",
    bodyGradient: ["#FECA57", "#F0BD4A", "#E0AE3D"],
    expression: "cheerful",
    unlockAt: 30,
  },
};

class Snake {
  constructor(gridSize, characterId = "lili") {
    this.gridSize = gridSize;
    this.character = CHARACTERS[characterId] || CHARACTERS.lili;
    this.characterId = characterId;
    this.reset();
  }

  reset() {
    const mid = Math.floor(this.gridSize / 2);
    this.body = [
      { x: mid, y: mid },
      { x: mid - 1, y: mid },
      { x: mid - 2, y: mid },
    ];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.growCount = 0;
    this.shakeTimer = 0;
    this.isShaking = false;
    this.blinkTimer = 0;
    this.celebrateTimer = 0;
    this.invincibleTimer = 0;
    this.speedBoostTimer = 0;
  }

  get head() {
    return this.body[0];
  }

  setDirection(dir) {
    // Prevenir ir en dirección opuesta
    if (dir.x === -this.direction.x && dir.y === -this.direction.y) {
      return;
    }
    // Prevenir dirección nula
    if (dir.x === 0 && dir.y === 0) return;
    this.nextDirection = { ...dir };
  }

  move() {
    this.direction = { ...this.nextDirection };

    const newHead = {
      x: this.head.x + this.direction.x,
      y: this.head.y + this.direction.y,
    };

    this.body.unshift(newHead);

    if (this.growCount > 0) {
      this.growCount--;
    } else {
      this.body.pop();
    }

    // Actualizar timers
    if (this.shakeTimer > 0) this.shakeTimer--;
    else this.isShaking = false;

    if (this.celebrateTimer > 0) this.celebrateTimer--;
    if (this.invincibleTimer > 0) this.invincibleTimer--;
    if (this.speedBoostTimer > 0) this.speedBoostTimer--;

    if (this.blinkTimer > 0) {
      this.blinkTimer--;
    } else if (Math.random() < 0.005) {
      // Blink aleatorio ocasional
      this.blinkTimer = 6;
    }
  }

  grow(amount = 1) {
    this.growCount += amount;
  }

  shrink(amount = 1) {
    for (let i = 0; i < amount; i++) {
      if (this.body.length > 2) {
        this.body.pop();
      }
    }
  }

  shake() {
    this.isShaking = true;
    this.shakeTimer = 10;
  }

  celebrate() {
    this.celebrateTimer = 20;
  }

  checkWallCollision(gridSize) {
    const head = this.head;
    return head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize;
  }

  checkSelfCollision() {
    const head = this.head;
    for (let i = 1; i < this.body.length; i++) {
      if (this.body[i].x === head.x && this.body[i].y === head.y) {
        return true;
      }
    }
    return false;
  }

  occupiesCell(x, y) {
    return this.body.some((seg) => seg.x === x && seg.y === y);
  }

  getOccupiedCells() {
    return new Set(this.body.map((seg) => `${seg.x},${seg.y}`));
  }

  draw(ctx, cellSize, offsetX = 0, offsetY = 0) {
    const char = this.character;
    const shakeOffset = this.isShaking
      ? (Math.random() - 0.5) * 4
      : 0;

    // Dibujar cuerpo
    for (let i = this.body.length - 1; i >= 0; i--) {
      const seg = this.body[i];
      const x = offsetX + seg.x * cellSize + cellSize / 2 + (i === 0 ? shakeOffset : 0);
      const y = offsetY + seg.y * cellSize + cellSize / 2 + (i === 0 ? shakeOffset : 0);
      const progress = i / this.body.length;
      const size = cellSize * (i === 0 ? 0.48 : 0.42 - progress * 0.08);

      if (i === 0) {
        // Cabeza
        this.drawHead(ctx, x, y, cellSize);
      } else {
        // Segmento del cuerpo
        const bodyColor = char.bodyGradient[Math.min(Math.floor(progress * char.bodyGradient.length), char.bodyGradient.length - 1)];
        ctx.beginPath();
        ctx.arc(x, y, Math.max(size, cellSize * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = bodyColor;
        ctx.fill();

        // Brillo sutil
        ctx.beginPath();
        ctx.arc(x - size * 0.2, y - size * 0.2, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fill();
      }
    }
  }

  drawHead(ctx, x, y, cellSize) {
    const char = this.character;
    const headSize = cellSize * 0.48;
    const isBlinking = this.blinkTimer > 0;
    const isCelebrating = this.celebrateTimer > 0;

    // Cabeza (círculo)
    ctx.beginPath();
    ctx.arc(x, y, headSize, 0, Math.PI * 2);
    ctx.fillStyle = char.headColor;
    ctx.fill();

    // Brillo
    ctx.beginPath();
    ctx.arc(x - headSize * 0.2, y - headSize * 0.2, headSize * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fill();

    // Dirección de la cara
    const dirX = this.direction.x;
    const dirY = this.direction.y;
    const faceOffsetX = dirX * headSize * 0.15;
    const faceOffsetY = dirY * headSize * 0.15;

    // Ojos
    const eyeSpacing = headSize * 0.35;
    const eyeSize = headSize * 0.2;
    const leftEyeX = x + faceOffsetX - eyeSpacing * dirY;
    const leftEyeY = y + faceOffsetY + eyeSpacing * dirX;
    const rightEyeX = x + faceOffsetX + eyeSpacing * dirY;
    const rightEyeY = y + faceOffsetY - eyeSpacing * dirX;

    if (isBlinking) {
      // Ojos cerrados (líneas)
      ctx.beginPath();
      ctx.moveTo(leftEyeX - eyeSize, leftEyeY);
      ctx.lineTo(leftEyeX + eyeSize, leftEyeY);
      ctx.strokeStyle = char.eyeColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(rightEyeX - eyeSize, rightEyeY);
      ctx.lineTo(rightEyeX + eyeSize, rightEyeY);
      ctx.stroke();
    } else {
      // Ojos abiertos
      [leftEyeX, rightEyeX].forEach((ex, idx) => {
        const ey = idx === 0 ? leftEyeY : rightEyeY;
        // Blanco del ojo
        ctx.beginPath();
        ctx.arc(ex, ey, eyeSize, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
        // Pupila
        const pupilOffsetX = dirX * eyeSize * 0.3;
        const pupilOffsetY = dirY * eyeSize * 0.3;
        ctx.beginPath();
        ctx.arc(ex + pupilOffsetX, ey + pupilOffsetY, eyeSize * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = char.eyeColor;
        ctx.fill();
        // Brillo en la pupila
        ctx.beginPath();
        ctx.arc(
          ex + pupilOffsetX - eyeSize * 0.15,
          ey + pupilOffsetY - eyeSize * 0.15,
          eyeSize * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = "white";
        ctx.fill();
      });
    }

    // Mejillas
    const cheekY = y + faceOffsetY + headSize * 0.25;
    ctx.beginPath();
    ctx.arc(x - headSize * 0.5, cheekY, headSize * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = char.cheekColor + "60";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + headSize * 0.5, cheekY, headSize * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = char.cheekColor + "60";
    ctx.fill();

    // Boca
    const mouthY = y + faceOffsetY + headSize * 0.2;
    if (isCelebrating) {
      // Boca feliz grande
      ctx.beginPath();
      ctx.arc(x + faceOffsetX, mouthY - headSize * 0.05, headSize * 0.2, 0, Math.PI);
      ctx.fillStyle = "#E74C3C";
      ctx.fill();
    } else if (this.isShaking) {
      // Boca de sorpresa
      ctx.beginPath();
      ctx.arc(x + faceOffsetX, mouthY, headSize * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = "#E74C3C";
      ctx.fill();
    } else {
      // Sonrisa simple
      ctx.beginPath();
      ctx.arc(x + faceOffsetX, mouthY - headSize * 0.08, headSize * 0.15, 0.1, Math.PI - 0.1);
      ctx.strokeStyle = char.eyeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Efecto de invencibilidad (brillo)
    if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 3) % 2 === 0) {
      ctx.beginPath();
      ctx.arc(x, y, headSize + 4, 0, Math.PI * 2);
      ctx.strokeStyle = "#FFE66D88";
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  }
}

// ============================================================
// board.js
// ============================================================

const BONUS_TYPES = {
  APPLE: { emoji: "🍎", effect: "points", value: 25, color: "#FF6B6B" },
  BANANA: { emoji: "🍌", effect: "points", value: 25, color: "#FECA57" },
  STRAWBERRY: { emoji: "🍓", effect: "points", value: 25, color: "#FF6B6B" },
  GRAPE: { emoji: "🍇", effect: "points", value: 25, color: "#AA96DA" },
  STAR: { emoji: "⭐", effect: "invincible", value: 0, color: "#FECA57" },
  LIGHTNING: { emoji: "⚡", effect: "speed", value: 0, color: "#54A0FF" },
  HEART: { emoji: "❤️", effect: "life", value: 1, color: "#FF6B9D" },
  BALLOON: { emoji: "🎈", effect: "shrink", value: 0, color: "#FF9FF3" },
};

// Polyfill for roundRect
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    const r = typeof radii === "number" ? radii : (Array.isArray(radii) ? radii[0] : 0);
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.arcTo(x + w, y, x + w, y + r, r);
    this.lineTo(x + w, y + h - r);
    this.arcTo(x + w, y + h, x + w - r, y + h, r);
    this.lineTo(x + r, y + h);
    this.arcTo(x, y + h, x, y + h - r, r);
    this.lineTo(x, y + r);
    this.arcTo(x, y, x + r, y, r);
    this.closePath();
    return this;
  };
}

class SyllableItem {
  constructor(x, y, text, isTarget = false, isDistractor = false, wordIndex = -1) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.isTarget = isTarget;
    this.isDistractor = isDistractor;
    this.wordIndex = wordIndex; // Posición en la palabra (-1 = distractor)
    this.pulseTimer = 0;
    this.collected = false;
    this.spawnTimer = 0;
    this.bounceTimer = 0;
  }

  update() {
    this.pulseTimer += 0.05;
    if (this.spawnTimer < 1) this.spawnTimer += 0.05;
    if (this.bounceTimer > 0) this.bounceTimer -= 0.1;
  }

  draw(ctx, cellSize, offsetX, offsetY, showTarget = true) {
    if (this.collected) return;

    const x = offsetX + this.x * cellSize + cellSize / 2;
    const y = offsetY + this.y * cellSize + cellSize / 2;
    const pulse = Math.sin(this.pulseTimer) * 0.05 + 1;
    const spawnScale = Math.min(this.spawnTimer, 1);
    const bounceOffset = Math.sin(this.bounceTimer * Math.PI) * 8;

    ctx.save();
    ctx.translate(x, y - bounceOffset);
    ctx.scale(pulse * spawnScale, pulse * spawnScale);

    const radius = cellSize * 0.38;

    // Fondo del círculo
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);

    if (this.isTarget && showTarget) {
      const gradient = ctx.createRadialGradient(0, -radius * 0.3, 0, 0, 0, radius);
      gradient.addColorStop(0, "#FFE66D");
      gradient.addColorStop(1, "#F9CA24");
      ctx.fillStyle = gradient;
    } else if (this.isDistractor) {
      const gradient = ctx.createRadialGradient(0, -radius * 0.3, 0, 0, 0, radius);
      gradient.addColorStop(0, "#B8B8D1");
      gradient.addColorStop(1, "#9B9BB5");
      ctx.fillStyle = gradient;
    } else {
      const gradient = ctx.createRadialGradient(0, -radius * 0.3, 0, 0, 0, radius);
      gradient.addColorStop(0, "#A8D8EA");
      gradient.addColorStop(1, "#87CEEB");
      ctx.fillStyle = gradient;
    }
    ctx.fill();

    // Borde
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.isTarget && showTarget ? "#E6B800" : "#7BA7C2";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Sombra interna
    ctx.beginPath();
    ctx.arc(0, -radius * 0.15, radius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fill();

    // Texto de la sílaba (siempre mayúscula)
    ctx.fillStyle = this.isTarget && showTarget ? "#5D4E37" : "#2C3E50";
    ctx.font = `bold ${Math.max(cellSize * 0.3, 12)}px 'Nunito', 'Segoe UI', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text.toUpperCase(), 0, 1);

    // Indicador de objetivo (resplandor animado)
    if (this.isTarget && showTarget) {
      ctx.beginPath();
      ctx.arc(0, 0, radius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 230, 109, ${0.5 + Math.sin(this.pulseTimer * 2) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }
}

class BonusItem {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.info = BONUS_TYPES[type];
    this.pulseTimer = Math.random() * Math.PI * 2;
    this.spawnTimer = 0;
    this.collected = false;
  }

  update() {
    this.pulseTimer += 0.06;
    if (this.spawnTimer < 1) this.spawnTimer += 0.04;
  }

  draw(ctx, cellSize, offsetX, offsetY) {
    if (this.collected) return;

    const x = offsetX + this.x * cellSize + cellSize / 2;
    const y = offsetY + this.y * cellSize + cellSize / 2;
    const pulse = Math.sin(this.pulseTimer) * 0.08 + 1;
    const spawnScale = Math.min(this.spawnTimer, 1);
    const floatOffset = Math.sin(this.pulseTimer * 0.5) * 2;

    ctx.save();
    ctx.translate(x, y + floatOffset);
    ctx.scale(pulse * spawnScale, pulse * spawnScale);

    const emojiSize = Math.max(cellSize * 0.55, 16);
    ctx.font = `${emojiSize}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.info.emoji, 0, 0);

    // Resplandor de fondo
    ctx.beginPath();
    ctx.arc(0, 0, cellSize * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = this.info.color + "20";
    ctx.fill();

    ctx.restore();
  }
}

class Board {
  constructor(gridSize = 20) {
    this.gridSize = gridSize;
    this.syllables = [];
    this.bonuses = [];
    this.obstacles = [];
  }

  clear() {
    this.syllables = [];
    this.bonuses = [];
    this.obstacles = [];
  }

  getOccupiedCells() {
    const cells = new Set();
    for (const s of this.syllables) {
      if (!s.collected) cells.add(`${s.x},${s.y}`);
    }
    for (const b of this.bonuses) {
      if (!b.collected) cells.add(`${b.x},${b.y}`);
    }
    for (const o of this.obstacles) {
      cells.add(`${o.x},${o.y}`);
    }
    return cells;
  }

  findFreeCell(occupied) {
    let attempts = 0;
    while (attempts < 200) {
      const x = Math.floor(Math.random() * this.gridSize);
      const y = Math.floor(Math.random() * this.gridSize);

      if (!occupied.has(`${x},${y}`)) {
        return { x, y };
      }
      attempts++;
    }
    // Fallback
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        if (!occupied.has(`${x},${y}`)) return { x, y };
      }
    }
    return { x: 0, y: 0 };
  }

  placeSyllables(word, distractors, snakeOccupied) {
    // Limpiar sílabas anteriores de la palabra (no distractores viejos ya consumidos)
    this.syllables = this.syllables.filter((s) => s.collected === false);
    const occupied = new Set([...this.getOccupiedCells(), ...snakeOccupied]);

    // Colocar sílabas de la palabra con su índice
    for (let i = 0; i < word.silabas.length; i++) {
      const pos = this.findFreeCell(occupied);
      const syllable = new SyllableItem(
        pos.x,
        pos.y,
        word.silabas[i],
        i === 0, // La primera es el objetivo actual
        false,
        i // wordIndex: posición en la palabra
      );
      this.syllables.push(syllable);
      occupied.add(`${pos.x},${pos.y}`);
    }

    // Colocar distractores
    for (const text of distractors) {
      const pos = this.findFreeCell(occupied);
      const syllable = new SyllableItem(pos.x, pos.y, text, false, true, -1);
      this.syllables.push(syllable);
      occupied.add(`${pos.x},${pos.y}`);
    }
  }

  placeBonus(snakeOccupied) {
    if (Math.random() > 0.3) return;

    const occupied = new Set([...this.getOccupiedCells(), ...snakeOccupied]);
    const pos = this.findFreeCell(occupied);
    const weightedTypes = [
      "APPLE", "BANANA", "STRAWBERRY", "GRAPE",
      "APPLE", "BANANA", "STRAWBERRY", "GRAPE",
      "STAR", "HEART", "BALLOON", "LIGHTNING",
    ];
    const type = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];

    this.bonuses.push(new BonusItem(pos.x, pos.y, type));
  }

  addObstacles(count, snakeOccupied) {
    const occupied = new Set([...this.getOccupiedCells(), ...snakeOccupied]);
    for (let i = 0; i < count; i++) {
      const pos = this.findFreeCell(occupied);
      this.obstacles.push({ x: pos.x, y: pos.y });
      occupied.add(`${pos.x},${pos.y}`);
    }
  }

  // Actualiza qué sílaba debe ser el objetivo actual
  updateSyllableTargets(currentSyllableIndex) {
    for (const s of this.syllables) {
      if (!s.collected && !s.isDistractor) {
        // La sílaba es objetivo si su wordIndex coincide con el índice actual
        s.isTarget = (s.wordIndex === currentSyllableIndex);
      }
    }
  }

  checkSyllableCollision(headX, headY) {
    for (const s of this.syllables) {
      if (!s.collected && s.x === headX && s.y === headY) {
        return s;
      }
    }
    return null;
  }

  checkBonusCollision(headX, headY) {
    for (const b of this.bonuses) {
      if (!b.collected && b.x === headX && b.y === headY) {
        return b;
      }
    }
    return null;
  }

  checkObstacleCollision(headX, headY) {
    return this.obstacles.some((o) => o.x === headX && o.y === headY);
  }

  removeCollected() {
    this.syllables = this.syllables.filter((s) => !s.collected);
    this.bonuses = this.bonuses.filter((b) => !b.collected);
  }

  // Limpiar solo las sílabas de palabra (no distractores), para nueva palabra
  clearWordSyllables() {
    this.syllables = this.syllables.filter((s) => s.isDistractor && !s.collected);
  }

  update() {
    for (const s of this.syllables) s.update();
    for (const b of this.bonuses) b.update();
  }

  draw(ctx, cellSize, offsetX, offsetY, showTarget = true) {
    // Fondo del tablero
    ctx.fillStyle = "#F0F9FF";
    ctx.fillRect(offsetX, offsetY, this.gridSize * cellSize, this.gridSize * cellSize);

    // Patrón de tablero alternado (sutil)
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = "#E0F2FE";
          ctx.fillRect(
            offsetX + x * cellSize,
            offsetY + y * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }

    // Obstáculos
    for (const o of this.obstacles) {
      const x = offsetX + o.x * cellSize;
      const y = offsetY + o.y * cellSize;
      ctx.fillStyle = "#BDC3C7";
      ctx.beginPath();
      ctx.roundRect(x + 2, y + 2, cellSize - 4, cellSize - 4, 4);
      ctx.fill();
      ctx.fillStyle = "#95A5A6";
      ctx.beginPath();
      ctx.roundRect(x + 4, y + 4, cellSize - 8, cellSize - 8, 3);
      ctx.fill();
    }

    // Bonus
    for (const b of this.bonuses) {
      b.draw(ctx, cellSize, offsetX, offsetY);
    }

    // Sílabas
    for (const s of this.syllables) {
      s.draw(ctx, cellSize, offsetX, offsetY, showTarget);
    }

    // Borde del tablero
    ctx.strokeStyle = "#87CEEB";
    ctx.lineWidth = 3;
    ctx.strokeRect(
      offsetX - 1,
      offsetY - 1,
      this.gridSize * cellSize + 2,
      this.gridSize * cellSize + 2
    );
  }
}

// ============================================================
// ui.js
// ============================================================

class UI {
  constructor() {
    this.screens = {
      menu: document.getElementById("menu-screen"),
      game: document.getElementById("game-screen"),
      gameOver: document.getElementById("gameover-screen"),
    };
    this.elements = {
      // Menu
      playerName: document.getElementById("player-name"),
      characterGrid: document.getElementById("character-grid"),
      difficultyBtns: document.querySelectorAll(".difficulty-btn"),
      showWordCheck: document.getElementById("show-word-check"),
      soundCheck: document.getElementById("sound-check"),
      musicCheck: document.getElementById("music-check"),
      relaxedCheck: document.getElementById("relaxed-check"),
      startBtn: document.getElementById("start-btn"),

      // Game HUD
      hudName: document.getElementById("hud-name"),
      hudScore: document.getElementById("hud-score"),
      hudWords: document.getElementById("hud-words"),
      wordPanel: document.getElementById("word-panel"),
      progressBar: document.getElementById("progress-bar"),
      livesDisplay: document.getElementById("lives-display"),
      pauseBtn: document.getElementById("pause-btn"),
      comboDisplay: document.getElementById("combo-display"),

      // Canvas
      gameCanvas: document.getElementById("game-canvas"),

      // Game Over
      finalScore: document.getElementById("final-score"),
      finalWords: document.getElementById("final-words"),
      finalRecord: document.getElementById("final-record"),
      finalMessage: document.getElementById("final-message"),
      newRecordBadge: document.getElementById("new-record-badge"),
      playAgainBtn: document.getElementById("play-again-btn"),
      menuBtn: document.getElementById("menu-btn"),

      // Mobile controls
      mobileControls: document.getElementById("mobile-controls"),

      // Pause overlay
      pauseOverlay: document.getElementById("pause-overlay"),
      resumeBtn: document.getElementById("resume-btn"),
      quitBtn: document.getElementById("quit-btn"),
    };
  }

  showScreen(name) {
    for (const [key, screen] of Object.entries(this.screens)) {
      if (screen) {
        screen.classList.toggle("hidden", key !== name);
      }
    }
  }

  // ---- Menu ----
  setupMenu(storage) {
    // Restaurar valores guardados
    const savedName = storage.getPlayerName();
    if (savedName && this.elements.playerName) {
      this.elements.playerName.value = savedName;
    }

    // Actualizar estado de bloqueo de personajes
    const unlocked = storage.getUnlockedSkins();
    document.querySelectorAll(".character-card").forEach((card) => {
      const charId = card.dataset.character;
      const char = CHARACTERS[charId];
      const isUnlocked = unlocked.includes(charId) || char.unlockAt === 0;
      const unlockEl = card.querySelector(".character-unlock");

      card.classList.toggle("locked", !isUnlocked);
      card.classList.toggle("unlocked", isUnlocked);

      if (unlockEl) {
        if (isUnlocked) {
          unlockEl.textContent = "✓ DESBLOQUEADA";
        } else {
          unlockEl.textContent = "🔒 DESBLOQUEA A LAS " + char.unlockAt;
        }
      }
    });

    const savedChar = storage.getFavoriteCharacter();
    // Si el personaje guardado está bloqueado, volver a Lili
    const isSavedUnlocked = unlocked.includes(savedChar) || (CHARACTERS[savedChar] && CHARACTERS[savedChar].unlockAt === 0);
    this.selectCharacter(isSavedUnlocked ? savedChar : "lili");

    const savedDiff = storage.getDifficulty();
    this.selectDifficulty(savedDiff);

    const showWord = storage.getShowWord();
    if (this.elements.showWordCheck) this.elements.showWordCheck.checked = showWord;

    const soundEnabled = storage.getSoundEnabled();
    if (this.elements.soundCheck) this.elements.soundCheck.checked = soundEnabled;

    const musicEnabled = storage.getMusicEnabled();
    if (this.elements.musicCheck) this.elements.musicCheck.checked = musicEnabled;

    const relaxed = storage.getRelaxedMode();
    if (this.elements.relaxedCheck) this.elements.relaxedCheck.checked = relaxed;
  }

  selectCharacter(characterId) {
    const cards = document.querySelectorAll(".character-card");
    cards.forEach((card) => {
      const isSelected = card.dataset.character === characterId;
      card.classList.toggle("selected", isSelected);
    });
  }

  selectDifficulty(level) {
    this.elements.difficultyBtns.forEach((btn) => {
      const isSelected = parseInt(btn.dataset.difficulty) === level;
      btn.classList.toggle("selected", isSelected);
    });
  }

  getSelectedCharacter() {
    const selected = document.querySelector(".character-card.selected");
    return selected ? selected.dataset.character : "lili";
  }

  getSelectedDifficulty() {
    const selected = document.querySelector(".difficulty-btn.selected");
    return selected ? parseInt(selected.dataset.difficulty) : 1;
  }

  // ---- HUD ----
  updateHUD(playerName, score, wordsCompleted, lives, combo) {
    if (this.elements.hudName) this.elements.hudName.textContent = playerName || "Jugador/a";
    if (this.elements.hudScore) this.elements.hudScore.textContent = score;
    if (this.elements.hudWords) this.elements.hudWords.textContent = wordsCompleted;
    if (this.elements.livesDisplay) {
      if (lives >= 90) {
        // Modo infinito (fácil/relajado)
        this.elements.livesDisplay.textContent = "∞";
      } else {
        let hearts = "";
        for (let i = 0; i < Math.min(lives, 5); i++) hearts += "❤️ ";
        this.elements.livesDisplay.textContent = hearts.trim();
      }
    }
    if (this.elements.comboDisplay) {
      if (combo > 1) {
        this.elements.comboDisplay.textContent = `x${combo}`;
        this.elements.comboDisplay.classList.add("active");
      } else {
        this.elements.comboDisplay.classList.remove("active");
      }
    }
  }

  updateWordPanel(word, progress, showWord) {
    if (!this.elements.wordPanel) return;

    let html = "";
    if (showWord) {
      // Mostrar la palabra completa con progreso
      html = `<div class="word-display">${word.palabra}</div>`;
      html += `<div class="syllable-progress">`;
      for (let i = 0; i < word.silabas.length; i++) {
        const done = i < progress.current;
        const current = i === progress.current;
        html += `<span class="syllable-slot ${done ? "completed" : ""} ${current ? "current" : ""}">`;
        html += done ? word.silabas[i] : word.silabas[i];
        html += done ? " ✓" : current ? " ◄" : "";
        html += `</span>`;
      }
      html += `</div>`;
    } else {
      // Solo mostrar guiones/sílabas vacías
      html = `<div class="word-display">_ _ _</div>`;
      html += `<div class="syllable-progress">`;
      for (let i = 0; i < word.silabas.length; i++) {
        const done = i < progress.current;
        const current = i === progress.current;
        html += `<span class="syllable-slot ${done ? "completed" : ""} ${current ? "current" : ""}">`;
        html += done ? word.silabas[i] : current ? "¿?" : "⬜";
        html += `</span>`;
      }
      html += `</div>`;
    }

    // Barra de progreso
    const pct = word.silabas.length > 0 ? (progress.current / word.silabas.length) * 100 : 0;
    html += `<div class="progress-container"><div class="progress-fill" style="width:${pct}%"></div></div>`;

    this.elements.wordPanel.innerHTML = html;
  }

  // ---- Pause ----
  showPause() {
    if (this.elements.pauseOverlay) {
      this.elements.pauseOverlay.classList.remove("hidden");
    }
  }

  hidePause() {
    if (this.elements.pauseOverlay) {
      this.elements.pauseOverlay.classList.add("hidden");
    }
  }

  // ---- Game Over ----
  showGameOver(score, wordsCompleted, isNewRecord, highScore) {
    if (this.elements.finalScore) this.elements.finalScore.textContent = score;
    if (this.elements.finalWords) this.elements.finalWords.textContent = wordsCompleted;
    if (this.elements.finalRecord) this.elements.finalRecord.textContent = highScore;

    if (this.elements.newRecordBadge) {
      this.elements.newRecordBadge.classList.toggle("hidden", !isNewRecord);
    }

    // Mensaje motivacional
    const messages = [
      { min: 0, msg: "¡Gran intento! ¡Cada vez lo harás mejor! 🌟" },
      { min: 50, msg: "¡Muy bien! ¡Estás aprendiendo mucho! 🎉" },
      { min: 150, msg: "¡Increíble! ¡Eres un/a gran lector/a! 📚" },
      { min: 300, msg: "¡Fantástico! ¡Dominas las sílabas! 🏆" },
      { min: 500, msg: "¡EXTRAORDINARIO! ¡Eres un/a campeón/a! 👑" },
    ];
    const msg = messages
      .filter((m) => score >= m.min)
      .pop();

    if (this.elements.finalMessage) this.elements.finalMessage.textContent = msg ? msg.msg : messages[0].msg;
  }

  // ---- Mobile Detection ----
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
  }

  showMobileControls(show) {
    if (this.elements.mobileControls) {
      this.elements.mobileControls.classList.toggle("hidden", !show);
    }
    // Redimensionar canvas ya que los controles móviles cambian el espacio disponible
    setTimeout(() => {
      if (typeof game !== 'undefined' && game.handleResize) {
        game.handleResize();
      }
    }, 100);
  }

  // ---- Canvas Resize ----
  resizeCanvas(canvas, container, gridSize) {
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const maxSize = Math.min(containerWidth, containerHeight);
    const cellSize = Math.floor(maxSize / gridSize);
    const canvasSize = cellSize * gridSize;

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.width = canvasSize + "px";
    canvas.style.height = canvasSize + "px";

    return { cellSize, canvasSize };
  }
}

// ============================================================
// game.js
// ============================================================

// Estados del juego
const GAME_STATE = {
  MENU: "MENU",
  PLAYING: "PLAYING",
  PAUSED: "PAUSED",
  WORD_COMPLETE: "WORD_COMPLETE",
  GAME_OVER: "GAME_OVER",
};

class Game {
  constructor() {
    this.state = GAME_STATE.MENU;
    this.ui = new UI();
    this.storage = new Storage();
    this.wordManager = new WordManager();
    this.particles = new ParticleSystem();

    // Configuración del juego
    this.gridSize = 20;
    this.difficulty = 1;
    this.playerName = "";
    this.characterId = "lili";
    this.showWord = true;
    this.relaxedMode = true;

    // Objetos del juego
    this.snake = null;
    this.board = null;

    // Score y stats
    this.score = 0;
    this.lives = 3;
    this.combo = 0;
    this.comboTimer = 0;
    this.wordsCompleted = 0;
    this.syllablesInWord = 0;

    // Timing
    this.baseSpeed = 150;
    this.currentSpeed = 150;
    this.lastMoveTime = 0;
    this.bonusSpawnTimer = 0;

    // Canvas
    this.canvas = null;
    this.ctx = null;
    this.cellSize = 0;
    this.canvasOffset = { x: 0, y: 0 };

    // Animation frame
    this.animFrameId = null;

    // Bind
    this.gameLoop = this.gameLoop.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  init() {
    this.canvas = this.ui.elements.gameCanvas;
    this.ctx = this.canvas.getContext("2d");

    this.setupEventListeners();
    this.ui.setupMenu(this.storage);
    this.ui.showScreen("menu");

    if (this.ui.isMobile()) {
      this.ui.showMobileControls(true);
    }
  }

  setupEventListeners() {
    // Teclado
    document.addEventListener("keydown", this.handleKeyDown);

    // Botones del menú
    this.ui.elements.startBtn.addEventListener("click", () => this.startGame());
    this.ui.elements.playAgainBtn.addEventListener("click", () => this.startGame());
    this.ui.elements.menuBtn.addEventListener("click", () => this.goToMenu());

    // Selección de personaje
    document.querySelectorAll(".character-card").forEach((card) => {
      card.addEventListener("click", () => {
        const charId = card.dataset.character;
        const char = CHARACTERS[charId];
        const unlocked = this.storage.getUnlockedSkins();
        if (!unlocked.includes(charId) && char.unlockAt > 0) {
          const totalWords = this.storage.getTotalWords();
          if (totalWords >= char.unlockAt) {
            this.storage.unlockSkin(charId);
            // Actualizar visual del card recién desbloqueado
            card.classList.remove("locked");
            card.classList.add("unlocked");
            const unlockEl = card.querySelector(".character-unlock");
            if (unlockEl) unlockEl.textContent = "✓ DESBLOQUEADA";
          } else {
            card.classList.add("shake");
            setTimeout(() => card.classList.remove("shake"), 500);
            return;
          }
        }
        this.ui.selectCharacter(charId);
      });
    });

    // Selección de dificultad
    this.ui.elements.difficultyBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.ui.selectDifficulty(parseInt(btn.dataset.difficulty));
      });
    });

    // Opciones
    this.ui.elements.showWordCheck.addEventListener("change", (e) => {
      this.storage.setShowWord(e.target.checked);
    });
    this.ui.elements.soundCheck.addEventListener("change", (e) => {
      this.storage.setSoundEnabled(e.target.checked);
      audioManager.setEnabled(e.target.checked);
    });
    this.ui.elements.musicCheck.addEventListener("change", (e) => {
      this.storage.setMusicEnabled(e.target.checked);
      audioManager.setMusicEnabled(e.target.checked);
    });
    this.ui.elements.relaxedCheck.addEventListener("change", (e) => {
      this.storage.setRelaxedMode(e.target.checked);
    });

    // Pause
    this.ui.elements.pauseBtn.addEventListener("click", () => this.togglePause());
    this.ui.elements.resumeBtn.addEventListener("click", () => this.togglePause());
    this.ui.elements.quitBtn.addEventListener("click", () => this.goToMenu());

    // Controles móviles
    this.setupMobileControls();

    // Touch/Swipe
    this.setupSwipeControls();

    // Resize - múltiples eventos para cubrir todos los casos
    window.addEventListener("resize", () => this.handleResize());
    window.addEventListener("orientationchange", () => setTimeout(() => this.handleResize(), 200));
    // También escuchar visual viewport changes (teclado virtual en móvil)
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", () => this.handleResize());
    }
  }

  setupMobileControls() {
    const directions = [
      { id: "btn-up", dir: { x: 0, y: -1 } },
      { id: "btn-down", dir: { x: 0, y: 1 } },
      { id: "btn-left", dir: { x: -1, y: 0 } },
      { id: "btn-right", dir: { x: 1, y: 0 } },
    ];

    directions.forEach(({ id, dir }) => {
      const btn = document.getElementById(id);
      if (btn) {
        ["touchstart", "mousedown"].forEach((evt) => {
          btn.addEventListener(evt, (e) => {
            e.preventDefault();
            if (this.state === GAME_STATE.PLAYING && this.snake) {
              this.snake.setDirection(dir);
            }
          });
        });
      }
    });
  }

  setupSwipeControls() {
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener("touchend", (e) => {
      if (this.state !== GAME_STATE.PLAYING) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      const minSwipe = 30;

      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
        this.snake.setDirection(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
      } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > minSwipe) {
        this.snake.setDirection(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
      }
    }, { passive: true });
  }

  handleKeyDown(e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.code)) {
      e.preventDefault();
    }

    if (this.state === GAME_STATE.PLAYING) {
      const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        KeyW: { x: 0, y: -1 },
        KeyS: { x: 0, y: 1 },
        KeyA: { x: -1, y: 0 },
        KeyD: { x: 1, y: 0 },
      };

      const dir = keyMap[e.code];
      if (dir && this.snake) {
        this.snake.setDirection(dir);
      }

      if (e.code === "Escape" || e.code === "KeyP") {
        this.togglePause();
      }
    } else if (this.state === GAME_STATE.PAUSED) {
      if (e.code === "Escape" || e.code === "KeyP") {
        this.togglePause();
      }
    } else if (this.state === GAME_STATE.MENU) {
      if (e.code === "Enter") {
        this.startGame();
      }
    } else if (this.state === GAME_STATE.GAME_OVER) {
      if (e.code === "Enter") {
        this.startGame();
      }
    }
  }

  startGame() {
    // Leer configuración del menú
    this.playerName = this.ui.elements.playerName.value.trim() || "Jugador/a";
    this.characterId = this.ui.getSelectedCharacter();
    this.difficulty = this.ui.getSelectedDifficulty();
    this.showWord = this.ui.elements.showWordCheck.checked;
    this.relaxedMode = this.ui.elements.relaxedCheck.checked;

    // Guardar preferencias
    this.storage.setPlayerName(this.playerName);
    this.storage.setFavoriteCharacter(this.characterId);
    this.storage.setDifficulty(this.difficulty);

    // Inicializar audio
    audioManager.init();
    audioManager.setEnabled(this.ui.elements.soundCheck.checked);
    audioManager.setMusicEnabled(this.ui.elements.musicCheck.checked);

    // Reset juego
    this.score = 0;
    this.lives = this.difficulty === 3 ? 3 : 99;
    this.combo = 0;
    this.comboTimer = 0;
    this.wordsCompleted = 0;
    this.syllablesInWord = 0;
    this.wordManager.reset();
    this.particles.clear();

    // Velocidad según dificultad
    this.baseSpeed = this.difficulty === 1 ? 140 : this.difficulty === 2 ? 105 : 75;
    this.currentSpeed = this.baseSpeed;

    // Crear objetos
    this.snake = new Snake(this.gridSize, this.characterId);
    this.board = new Board(this.gridSize);

    // Obstáculos en dificultad media/difícil
    if (this.difficulty >= 2) {
      this.board.addObstacles(this.difficulty === 2 ? 5 : 10, this.snake.getOccupiedCells());
    }

    // Seleccionar primera palabra
    this.selectNewWord();

    // UI - Mostrar pantalla PRIMERO para que el contenedor tenga tamaño
    this.ui.showScreen("game");
    this.ui.showMobileControls(this.ui.isMobile());
    this.ui.updateHUD(this.playerName, this.score, this.wordsCompleted, this.lives, this.combo);

    // Canvas - Resize DESPUÉS de mostrar la pantalla
    // Usar requestAnimationFrame para asegurar que el layout esté calculado
    requestAnimationFrame(() => {
      this.handleResize();
      // Segundo frame para corregir si el primer cálculo fue incorrecto
      requestAnimationFrame(() => this.handleResize());
    });

    // Estado
    this.state = GAME_STATE.PLAYING;
    this.lastMoveTime = performance.now();
    this.bonusSpawnTimer = 0;

    // Iniciar loop
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = requestAnimationFrame(this.gameLoop);

    // Música
    audioManager.startMusic();

    // Narrar primera palabra
    if (this.wordManager.currentWord) {
      setTimeout(() => {
        audioManager.speakWord(
          this.wordManager.currentWord.palabra,
          this.wordManager.currentWord.silabas
        );
      }, 500);
    }
  }

  selectNewWord() {
    const word = this.wordManager.selectWord(this.difficulty);
    if (!word) return;

    // Limpiar sílabas de la palabra anterior (mantener distractores no consumidos)
    this.board.clearWordSyllables();

    // Número de distractores según dificultad
    const distractorCount = this.difficulty === 1 ? 1 : this.difficulty === 2 ? 3 : 5;
    const distractors = getDistractorSyllables(word, distractorCount);

    this.board.placeSyllables(word, distractors, this.snake.getOccupiedCells());
    this.syllablesInWord = 0;

    // Actualizar UI
    const progress = this.wordManager.getProgress();
    this.ui.updateWordPanel(word, progress, this.showWord);
  }

  gameLoop(timestamp) {
    // Siempre renderizar y actualizar partículas
    this.particles.update();

    if (this.state === GAME_STATE.PLAYING) {
      // Mover serpiente según velocidad
      const effectiveSpeed = this.snake && this.snake.speedBoostTimer > 0
        ? this.currentSpeed * 0.6
        : this.currentSpeed;

      if (timestamp - this.lastMoveTime >= effectiveSpeed) {
        this.update();
        this.lastMoveTime = timestamp;
      }

      // Combo timer
      if (this.comboTimer > 0) {
        this.comboTimer--;
        if (this.comboTimer <= 0) {
          this.combo = 0;
          this.ui.updateHUD(this.playerName, this.score, this.wordsCompleted, this.lives, this.combo);
        }
      }

      // Bonus spawn timer (menos frecuente)
      this.bonusSpawnTimer++;
      if (this.bonusSpawnTimer > 200) {
        this.bonusSpawnTimer = 0;
        // Limitar cantidad de bonus en tablero
        const activeBonuses = this.board.bonuses.filter(b => !b.collected).length;
        if (activeBonuses < 2) {
          this.board.placeBonus(this.snake.getOccupiedCells());
        }
      }

      // Actualizar tablero (animaciones)
      this.board.update();
    }

    // Renderizar siempre (para animaciones, partículas, etc.)
    this.render();

    // Continuar loop salvo que estemos en menú
    if (this.state !== GAME_STATE.MENU) {
      this.animFrameId = requestAnimationFrame(this.gameLoop);
    }
  }

  update() {
    if (this.state !== GAME_STATE.PLAYING || !this.snake) return;

    this.snake.move();

    const head = this.snake.head;

    // Verificar colisión con paredes
    if (this.snake.checkWallCollision(this.gridSize)) {
      this.handleCollision();
      return;
    }

    // Verificar colisión consigo misma
    if (this.snake.checkSelfCollision() && this.difficulty >= 2) {
      this.handleCollision();
      return;
    }

    // Verificar colisión con obstáculos
    if (this.board.checkObstacleCollision(head.x, head.y)) {
      this.handleCollision();
      return;
    }

    // Verificar colisión con sílabas
    const syllable = this.board.checkSyllableCollision(head.x, head.y);
    if (syllable) {
      this.handleSyllableCollection(syllable);
    }

    // Verificar colisión con bonus
    const bonus = this.board.checkBonusCollision(head.x, head.y);
    if (bonus) {
      this.handleBonusCollection(bonus);
    }
  }

  handleSyllableCollection(syllable) {
    // Verificar si es la sílaba objetivo actual
    const targetSyllable = this.wordManager.getCurrentTarget();
    const isCorrect = syllable.text === targetSyllable;

    if (isCorrect && !syllable.isDistractor) {
      // ¡Sílaba correcta!
      syllable.collected = true;
      this.syllablesInWord++;
      this.combo++;
      this.comboTimer = 40;

      // Puntos con combo
      const comboMultiplier = this.combo >= 4 ? 2 : 1;
      const points = 10 * comboMultiplier;
      this.score += points;

      // Crecimiento moderado: +1 cada 2 sílabas
      if (this.syllablesInWord % 2 === 0) {
        this.snake.grow(1);
      }

      // Efectos
      audioManager.playCorrect();

      // Partículas en la posición de la sílaba
      const canvasX = this.canvasOffset.x + syllable.x * this.cellSize + this.cellSize / 2;
      const canvasY = this.canvasOffset.y + syllable.y * this.cellSize + this.cellSize / 2;
      this.particles.emitCorrect(canvasX, canvasY);

      // Avanzar el word manager
      const result = this.wordManager.checkSyllable(syllable.text);

      // Narrar sílaba
      audioManager.speak(syllable.text);

      // Actualizar objetivos del tablero
      this.board.updateSyllableTargets(this.wordManager.currentSyllableIndex);

      // Actualizar UI
      const progress = this.wordManager.getProgress();
      this.ui.updateWordPanel(this.wordManager.currentWord, progress, this.showWord);
      this.ui.updateHUD(this.playerName, this.score, this.wordsCompleted, this.lives, this.combo);

      if (result.complete) {
        this.handleWordComplete();
      }
    } else {
      // Sílaba incorrecta o distractor
      this.handleWrongSyllable(syllable);
    }
  }

  handleWrongSyllable(syllable) {
    if (this.difficulty === 1 || this.relaxedMode) {
      this.snake.shake();
      syllable.bounceTimer = 1;
      audioManager.playError();

      const canvasX = this.canvasOffset.x + syllable.x * this.cellSize + this.cellSize / 2;
      const canvasY = this.canvasOffset.y + syllable.y * this.cellSize + this.cellSize / 2;
      this.particles.emitError(canvasX, canvasY);

      this.combo = 0;
      this.comboTimer = 0;
      this.ui.updateHUD(this.playerName, this.score, this.wordsCompleted, this.lives, this.combo);
    } else {
      this.snake.shake();
      audioManager.playError();
      this.combo = 0;
      this.comboTimer = 0;
      this.score = Math.max(0, this.score - 5);

      if (this.difficulty === 3) {
        this.lives--;
        this.snake.shrink(1);
      }

      this.ui.updateHUD(this.playerName, this.score, this.wordsCompleted, this.lives, this.combo);

      if (this.lives <= 0 && this.difficulty === 3) {
        this.gameOver();
      }
    }
  }

  handleWordComplete() {
    this.wordsCompleted++;
    this.score += 50;
    this.snake.celebrate();
    this.snake.grow(1);

    audioManager.playWordComplete();

    this.particles.emitConfetti(
      this.canvasOffset.x,
      this.canvasOffset.y,
      this.gridSize * this.cellSize,
      this.gridSize * this.cellSize * 0.3
    );

    audioManager.speak(this.wordManager.currentWord.palabra);

    this.storage.addTotalWords(1);

    // Limpiar ítems recolectados
    this.board.removeCollected();

    // Breve celebración
    this.state = GAME_STATE.WORD_COMPLETE;
    this.ui.updateHUD(this.playerName, this.score, this.wordsCompleted, this.lives, this.combo);

    setTimeout(() => {
      if (this.state === GAME_STATE.WORD_COMPLETE) {
        this.selectNewWord();
        this.state = GAME_STATE.PLAYING;
      }
    }, 1200);
  }

  handleBonusCollection(bonus) {
    bonus.collected = true;
    audioManager.playBonus();

    const canvasX = this.canvasOffset.x + bonus.x * this.cellSize + this.cellSize / 2;
    const canvasY = this.canvasOffset.y + bonus.y * this.cellSize + this.cellSize / 2;
    this.particles.emitBonus(canvasX, canvasY);

    switch (bonus.info.effect) {
      case "points":
        this.score += bonus.info.value;
        break;
      case "invincible":
        this.snake.invincibleTimer = 60;
        break;
      case "speed":
        this.snake.speedBoostTimer = 50;
        break;
      case "life":
        this.lives = Math.min(this.lives + 1, 5);
        break;
      case "shrink":
        this.snake.shrink(2);
        break;
    }

    this.ui.updateHUD(this.playerName, this.score, this.wordsCompleted, this.lives, this.combo);
  }

  handleCollision() {
    if (this.snake.invincibleTimer > 0) return;

    if (this.difficulty === 1 || this.relaxedMode) {
      this.snake.shake();
      audioManager.playError();

      // Teletransportar al centro
      const mid = Math.floor(this.gridSize / 2);
      this.snake.body[0] = { x: mid, y: mid };
      this.snake.direction = { x: 1, y: 0 };
      this.snake.nextDirection = { x: 1, y: 0 };
      this.combo = 0;
    } else {
      this.lives--;
      this.snake.shake();
      audioManager.playError();

      if (this.lives <= 0) {
        this.gameOver();
      } else {
        const mid = Math.floor(this.gridSize / 2);
        this.snake.body[0] = { x: mid, y: mid };
        this.snake.direction = { x: 1, y: 0 };
        this.snake.nextDirection = { x: 1, y: 0 };
        this.snake.shrink(1);
      }
      this.ui.updateHUD(this.playerName, this.score, this.wordsCompleted, this.lives, this.combo);
    }
  }

  gameOver() {
    this.state = GAME_STATE.GAME_OVER;

    audioManager.playGameOver();
    audioManager.stopMusic();

    this.particles.emitGameOver(
      this.canvasOffset.x,
      this.canvasOffset.y,
      this.gridSize * this.cellSize,
      this.gridSize * this.cellSize
    );

    const isNewRecord = this.storage.setHighScore(this.score);
    const highScore = this.storage.getHighScore();
    this.storage.incrementGamesPlayed();

    this.ui.showGameOver(this.score, this.wordsCompleted, isNewRecord, highScore);

    setTimeout(() => {
      this.ui.showScreen("gameOver");
    }, 800);
  }

  togglePause() {
    if (this.state === GAME_STATE.PLAYING) {
      this.state = GAME_STATE.PAUSED;
      this.ui.showPause();
      audioManager.stopMusic();
    } else if (this.state === GAME_STATE.PAUSED) {
      this.state = GAME_STATE.PLAYING;
      this.ui.hidePause();
      this.lastMoveTime = performance.now();
      audioManager.startMusic();
    }
  }

  goToMenu() {
    this.state = GAME_STATE.MENU;
    audioManager.stopMusic();
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.ui.showScreen("menu");
    this.ui.setupMenu(this.storage);
  }

  handleResize() {
    if (!this.canvas) return;
    const container = document.getElementById("canvas-container");
    if (!container) return;

    // Resetear tamaño del canvas para que el contenedor pueda medirse correctamente
    this.canvas.style.width = "1px";
    this.canvas.style.height = "1px";

    // Forzar reflow para obtener medidas correctas
    void container.offsetHeight;

    // Método 1: Usar el contenedor directamente
    let containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;

    // Método 2: Si el contenedor no tiene tamaño (pantalla oculta), calcular desde viewport
    if (containerWidth < 50 || containerHeight < 50) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Medir los elementos que ocupan espacio arriba y abajo del canvas
      const hud = document.getElementById("game-hud");
      const wordPanel = document.getElementById("word-panel");
      const mobileCtrl = document.getElementById("mobile-controls");
      const hudH = hud ? hud.offsetHeight : 50;
      const wpH = wordPanel ? wordPanel.offsetHeight : 60;
      const mcH = (mobileCtrl && !mobileCtrl.classList.contains("hidden")) ? mobileCtrl.offsetHeight : 0;
      containerWidth = vw - 8;
      containerHeight = vh - hudH - wpH - mcH - 8;
    }

    // Usar el máximo espacio disponible
    const maxSize = Math.max(Math.min(containerWidth, containerHeight), 100);
    const cellSize = Math.max(Math.floor(maxSize / this.gridSize), 8);
    const canvasSize = cellSize * this.gridSize;

    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;

    // Escalar visualmente para llenar el contenedor manteniendo aspecto
    const displaySize = Math.min(containerWidth, containerHeight, maxSize);
    this.canvas.style.width = displaySize + "px";
    this.canvas.style.height = displaySize + "px";

    this.cellSize = cellSize;
    this.canvasOffset = { x: 0, y: 0 };
  }

  render() {
    if (!this.ctx || !this.canvas || !this.board) return;

    const ctx = this.ctx;
    const cs = this.cellSize;
    const ox = this.canvasOffset.x;
    const oy = this.canvasOffset.y;

    // Limpiar
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Tablero
    this.board.draw(ctx, cs, ox, oy, this.showWord);

    // Serpiente
    if (this.snake) {
      this.snake.draw(ctx, cs, ox, oy);
    }

    // Partículas (encima de todo)
    this.particles.draw(ctx);
  }
}

// ---- Inicialización ----
const game = new Game();

// Cargar voces cuando estén disponibles
if ("speechSynthesis" in window) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

// Esperar a que cargue el DOM
document.addEventListener("DOMContentLoaded", () => {
  game.init();
});
