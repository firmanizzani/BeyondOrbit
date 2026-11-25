import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as T from '../vendor/three.module.js';
import { Spaceship } from '../js/spaceship.js';
import { Planet } from '../js/planet.js';
import { Autopilot } from '../js/autopilot.js';
import { Scanner } from '../js/scanner.js';
import { Storage, SAVE_KEY, validateSave, validateSettings } from '../js/storage.js';
import { journalPlanets, discoveryProgress } from '../js/journal.js';
import { Game } from '../js/game.js';
import { disposeTree } from '../js/universe.js';
import { Controls } from '../js/controls.js';
import { CameraRig } from '../js/camera.js';

const systems = JSON.parse(
  await readFile(new URL('../data/systems.json', import.meta.url)),
);
const planets = JSON.parse(
  await readFile(new URL('../data/planets.json', import.meta.url)),
);
const settings = validateSettings(null);
const input = (keys = []) => ({
  has: (key) => keys.includes(key),
  consumeMouse: () => ({ x: 0, y: 0 }),
});

function scannerFixture() {
  const data = planets.find((p) => p.id === 'earth');
  const planet = { data, position: new T.Vector3(0, 0, 0) };
  const game = {
    ship: { position: new T.Vector3(0, 0, 100) },
    universe: { nearest: () => planet },
    discovered: new Set(),
    planetData: planets,
    state: 'playing',
    ui: { toast() {}, details() {} },
    audio: { tone() {} },
    saveCount: 0,
    save() {
      this.saveCount++;
    },
  };
  game.scanner = new Scanner(game);
  return { game, planet, scanner: game.scanner };
}

test('catalog has 24 unique, fully configured planets in five systems', () => {
  assert.equal(systems.length, 5);
  assert.equal(planets.length, 24);
  assert.equal(new Set(planets.map((p) => p.id)).size, 24);
  assert.deepEqual(
    systems.map((s) => planets.filter((p) => p.system === s.id).length),
    [8, 4, 5, 3, 4],
  );
  for (const planet of planets) {
    for (const key of [
      'id',
      'name',
      'system',
      'type',
      'radius',
      'diameter',
      'temperature',
      'atmosphere',
      'color',
      'texture',
      'rotationSpeed',
      'orbitDistance',
      'orbitSpeed',
      'moons',
      'habitability',
      'description',
      'scanRange',
      'fictional',
    ]) {
      assert.notEqual(planet[key], undefined, `${planet.id}.${key}`);
    }
    assert.equal(planet.fictional, planet.system !== 'solar');
    assert.ok(planet.scanRange > planet.radius);
  }
});

test('ship translates on all three local axes and rolls', () => {
  for (const [key, axis, sign] of [
    ['KeyW', 'z', -1],
    ['KeyS', 'z', 1],
    ['KeyA', 'x', -1],
    ['KeyD', 'x', 1],
    ['KeyR', 'y', 1],
    ['ControlLeft', 'y', -1],
  ]) {
    const ship = new Spaceship(new T.Scene());
    for (let i = 0; i < 60; i++) ship.update(1 / 60, input([key]), settings);
    assert.ok(ship.position[axis] * sign > 10, key);
  }
  const ship = new Spaceship(new T.Scene());
  ship.update(0.05, input(['KeyQ']), settings);
  assert.ok(Math.abs(ship.quaternion.z) > 0.01);
});

test('boost increases speed and brake dissipates inertia', () => {
  const regular = new Spaceship(new T.Scene()),
    boosted = new Spaceship(new T.Scene());
  for (let i = 0; i < 240; i++) {
    regular.update(1 / 60, input(['KeyW']), settings);
    boosted.update(1 / 60, input(['KeyW', 'ShiftLeft']), settings);
  }
  assert.ok(boosted.velocity.length() > regular.velocity.length() * 2);
  assert.ok(boosted.velocity.length() <= 260);
  for (let i = 0; i < 60; i++) boosted.update(1 / 60, input(['Space']), settings);
  assert.ok(boosted.velocity.length() < 1);
});

test('sphere collisions preserve tangential flight and reject inward velocity', () => {
  const ship = new Spaceship(new T.Scene());
  ship.position.set(0, 0, 12);
  ship.velocity.set(5, 0, -40);
  const hit = ship.collide([{ position: new T.Vector3(), radius: 20 }]);
  assert.equal(hit, true);
  assert.ok(ship.position.length() >= 23);
  assert.equal(ship.velocity.z, 0);
  assert.equal(ship.velocity.x, 5);
  ship.position.set(0, 0, 0);
  ship.collide([{ position: new T.Vector3(), radius: 20 }]);
  assert.equal(ship.position.length(), 23);
});

test('scanner completes, persists, and deduplicates discoveries', () => {
  const { game, scanner } = scannerFixture();
  scanner.start();
  scanner.update(2);
  assert.equal(game.discovered.size, 0);
  scanner.update(2);
  assert.deepEqual([...game.discovered], ['earth']);
  assert.equal(game.saveCount, 1);
  scanner.start();
  scanner.update(4);
  assert.equal(game.discovered.size, 1);
  assert.equal(game.saveCount, 2);
});

