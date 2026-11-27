import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../vendor/three.module.js';
import { Spaceship, SPACECRAFT } from '../js/spaceship.js';
import { validateSettings } from '../js/storage.js';

test('spacecraft selection supports old settings and rejects unknown models', () => {
  assert.equal(validateSettings({}).spacecraft, 'explorer');
  assert.equal(validateSettings({ spacecraft: 'unknown' }).spacecraft, 'explorer');
  for (const model of SPACECRAFT) {
    const saved = JSON.parse(JSON.stringify({ spacecraft: model.id }));
    assert.equal(validateSettings(saved).spacecraft, model.id);
  }
});

test('model replacement disposes old resources and preserves flight state', () => {
  const ship = new Spaceship(new T.Scene());
  ship.position.set(10, 20, 30);
  ship.velocity.set(4, 5, 6);
  ship.visual.visible = false;
  let disposed = 0;
  const geometry = ship.visual.children[0].geometry;
  geometry.addEventListener('dispose', () => disposed++);
  ship.setModel('voyager');
  assert.equal(disposed, 1);
  assert.deepEqual(ship.position.toArray(), [10, 20, 30]);
  assert.deepEqual(ship.velocity.toArray(), [4, 5, 6]);
  assert.equal(ship.visual.visible, false);
  assert.equal(ship.engines.length, 2);
  assert.equal(ship.engines[0].position.x, -ship.engineOffset);
  ship.disposeModel();
});

test('all spacecraft retain identical acceleration and braking', () => {
  const input = {
    consumeMouse: () => ({ x: 0, y: 0 }),
    has: (key) => key === 'KeyW',
  };
  const positions = SPACECRAFT.map(({ id }) => {
    const ship = new Spaceship(new T.Scene(), id);
    for (let frame = 0; frame < 120; frame++)
      ship.update(1 / 60, input, validateSettings({}));
    const position = ship.position.toArray();
    for (let frame = 0; frame < 60; frame++)
      ship.update(
        1 / 60,
        { ...input, has: (key) => key === 'Space' },
        validateSettings({}),
      );
    const result = { position, brakingSpeed: ship.velocity.length() };
    ship.disposeModel();
    return result;
  });
  assert.deepEqual(positions[0], positions[1]);
  assert.deepEqual(positions[1], positions[2]);
});
