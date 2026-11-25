import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import { isMobileDevice, stickAxes, MobileControls } from '../js/mobile.js';
import { Controls } from '../js/controls.js';
import { Spaceship } from '../js/spaceship.js';
import { defaults } from '../js/storage.js';

class Element extends EventTarget {
  style = {};
  dataset = {};
  attributes = new Map();
  classes = new Set();
  classList = {
    add: (value) => this.classes.add(value),
    remove: (value) => this.classes.delete(value),
    toggle: (value, force) =>
      force ? this.classes.add(value) : this.classes.delete(value),
    contains: (value) => this.classes.has(value),
  };
  setAttribute(key, value) {
    this.attributes.set(key, value);
  }
  setPointerCapture() {}
  getBoundingClientRect() {
    return { left: 0, top: 0, width: 132, height: 132 };
  }
}
function setup() {
  const before = {
    document: globalThis.document,
    window: globalThis.window,
    innerWidth: globalThis.innerWidth,
    innerHeight: globalThis.innerHeight,
  };
  const nodes = new Map();
  const doc = new EventTarget();
  doc.body = new Element();
  doc.querySelector = (selector) => {
    if (!nodes.has(selector)) nodes.set(selector, new Element());
    return nodes.get(selector);
  };
  const buttons = ['KeyR', 'ControlLeft', 'KeyQ', 'KeyE', 'Space'].map((key) => {
    const button = new Element();
    button.dataset.touchKey = key;
    return button;
  });
  const root = doc.querySelector('#mobile-controls');
  root.querySelectorAll = (selector) =>
    selector === '[data-touch-key]'
      ? buttons
      : buttons.filter((b) => b.classes.has('held'));
  globalThis.document = doc;
  globalThis.window = new EventTarget();
  globalThis.innerWidth = 390;
  globalThis.innerHeight = 844;
  const game = {
    flying: true,
    touchMode: true,
    cinematic: false,
    canvas: new Element(),
    settings: defaults,
    audio: { start() {} },
    ui: { panelOpen: false, updateLock() {} },
    cameraRig: { mode: 'third', distance: 11 },
    autopilot: {
      active: true,
      cancel() {
        this.active = false;
      },
    },
    action() {},
    pause() {
      this.flying = false;
    },
  };
  game.controls = new Controls(game);
  const mobile = new MobileControls(game);
  const event = (element, type, id, x = 0, y = 0) => {
    const e = new Event(type, { cancelable: true });
    Object.defineProperties(e, {
      pointerId: { value: id },
      clientX: { value: x },
      clientY: { value: y },
    });
    element.dispatchEvent(e);
  };
  return {
    game,
    mobile,
    nodes,
    buttons,
    event,
    restore() {
      Object.assign(globalThis, before);
    },
  };
}

test('mobile controls detect phones and tablets without activating on desktop or touch laptops', () => {
  assert.equal(
    isMobileDevice({ userAgent: 'Mozilla Android Mobile', maxTouchPoints: 5 }),
    true,
  );
  assert.equal(isMobileDevice({ userAgent: 'iPhone', maxTouchPoints: 5 }), true);
  assert.equal(
    isMobileDevice({
      userAgent: 'Macintosh Safari',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    }),
    true,
  );
  assert.equal(
    isMobileDevice({
      userAgent: 'Windows NT Chrome',
      platform: 'Win32',
      maxTouchPoints: 10,
    }),
    false,
  );
  assert.equal(
    isMobileDevice({ userAgent: 'Macintosh', platform: 'MacIntel', maxTouchPoints: 0 }),
    false,
  );
  assert.equal(isMobileDevice({ userAgent: 'Linux Chrome', maxTouchPoints: 0 }), false);
});

