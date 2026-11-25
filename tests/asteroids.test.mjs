import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as T from '../vendor/three.module.js';
import { AsteroidBelt } from '../js/asteroids.js';
import { Planet } from '../js/planet.js';
const systems = JSON.parse(
  await readFile(new URL('../data/systems.json', import.meta.url)),
);
const data = JSON.parse(await readFile(new URL('../data/planets.json', import.meta.url)));

test('asteroid belts contain mostly small rocks, four shapes, and a three-dimensional spread', () => {
  for (const system of systems) {
    const planets = data
      .filter((p) => p.system === system.id)
      .map((p) => new Planet(p, null));
    const belt = new AsteroidBelt(system, planets);
    assert.equal(belt.records.length, 600);
    assert.equal(new Set(belt.meshes.map((m) => m.geometry)).size, 4);
    const small = belt.records.filter((r) => r.visualRadius < 1.55).length;
    const large = belt.records.filter((r) => r.visualRadius > 2.4).length;
    assert.ok(small / 600 > 0.6, `${system.id}: ${small} small rocks`);
    assert.ok(large / 600 < 0.1);
    const heights = belt.records.map((r) => r.position.y);
    assert.ok(Math.max(...heights) - Math.min(...heights) > 45);
    for (const rock of belt.records) {
      assert.ok(rock.visualRadius > 0 && rock.visualRadius < 4);
      for (const planet of planets) {
        assert.ok(rock.position.distanceTo(planet.position) >= planet.data.radius + 75);
      }
    }
  }
});

test('asteroid collision spheres enclose the actual transformed geometry', () => {
  const belt = new AsteroidBelt(systems[0], []);
  const matrix = new T.Matrix4();
  const point = new T.Vector3();
  for (const record of belt.records) {
    const mesh = belt.meshes[record.variant];
    mesh.getMatrixAt(record.slot, matrix);
    const positions = mesh.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      point.fromBufferAttribute(positions, i).applyMatrix4(matrix);
      assert.ok(point.distanceTo(record.position) <= record.visualRadius + 0.0001);
    }
    assert.equal(record.radius, record.visualRadius + 1.5);
  }
});

test('asteroid quality changes keep rendered instances and active collisions synchronized', () => {
  const belt = new AsteroidBelt(systems[0], []);
  for (const [quality, count] of [
    ['low', 160],
    ['medium', 360],
    ['high', 600],
  ]) {
    belt.setQuality(quality);
    assert.equal(
      belt.meshes.reduce((sum, m) => sum + m.count, 0),
      count,
    );
    assert.equal(belt.obstacles.length, count);
  }
  const repeated = new AsteroidBelt(systems[0], []);
  assert.deepEqual(
    belt.records.map((r) => r.position.toArray()),
    repeated.records.map((r) => r.position.toArray()),
  );
});