test('scanner rejects and cancels scans outside surface range', () => {
  const { game, scanner } = scannerFixture();
  game.ship.position.set(0, 0, 2000);
  scanner.start();
  assert.equal(scanner.planet, null);
  game.ship.position.set(0, 0, 100);
  scanner.start();
  scanner.update(1);
  game.ship.position.set(0, 0, 2000);
  scanner.update(4);
  assert.equal(scanner.planet, null);
  assert.equal(game.discovered.size, 0);
  assert.equal(game.state, 'playing');
});

test('autopilot reaches safe scanning range of all 24 moving worlds', () => {
  for (const data of planets) {
    const planet = new Planet(data, null);
    const ship = new Spaceship(new T.Scene());
    ship.position.copy(planet.position).add(new T.Vector3(-230, 70, 500));
    const game = {
      target: planet,
      ship,
      universe: { obstacles: planet.obstacles() },
      ui: { toast() {} },
    };
    const pilot = new Autopilot(game);
    pilot.toggle();
    let collided = false;
    for (let i = 0; i < 12000 && pilot.active; i++) {
      planet.update(1 / 60);
      game.universe.obstacles = planet.obstacles();
      pilot.update(1 / 60);
      ship.update(1 / 60, input(), settings, pilot.active);
      collided ||= ship.collide(game.universe.obstacles);
    }
    const altitude = ship.position.distanceTo(planet.position) - data.radius;
    assert.equal(collided, false, `${data.name} collision`);
    assert.equal(pilot.active, false, `${data.name} failed to arrive`);
    assert.ok(altitude > 8 && altitude <= data.scanRange, `${data.name}: ${altitude}`);
    assert.ok(ship.velocity.length() < 0.1);
  }
});

test('autopilot steers around an intervening sphere', () => {
  const ship = new Spaceship(new T.Scene());
  ship.position.set(0, 0, 600);
  const planet = {
    data: { name: 'Test', radius: 30, scanRange: 140 },
    position: new T.Vector3(),
  };
  const obstacles = [
    { position: planet.position, radius: 37 },
    { position: new T.Vector3(0, 0, 320), radius: 55 },
  ];
  const game = { ship, target: planet, universe: { obstacles }, ui: { toast() {} } };
  const pilot = new Autopilot(game);
  pilot.toggle();
  for (let i = 0; i < 12000 && pilot.active; i++) {
    pilot.update(1 / 60);
    ship.update(1 / 60, input(), settings, pilot.active);
    assert.equal(ship.collide(obstacles), false);
  }
  assert.equal(pilot.active, false);
  assert.ok(ship.position.distanceTo(planet.position) - planet.data.radius <= 140);
});

test('invalid saves are rejected and valid saves sanitize discovery IDs', () => {
  const valid = {
    version: 1,
    system: 'solar',
    position: [410, 14, 104],
    rotation: [0, 0, 0, 1],
    discovered: ['earth', 'earth', 'missing'],
    target: 'nyx',
    playtime: 100,
    settings: {},
  };
  assert.deepEqual(validateSave(valid, systems, planets).discovered, ['earth']);
  assert.equal(validateSave(valid, systems, planets).target, null);
  for (const change of [
    { version: 2 },
    { system: 'missing' },
    { position: [null, 0, 0] },
    { rotation: [0, 0, 0, 0] },
    { playtime: -1 },
    { discovered: null },
  ]) {
    assert.equal(validateSave({ ...valid, ...change }, systems, planets), null);
  }
});

test('settings validate types and clamp unsafe numeric values', () => {
  const result = validateSettings({
    master: 50,
    sensitivity: -2,
    quality: 'ultra',
    mute: 'true',
    camera: 'first',
  });
  assert.equal(result.master, 1);
  assert.equal(result.sensitivity, 0.2);
  assert.equal(result.quality, 'high');
  assert.equal(result.mute, false);
  assert.equal(result.camera, 'first');
});

test('storage round-trips a saved journey and handles broken JSON', () => {
  const memory = new Map();
  globalThis.localStorage = {
    getItem: (k) => memory.get(k) ?? null,
    setItem: (k, v) => memory.set(k, v),
    removeItem: (k) => memory.delete(k),
  };
  const storage = new Storage(systems, planets);
  const ship = new Spaceship(new T.Scene());
  ship.position.set(400, 12, 100);
  storage.save({
    started: true,
    system: systems[0],
    ship,
    discovered: new Set(['earth']),
    target: { data: planets[2] },
    cameraRig: { mode: 'first' },
    settings,
    playtime: 123,
  });
  const restored = new Storage(systems, planets);
  assert.deepEqual(restored.saved.position, [400, 12, 100]);
  assert.equal(restored.saved.camera, 'first');
  assert.equal(restored.saved.playtime, 123);
  memory.set(SAVE_KEY, '{broken');
  const corrupt = new Storage(systems, planets);
  assert.equal(corrupt.saved, null);
  assert.equal(corrupt.corrupt, true);
  globalThis.localStorage = {
    getItem() {
      throw new Error('denied');
    },
    setItem() {
      throw new Error('quota');
    },
  };
  const blocked = new Storage(systems, planets);
  blocked.saveSettings(settings);
  assert.equal(blocked.available, false);
  delete globalThis.localStorage;
});