test('joystick dead zone prevents creep and proportional thrust stays below full thrust', () => {
  assert.deepEqual(
    { ...stickAxes(2, 2, 50), knobX: 0, knobY: 0 },
    { x: 0, z: 0, knobX: 0, knobY: 0 },
  );
  const low = new Spaceship(new T.Scene()),
    high = new Spaceship(new T.Scene());
  const f = setup();
  try {
    for (let i = 0; i < 60; i++) {
      f.game.controls.touchAxes.z = -0.35;
      low.update(1 / 60, f.game.controls, defaults);
      f.game.controls.touchAxes.z = -1;
      high.update(1 / 60, f.game.controls, defaults);
    }
    assert.ok(low.velocity.length() > 10);
    assert.ok(low.velocity.length() < high.velocity.length() * 0.5);
  } finally {
    f.restore();
  }
});

test('simultaneous joystick and steering contacts drive actual flight and take over autopilot', () => {
  const f = setup();
  try {
    const stick = f.nodes.get('#touch-stick'),
      surface = f.nodes.get('#touch-steering');
    f.event(stick, 'pointerdown', 1, 66, 66);
    f.event(stick, 'pointermove', 1, 66, 18);
    f.event(surface, 'pointerdown', 2, 200, 200);
    f.event(surface, 'pointermove', 2, 230, 180);
    assert.equal(f.game.autopilot.active, false);
    assert.ok(f.game.controls.axis('KeyS', 'KeyW') < -0.9);
    const ship = new Spaceship(new T.Scene());
    ship.update(1 / 60, f.game.controls, defaults);
    assert.ok(ship.velocity.length() > 0);
    assert.ok(Math.abs(ship.quaternion.y) > 0.01);
    f.event(stick, 'pointerup', 1);
    assert.equal(f.game.controls.axis('KeyS', 'KeyW'), 0);
    f.event(surface, 'pointercancel', 2);
    assert.equal(f.mobile.lookPointers.size, 0);
  } finally {
    f.restore();
  }
});

test('cancelled contacts, menu opening, and rotation clear held controls and boost', () => {
  const f = setup();
  try {
    const brake = f.buttons.find((b) => b.dataset.touchKey === 'Space');
    f.event(brake, 'pointerdown', 1);
    assert.equal(f.game.controls.has('Space'), true);
    f.event(brake, 'pointercancel', 1);
    assert.equal(f.game.controls.has('Space'), false);
    f.nodes.get('#touch-boost').dispatchEvent(new Event('click'));
    assert.equal(f.game.controls.has('ShiftLeft'), true);
    f.event(f.nodes.get('#touch-stick'), 'pointerdown', 2, 66, 18);
    window.dispatchEvent(new Event('resize'));
    assert.equal(f.game.controls.has('ShiftLeft'), false);
    assert.equal(f.game.controls.axis('KeyS', 'KeyW'), 0);
    f.game.flying = false;
    f.game.ui.panelOpen = true;
    f.game.controls.clear();
    f.mobile.syncVisibility();
    assert.equal(f.mobile.root.classList.contains('hidden'), true);
    f.event(brake, 'pointerdown', 3);
    assert.equal(f.game.controls.has('Space'), false);
  } finally {
    f.restore();
  }
});

test('pinch zoom adjusts camera distance without adding an accidental steering jump', () => {
  const f = setup();
  try {
    const surface = f.nodes.get('#touch-steering');
    f.event(surface, 'pointerdown', 1, 150, 100);
    f.event(surface, 'pointerdown', 2, 250, 100);
    f.event(surface, 'pointermove', 2, 300, 100);
    assert.ok(f.game.cameraRig.distance < 11);
    assert.deepEqual(f.game.controls.consumeMouse(), { x: 0, y: 0 });
    f.event(surface, 'pointerup', 2);
    f.event(surface, 'pointermove', 1, 151, 100);
    assert.ok(f.game.controls.consumeMouse().x < 4);
  } finally {
    f.restore();
  }
});

test('cinematic touch mode retains controls and an accessible Show HUD action', () => {
  const f = setup();
  try {
    f.game.cinematic = true;
    f.mobile.syncVisibility();
    assert.equal(f.mobile.root.classList.contains('hidden'), false);
    assert.equal(f.nodes.get('#touch-cinematic').textContent, 'Show HUD');
    f.event(f.nodes.get('#touch-stick'), 'pointerdown', 1, 66, 18);
    assert.ok(f.game.controls.axis('KeyS', 'KeyW') < 0);
  } finally {
    f.restore();
  }
});
