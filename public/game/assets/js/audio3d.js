// audio3d.js — SFX procedurales con Web Audio API (sin assets externos)
// Sonido amigable para niños: ding cristalino, boop suave, fanfarria breve.

const MUSIC_BPM = 96;
const MUSIC_STEPS_PER_BEAT = 2;
const MUSIC_CHORDS = [
  [130.81, 164.81, 196.00],
  [110.00, 130.81, 164.81],
  [87.31, 110.00, 130.81],
  [98.00, 123.47, 146.83],
];
const MUSIC_MELODY = [
  659.25, null, 783.99, null, 880.00, null, 783.99, null,
  659.25, null, 523.25, null, 659.25, null, 880.00, null,
  440.00, null, 523.25, null, 659.25, null, 523.25, null,
  587.33, null, 783.99, null, 493.88, null, 587.33, null,
];

class AudioEngine {
  constructor() {
    this.ctx = null; this.master = null; this.musicGain = null; this.sfxGain = null;
    this.enabled = true; this.musicOn = true; this.musicNodes = []; this._started = false; this._stopTimer = null;
    this._musicTimer = null; this._musicBus = null; this._nextMusicNoteTime = 0; this._musicStep = 0;
  }
  ensure() {
    if (this._started) return; this._started = true;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.9; this.master.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = 0.85; this.sfxGain.connect(this.master);
      this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0.18; this.musicGain.connect(this.master);
    } catch (e) { console.warn('AudioContext init failed', e); this.enabled = false; }
  }
  resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
  setEnabled(v) { this.enabled = v; if (this.master) this.master.gain.value = v ? 0.9 : 0; }
  setMusic(v) { this.musicOn = v; if (this.musicGain) this.musicGain.gain.value = v ? 0.18 : 0; }

  // --- Helpers ---
  _tone(freq, t0, dur, type = 'sine', gain = 0.4, glide = 0) {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator(); const g = this.ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t0);
    if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + glide), t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(g); g.connect(this.sfxGain); osc.start(t0); osc.stop(t0 + dur + 0.02);
  }
  _noise(t0, dur, gain = 0.3, freq = 1000, q = 1) {
    if (!this.ctx || !this.enabled) return;
    const buf = this.ctx.createBuffer(1, Math.ceil(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    const filt = this.ctx.createBiquadFilter(); filt.type = 'bandpass'; filt.frequency.value = freq; filt.Q.value = q;
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    src.connect(filt); filt.connect(g); g.connect(this.sfxGain); src.start(t0); src.stop(t0 + dur + 0.02);
  }

  // --- SFX públicos ---
  correct() { const t = this.ctx ? this.ctx.currentTime : 0;
    // ding cristalino: dos tonos (fundamental + quinta)
    this._tone(880, t, 0.18, 'triangle', 0.32);
    this._tone(1320, t + 0.04, 0.16, 'sine', 0.22);
    this._tone(1760, t + 0.08, 0.10, 'sine', 0.12);
  }
  error() { const t = this.ctx ? this.ctx.currentTime : 0;
    // boop descendiente suave
    this._tone(440, t, 0.18, 'sine', 0.28, -180);
    this._tone(220, t + 0.06, 0.14, 'sine', 0.18, -80);
  }
  word() { const t = this.ctx ? this.ctx.currentTime : 0;
    // mini fanfarria: do-mi-sol-do agudo
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => this._tone(f, t + i * 0.09, 0.22, 'triangle', 0.32));
    this._tone(1568, t + 0.36, 0.30, 'sine', 0.20);
  }
  bonus() { const t = this.ctx ? this.ctx.currentTime : 0;
    // pop divertido con ruido filtrado
    this._noise(t, 0.08, 0.3, 1200, 1.5);
    this._tone(1318, t, 0.10, 'sine', 0.25, 400);
    this._tone(1760, t + 0.05, 0.10, 'sine', 0.18, 300);
  }
  combo() { const t = this.ctx ? this.ctx.currentTime : 0;
    // arpegio rápido ascendente
    const notes = [659, 880, 1046, 1318];
    notes.forEach((f, i) => this._tone(f, t + i * 0.05, 0.10, 'sine', 0.18));
  }
  lifeUp() { const t = this.ctx ? this.ctx.currentTime : 0;
    const notes = [523, 659, 784, 1046];
    notes.forEach((f, i) => this._tone(f, t + i * 0.08, 0.20, 'triangle', 0.28));
  }
  gameOver() { const t = this.ctx ? this.ctx.currentTime : 0;
    // descenso melancólico
    this._tone(440, t, 0.30, 'sine', 0.3, -120);
    this._tone(330, t + 0.18, 0.30, 'sine', 0.25, -100);
    this._tone(220, t + 0.36, 0.55, 'sine', 0.22, -60);
  }
  move() { const t = this.ctx ? this.ctx.currentTime : 0;
    // tick casi silencioso para feedback de paso (opcional)
    this._tone(1800, t, 0.018, 'sine', 0.04);
  }
  click() { const t = this.ctx ? this.ctx.currentTime : 0;
    // Pulso corto y redondeado: evita el borde áspero de la onda cuadrada.
    this._tone(620, t, 0.055, 'triangle', 0.08, 90);
  }

  // --- Música ambiental ---
  _musicTone(freq, t0, dur, { type = 'triangle', gain = 0.06, attack = 0.012, cutoff = 1800 } = {}) {
    if (!this.ctx || !this._musicBus || !this.enabled || !this.musicOn) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const envelope = this.ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, t0);
    filter.type = 'lowpass'; filter.frequency.setValueAtTime(cutoff, t0); filter.Q.value = 0.7;
    envelope.gain.setValueAtTime(0.0001, t0);
    envelope.gain.exponentialRampToValueAtTime(gain, t0 + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(filter); filter.connect(envelope); envelope.connect(this._musicBus);
    osc.onended = () => { osc.disconnect(); filter.disconnect(); envelope.disconnect(); };
    osc.start(t0); osc.stop(t0 + dur + 0.03);
  }

  _scheduleMusicStep(step, t0) {
    // Cuatro compases a 96 BPM: Do - Lam - Fa - Sol.
    const localStep = step % MUSIC_MELODY.length;
    const bar = Math.floor(localStep / 8);
    if (localStep % 8 === 0) {
      MUSIC_CHORDS[bar].forEach((freq) => this._musicTone(freq, t0, 2.35, {
        type: 'sine', gain: 0.034, attack: 0.14, cutoff: 1100,
      }));
    }
    if (localStep % 4 === 0) {
      this._musicTone(MUSIC_CHORDS[bar][0] / 2, t0, 0.62, {
        type: 'sine', gain: 0.045, attack: 0.025, cutoff: 500,
      });
    }
    const note = MUSIC_MELODY[localStep];
    if (note) this._musicTone(note, t0, 0.24, {
      type: 'triangle', gain: localStep % 8 === 0 ? 0.072 : 0.058, cutoff: 2400,
    });
  }

  _runMusicScheduler() {
    if (!this.ctx || !this._musicBus || this._musicTimer) return;
    const secondsPerStep = 60 / MUSIC_BPM / MUSIC_STEPS_PER_BEAT;
    const tick = () => {
      this._musicTimer = null;
      if (!this.ctx || !this._musicBus) return;
      // Evita recuperar cientos de notas después de que el navegador suspenda la pestaña.
      if (this._nextMusicNoteTime < this.ctx.currentTime - secondsPerStep) {
        this._nextMusicNoteTime = this.ctx.currentTime + 0.05;
      }
      while (this._nextMusicNoteTime < this.ctx.currentTime + 0.14) {
        this._scheduleMusicStep(this._musicStep, this._nextMusicNoteTime);
        this._musicStep = (this._musicStep + 1) % MUSIC_MELODY.length;
        this._nextMusicNoteTime += secondsPerStep;
      }
      this._musicTimer = setTimeout(tick, 50);
    };
    tick();
  }

  startMusic() {
    if (!this.ctx || !this.musicOn || !this.enabled) return;
    if (this._stopTimer) { clearTimeout(this._stopTimer); this._stopTimer = null; }
    if (this._musicBus) {
      const now = this.ctx.currentTime;
      this._musicBus.gain.cancelScheduledValues(now);
      this._musicBus.gain.setTargetAtTime(0.78, now, 0.12);
      this._nextMusicNoteTime = Math.max(this._nextMusicNoteTime, now + 0.05);
      this._runMusicScheduler();
      return;
    }
    const bus = this.ctx.createGain();
    const tone = this.ctx.createBiquadFilter();
    bus.gain.value = 0; tone.type = 'lowpass'; tone.frequency.value = 4200; tone.Q.value = 0.35;
    bus.connect(tone); tone.connect(this.musicGain);
    bus.gain.setTargetAtTime(0.78, this.ctx.currentTime, 0.45);
    this.musicNodes.push(bus, tone); this._musicBus = bus;
    this._musicStep = 0; this._nextMusicNoteTime = this.ctx.currentTime + 0.06;
    this._runMusicScheduler();
  }
  stopMusic() {
    if (!this.ctx) return;
    if (this._stopTimer) clearTimeout(this._stopTimer);
    if (this._musicTimer) { clearTimeout(this._musicTimer); this._musicTimer = null; }
    if (this._musicBus) this._musicBus.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
    this._stopTimer = setTimeout(() => {
      for (const n of this.musicNodes) { try { if (n.stop) n.stop(); if (n.disconnect) n.disconnect(); } catch (e) {} }
      this.musicNodes = []; this._musicBus = null;
      this._stopTimer = null;
    }, 700);
  }
}

export const audio = new AudioEngine();
