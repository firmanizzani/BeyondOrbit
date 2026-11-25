import { FLIGHT } from './flight.js';

export class AudioSystem {
  constructor() {
    this.context = null;
    this.settings = null;
  }
  start(s) {
    this.settings = s;
    if (!this.context) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return;
      this.context = new C();
      const c = this.context;
      this.master = c.createGain();
      this.master.connect(c.destination);
      this.music = c.createGain();
      this.music.connect(this.master);
      this.effects = c.createGain();
      this.effects.connect(this.master);
      this.engine = c.createOscillator();
      this.engine.type = 'triangle';
      this.engine.frequency.value = 36;
      this.engineGain = c.createGain();
      this.engineGain.gain.value = 0;
      this.engine.connect(this.engineGain).connect(this.effects);
      this.engine.start();
      for (const f of [55, 82.41, 110, 164.81]) {
        const o = c.createOscillator(),
          gain = c.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        gain.gain.value = 0.022;
        o.connect(gain).connect(this.music);
        o.start();
        const lfo = c.createOscillator(),
          lg = c.createGain();
        lfo.frequency.value = 0.07 + f * 0.0002;
        lg.gain.value = 0.01;
        lfo.connect(lg).connect(gain.gain);
        lfo.start();
      }
    }
    this.context.resume().catch(() => {});
    this.apply(s);
  }
  apply(s) {
    this.settings = s;
    if (!this.context) return;
    const t = this.context.currentTime;
    this.master.gain.setTargetAtTime(s.mute ? 0 : s.master, t, 0.1);
    this.music.gain.setTargetAtTime(s.music, t, 0.1);
    this.effects.gain.setTargetAtTime(s.effects, t, 0.1);
  }
  update(speed, boost, playing) {
    if (!this.context) return;
    const t = this.context.currentTime;
    this.engine.frequency.setTargetAtTime(32 + speed * 0.4 + (boost ? 25 : 0), t, 0.15);
    this.engineGain.gain.setTargetAtTime(
      playing ? 0.015 + Math.min(speed / FLIGHT.boostSpeed, 1) * 0.05 : 0,
      t,
      0.2,
    );
  }
  tone(kind = 'ui') {
    if (!this.context) return;
    const c = this.context,
      t = c.currentTime,
      o = c.createOscillator(),
      g = c.createGain();
    o.connect(g).connect(this.effects);
    const f = { ui: 660, scan: 180, discovery: 523, warp: 65 }[kind] || 660;
    const duration =
      kind === 'warp' ? 3.7 : kind === 'scan' ? 0.5 : kind === 'discovery' ? 1.2 : 0.12;
    o.type = kind === 'warp' ? 'sawtooth' : 'sine';
    o.frequency.setValueAtTime(f, t);
    o.frequency.exponentialRampToValueAtTime(
      kind === 'warp' ? 650 : f * (kind === 'discovery' ? 2 : 1.25),
      t + duration,
    );
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(kind === 'warp' ? 0.035 : 0.09, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.start(t);
    o.stop(t + duration + 0.1);
  }
}
