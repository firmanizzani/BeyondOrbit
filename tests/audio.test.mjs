import test from 'node:test';
import assert from 'node:assert/strict';
import { AudioSystem } from '../js/audio.js';
import { defaults } from '../js/storage.js';

// Record audio graph routing and scheduled automation, without audio hardware.
class Parameter {
  value = 0;
  setTargetAtTime(value) {
    this.value = value;
  }
  setValueAtTime(value) {
    this.value = value;
  }
  exponentialRampToValueAtTime(value) {
    this.value = value;
  }
  linearRampToValueAtTime(value) {
    this.value = value;
  }
}
class Node {
  connections = [];
  connect(node) {
    this.connections.push(node);
    return node;
  }
  disconnect() {
    this.connections = [];
  }
}
class Context {
  currentTime = 0;
  destination = new Node();
  oscillators = [];
  createGain() {
    return Object.assign(new Node(), { gain: new Parameter() });
  }
  createOscillator() {
    const node = Object.assign(new Node(), {
      frequency: new Parameter(),
      start() {},
      stop() {},
    });
    this.oscillators.push(node);
    return node;
  }
  createDynamicsCompressor() {
    return Object.assign(new Node(), {
      threshold: new Parameter(),
      knee: new Parameter(),
      ratio: new Parameter(),
    });
  }
  resume() {
    return Promise.resolve();
  }
}
function withAudio(run) {
  const before = globalThis.window;
  globalThis.window = { AudioContext: Context };
  try {
    const audio = new AudioSystem();
    audio.start({ ...defaults });
    run(audio);
  } finally {
    globalThis.window = before;
  }
}

test('master, music, and effects have separate gain paths and mute preserves slider values', () => {
  withAudio((audio) => {
    audio.apply({ ...defaults, master: 0.7, music: 0.25, effects: 0.8 });
    assert.equal(audio.master.gain.value, 0.7);
    assert.equal(audio.music.gain.value, 0.25);
    assert.equal(audio.effects.gain.value, 0.8);
    assert.equal(audio.music.connections[0], audio.master);
    assert.equal(audio.effects.connections[0], audio.master);
    audio.apply({ ...defaults, master: 0.7, music: 0.25, effects: 0.8, mute: true });
    assert.equal(audio.master.gain.value, 0);
    assert.equal(audio.music.gain.value, 0.25);
    assert.equal(audio.effects.gain.value, 0.8);
  });
});

test('audio previews are routed through their corresponding volume controls', () => {
  withAudio((audio) => {
    for (const bus of ['music', 'effects']) {
      const start = audio.context.oscillators.length;
      audio.preview(bus);
      const voices = audio.context.oscillators.slice(start);
      assert.ok(voices.length >= 3);
      for (const voice of voices)
        assert.equal(voice.connections[0].connections[0], audio[bus]);
    }
  });
});

test('boost has a distinct onset and scanner pulses continue only while scanning', () => {
  withAudio((audio) => {
    const tones = [];
    const originalTone = audio.tone.bind(audio);
    audio.tone = (kind) => {
      tones.push(kind);
      originalTone(kind);
    };
    audio.update(200, true, true, false);
    audio.update(200, true, true, false);
    assert.deepEqual(tones, ['boost']);
    audio.update(0, false, true, true);
    audio.context.currentTime = 0.5;
    audio.update(0, false, true, true);
    assert.equal(tones.filter((t) => t === 'scan').length, 2);
    audio.context.currentTime = 1;
    audio.update(0, false, false, false);
    assert.equal(tones.filter((t) => t === 'scan').length, 2);
    assert.equal(audio.engineGain.gain.value, 0);
  });
});
