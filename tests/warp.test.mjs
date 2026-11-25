import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import { WarpDrive } from '../js/warp.js';
import { textureFor } from '../js/planet.js';

function fixture(reducedMotion = false) {
  const nodes = new Map();
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  globalThis.document = {
    querySelector(selector) {
      if (!nodes.has(selector)) {
        const classes = new Set();
        nodes.set(selector, {
          style: {},
          textContent: '',
          classList: {
            add: (v) => classes.add(v),
            remove: (v) => classes.delete(v),
            contains: (v) => classes.has(v),
          },
        });
      }
      return nodes.get(selector);
    },
  };
  globalThis.window = { matchMedia: () => ({ matches: reducedMotion }) };
  let resolveLoading;
  const pending = new Promise((resolve) => {
    resolveLoading = resolve;
  });
  const target = { id: 'cryon', name: 'Cryon System' };
  const game = {
    system: { id: 'solar', name: 'Solar System' },
    state: 'playing',
    scene: new T.Scene(),
    camera: new T.PerspectiveCamera(55, 16 / 9, 0.1, 7000),
    ship: {
      position: new T.Vector3(),
      velocity: new T.Vector3(),
      visual: { visible: true },
    },
    universe: {
      group: new T.Group(),
      background: new T.Group(),
      hiddenDuringWarp: false,
    },
    ui: { hidePanel() {}, syncVisibility() {}, toast() {} },
    scanner: { cancel() {} },
    autopilot: { cancel() {} },
    controls: { unlock() {} },
    audio: { tone() {} },
    saves: 0,
    save() {
      this.saves++;
    },
    fail(error) {
      throw error;
    },
    loadSystem() {
      return pending.then(() => {
        game.system = target;
        game.universe.group = new T.Group();
        game.universe.group.visible = !game.universe.hiddenDuringWarp;
        game.ship.position.set(1000, 10, 80);
      });
    },
  };
  game.cameraRig = {
    mode: 'third',
    initial: false,
    update() {
      assert.equal(
        Number(nodes.get('#warp-curtain').style.opacity),
        1,
        'Camera moved before the screen was covered',
      );
      game.camera.position.copy(game.ship.position);
    },
  };
  const warp = new WarpDrive(game);
  const advance = (seconds) => {
    for (let i = 0; i < Math.ceil(seconds * 60); i++) warp.update(1 / 60);
  };
  return {
    game,
    warp,
    target,
    nodes,
    advance,
    resolveLoading,
    restore() {
      globalThis.document = previousDocument;
      globalThis.window = previousWindow;
    },
  };
}

test('warp keeps controls disabled and animates while destination loading is delayed', async () => {
  const f = fixture();
  try {
    f.warp.start(f.target);
    assert.equal(f.game.state, 'warping');
    assert.equal(f.game.ship.visual.visible, false);
    f.advance(1.1);
    assert.equal(f.warp.phase, 'travel');
    assert.equal(f.game.universe.group.visible, false);
    const before = f.warp.lines.geometry.attributes.position.getZ(0);
    f.advance(4);
    assert.equal(f.warp.phase, 'travel');
    assert.equal(f.game.state, 'warping');
    assert.notEqual(f.warp.lines.geometry.attributes.position.getZ(0), before);
    assert.equal(f.game.camera.position.x, 0);
    f.resolveLoading();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    f.advance(2.5);
    assert.equal(f.warp.phase, 'idle');
    assert.equal(f.game.state, 'playing');
    assert.equal(f.game.universe.group.visible, true);
    assert.equal(f.game.universe.background.visible, true);
    assert.equal(f.game.camera.position.x, 1000);
    assert.equal(f.game.camera.fov, 55);
    assert.equal(f.game.ship.visual.visible, true);
    assert.equal(f.game.saves, 1);
    assert.equal(f.nodes.get('#warp-curtain').classList.contains('hidden'), true);
  } finally {
    f.restore();
  }
});

test('reduced-motion warp avoids star streaks and FOV movement and preserves cockpit mode', async () => {
  const f = fixture(true);
  try {
    f.game.cameraRig.mode = 'first';
    f.warp.start(f.target);
    assert.equal(f.warp.lines.visible, false);
    f.advance(0.8);
    assert.equal(f.game.camera.fov, 55);
    f.resolveLoading();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    f.advance(3);
    assert.equal(f.game.state, 'playing');
    assert.equal(f.game.camera.fov, 55);
    assert.equal(f.game.ship.visual.visible, false);
  } finally {
    f.restore();
  }
});

test('procedural texture generation yields between row batches so rendering can continue', async () => {
  const previousDocument = globalThis.document;
  const previousFrame = globalThis.requestAnimationFrame;
  let frames = 0,
    uploaded = false;
  globalThis.document = {
    createElement: () => ({
      width: 0,
      height: 0,
      getContext: () => ({
        createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }),
        putImageData() {
          uploaded = true;
        },
      }),
    }),
  };
  globalThis.requestAnimationFrame = (callback) =>
    queueMicrotask(() => {
      frames++;
      callback(0);
    });
  try {
    const texture = await textureFor({
      id: 'async-test-rock',
      color: '#888888',
      texture: 'rock',
    });
    assert.equal(frames, 31);
    assert.equal(uploaded, true);
    assert.equal(texture.isTexture, true);
    texture.dispose();
  } finally {
    globalThis.document = previousDocument;
    globalThis.requestAnimationFrame = previousFrame;
  }
});
