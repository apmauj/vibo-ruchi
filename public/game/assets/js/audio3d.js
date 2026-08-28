// audio3d.js — SFX procedurales con Web Audio API (sin assets externos)
// Sonido amigable para niños: ding cristalino, boop suave, fanfarria breve.

class AudioEngine {
  constructor() {
    this.ctx = null; this.master = null; this.musicGain = null; this.sfxGain = null;
    this.enabled = true; this.musicOn = true; this.musicNodes = []; this._started = false; this._stopTimer = null;
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
    this._tone(700, t, 0.04, 'square', 0.12, 200);
  }

  // --- Música ambiental ---
  startMusic() {
    if (!this.ctx || !this.musicOn || !this.enabled) return;
    if (this._stopTimer) { clearTimeout(this._stopTimer); this._stopTimer = null; }
    if (this.musicNodes.length) {
      if (this._musicPad) this._musicPad.gain.setTargetAtTime(0.8, this.ctx.currentTime, 0.15);
      return;
    }
    // Acorde pad suave en Do mayor con leve vibrato
    const pad = this.ctx.createGain(); pad.gain.value = 0; pad.connect(this.musicGain);
    pad.gain.setTargetAtTime(0.8, this.ctx.currentTime, 1.5);
    const freqs = [130.81, 196.00, 261.63, 392.00]; // C3 G3 C4 G4
    for (const f of freqs) {
      const o = this.ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      const lfo = this.ctx.createOscillator(); lfo.frequency.value = 0.18 + Math.random() * 0.12;
      const lfoG = this.ctx.createGain(); lfoG.gain.value = 1.5;
      lfo.connect(lfoG); lfoG.connect(o.frequency);
      const g = this.ctx.createGain(); g.gain.value = 0.18;
      o.connect(g); g.connect(pad);
      o.start(); lfo.start();
      this.musicNodes.push(o, lfo);
    }
    this.musicNodes.push(pad);
    this._musicPad = pad;
  }
  stopMusic() {
    if (!this.ctx) return;
    if (this._stopTimer) clearTimeout(this._stopTimer);
    if (this._musicPad) this._musicPad.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
    this._stopTimer = setTimeout(() => {
      for (const n of this.musicNodes) { try { if (n.stop) n.stop(); if (n.disconnect) n.disconnect(); } catch (e) {} }
      this.musicNodes = []; this._musicPad = null;
      this._stopTimer = null;
    }, 700);
  }
}

export const audio = new AudioEngine();