test('journal filters and progress agree with scanner discoveries', () => {
  const discovered = new Set(['earth', 'mars', 'nyx']);
  assert.equal(journalPlanets(planets, discovered, 'solar', 'discovered').length, 2);
  assert.equal(journalPlanets(planets, discovered, 'nebula', 'unknown').length, 4);
  assert.deepEqual(discoveryProgress(planets, discovered), {
    found: 3,
    total: 24,
    percent: 13,
  });
});

test('menu animation and incomplete system transitions cannot overwrite flight saves', () => {
  let saves = 0;
  const game = {
    state: 'menu',
    storage: {
      available: true,
      save() {
        saves++;
      },
    },
  };
  for (const state of ['menu', 'loading', 'warping']) {
    game.state = state;
    Game.prototype.save.call(game);
  }
  assert.equal(saves, 0);
  game.state = 'playing';
  Game.prototype.save.call(game);
  assert.equal(saves, 1);
});

test('system disposal frees local resources and preserves shared nebula texture', () => {
  const root = new T.Group();
  const shared = new T.Texture();
  const local = new T.Texture();
  const geometry = new T.SphereGeometry(1, 8, 8);
  const material = new T.MeshBasicMaterial({ map: local });
  root.add(new T.Mesh(geometry, material));
  root.add(new T.Sprite(new T.SpriteMaterial({ map: shared })));
  const events = [];
  for (const [object, name] of [
    [shared, 'shared'],
    [local, 'local'],
    [geometry, 'geometry'],
    [material, 'material'],
  ]) {
    object.addEventListener('dispose', () => events.push(name));
  }
  disposeTree(root, new Set([shared]));
  assert.deepEqual(events.sort(), ['geometry', 'local', 'material']);
});

test('real input handling tracks boost, clears focus loss, and accumulates mouse steering', () => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  const doc = new EventTarget();
  const win = new EventTarget();
  globalThis.document = doc;
  globalThis.window = win;
  try {
    const game = {
      flying: true,
      canvas: new EventTarget(),
      ui: { updateLock() {}, panelOpen: false },
      autopilot: { active: false },
      action() {},
      pause() {
        this.flying = false;
      },
    };
    const controls = new Controls(game);
    const key = (type, code) => {
      const event = new Event(type, { cancelable: true });
      Object.defineProperty(event, 'code', { value: code });
      doc.dispatchEvent(event);
    };
    key('keydown', 'ShiftLeft');
    key('keydown', 'KeyW');
    assert.equal(controls.has('ShiftLeft'), true);
    assert.equal(controls.has('KeyW'), true);
    key('keyup', 'ShiftLeft');
    assert.equal(controls.has('ShiftLeft'), false);
    controls.locked = true;
    const mouse = new Event('mousemove');
    Object.defineProperties(mouse, {
      movementX: { value: 12 },
      movementY: { value: -8 },
    });
    doc.dispatchEvent(mouse);
    assert.deepEqual(controls.consumeMouse(), { x: 12, y: -8 });
    assert.deepEqual(controls.consumeMouse(), { x: 0, y: 0 });
    win.dispatchEvent(new Event('blur'));
    assert.equal(controls.keys.size, 0);
    assert.equal(game.flying, false);
    key('keydown', 'KeyW');
    assert.equal(controls.keys.size, 0);
  } finally {
    globalThis.document = previousDocument;
    globalThis.window = previousWindow;
  }
});

test('camera mode restores the ship and narrow views retain its full wingspan', () => {
  const previousDocument = globalThis.document;
  const previousWindow = globalThis.window;
  globalThis.document = { querySelector: () => ({ classList: { toggle() {} } }) };
  globalThis.window = { addEventListener() {} };
  try {
    const ship = new Spaceship(new T.Scene());
    const camera = new T.PerspectiveCamera(55, 16 / 9, 0.1, 7000);
    const rig = new CameraRig(camera, ship);
    rig.setMode('first');
    assert.equal(ship.visual.visible, false);
    rig.setMode('third');
    assert.equal(ship.visual.visible, true);
    rig.update(0);
    const wideDistance = camera.position.distanceTo(ship.position);
    camera.aspect = 0.8;
    rig.initial = true;
    rig.update(0);
    assert.ok(camera.position.distanceTo(ship.position) > wideDistance);
  } finally {
    globalThis.document = previousDocument;
    globalThis.window = previousWindow;
  }
});
