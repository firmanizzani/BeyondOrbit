import { FLIGHT } from './flight.js';

export class AudioSystem {
  constructor() {
    this.context = null;
    this.settings = null;
    this.wasBoosting = false;
    this.nextScanTime = 0;
  }
  start(s) {
    this.settings = s;
    if (!this.context) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return;
      this.context = new C();
      const c = this.context;
      this.master = c.createGain();
      const limiter = c.createDynamicsCompressor();
      limiter.threshold.value = -12;
      limiter.knee.value = 18;
      limiter.ratio.value = 4;
      this.master.connect(limiter).connect(c.destination);
      this.music = c.createGain();
      this.music.connect(this.master);
      this.effects = c.createGain();
      this.effects.connect(this.master);
      this.engine = c.createOscillator();
      this.engine.type = 'triangle';
      this.engine.frequency.value = 85;
      this.engineGain = c.createGain();
      this.engineGain.gain.value = 0;
      this.engine.connect(this.engineGain).connect(this.effects);
      this.engine.start();
      for (const f of [130.81, 196, 261.63, 392]) {
        const o = c.createOscillator(),
          gain = c.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        gain.gain.value = 0.035;
        o.connect(gain).connect(this.music);
        o.start();
        const lfo = c.createOscillator(),
          lg = c.createGain();
        lfo.frequency.value = 0.07 + f * 0.0002;
        lg.gain.value = 0.008;
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
  update(speed, boost, playing, scanning = false) {
    if (!this.context) return;
    const t = this.context.currentTime;
    this.engine.frequency.setTargetAtTime(85 + speed * 0.45 + (boost ? 70 : 0), t, 0.15);
    this.engineGain.gain.setTargetAtTime(
      playing ? 0.035 + Math.min(speed / FLIGHT.boostSpeed, 1) * 0.11 : 0,
      t,
      0.2,
    );
    if (playing && boost && !this.wasBoosting) this.tone('boost');
    this.wasBoosting = playing && boost;
    if (playing && scanning && t >= this.nextScanTime) this.tone('scan');
    if (!scanning) this.nextScanTime = 0;
  }
  note(
    frequency,
    endFrequency,
    duration,
    level,
    type = 'sine',
    delay = 0,
    bus = 'effects',
  ) {
    if (!this.context) return;
    const c = this.context,
      t = c.currentTime + delay,
      o = c.createOscillator(),
      g = c.createGain();
    o.connect(g).connect(this[bus]);
    o.type = type;
    o.frequency.setValueAtTime(frequency, t);
    o.frequency.exponentialRampToValueAtTime(endFrequency, t + duration);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(level, t + Math.min(0.04, duration * 0.2));
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    o.start(t);
    o.stop(t + duration + 0.1);
    o.onended = () => {
      o.disconnect();
      g.disconnect();
    };
  }
  tone(kind = 'ui') {
    if (!this.context) return;
    switch (kind) {
      case 'scan':
        this.nextScanTime = this.context.currentTime + 0.48;
        this.note(520, 780, 0.22, 0.16);
        this.note(1040, 1040, 0.12, 0.07, 'sine', 0.12);
        break;
      case 'discovery':
        [523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
          this.note(f, f, 0.6, 0.15, 'sine', i * 0.13),
        );
        break;
      case 'warp':
        this.note(130, 1200, 3.2, 0.09, 'sawtooth');
        this.note(195, 850, 3.5, 0.08, 'triangle');
        break;
      case 'boost':
        this.note(180, 700, 0.65, 0.16, 'triangle');
        break;
      default:
        this.note(740, 920, 0.13, 0.14);
    }
  }
  preview(bus) {
    if (!this.context) return;
    if (bus === 'music') {
      [261.63, 329.63, 392].forEach((f, i) =>
        this.note(f, f, 1.2, 0.1, 'sine', i * 0.12, 'music'),
      );
    } else {
      this.tone('scan');
      this.note(180, 700, 0.6, 0.16, 'triangle', 0.5);
      [523.25, 659.25, 783.99].forEach((f, i) =>
        this.note(f, f, 0.5, 0.15, 'sine', 1.25 + i * 0.13),
      );
    }
  }
}
