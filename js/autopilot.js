import * as T from '../vendor/three.module.js';
import { FLIGHT } from './flight.js';
export class Autopilot {
  constructor(game) {
    this.game = game;
    this.active = false;
  }
  toggle() {
    if (this.active) {
      this.cancel();
      return;
    }
    if (!this.game.target) {
      this.game.ui.toast('Choose a planet in the Galaxy Map first.');
      return;
    }
    this.active = true;
    this.game.ui.toast(`Autopilot engaged · ${this.game.target.data.name}`);
  }
  cancel(message) {
    this.active = false;
    if (message) this.game.ui.toast(message);
  }
  update(dt) {
    if (!this.active) return;
    const g = this.game,
      ship = g.ship,
      target = g.target;
    const delta = target.position.clone().sub(ship.position),
      distance = delta.length(),
      stop = target.data.radius + Math.min(target.data.scanRange * 0.56, 95);
    const dir = delta.normalize();
    let heading = dir.clone(),
      blocked = false;
    for (const o of g.universe.obstacles) {
      if (o.position === target.position) continue;
      const rel = o.position.clone().sub(ship.position),
        along = rel.dot(dir),
        clearance = o.radius + 18;
      if (
        along > 0 &&
        along < Math.min(distance, 180) &&
        rel.clone().addScaledVector(dir, -along).length() < clearance
      ) {
        const tangent = new T.Vector3().crossVectors(dir, new T.Vector3(0, 1, 0));
        if (tangent.lengthSq() < 0.1) tangent.set(1, 0, 0);
        heading.addScaledVector(tangent.normalize(), 1.5).normalize();
        heading.y += 0.55;
        blocked = true;
        break;
      }
    }
    const dummy = new T.Object3D();
    dummy.position.copy(ship.position);
    dummy.lookAt(ship.position.clone().sub(heading));
    ship.quaternion.slerp(dummy.quaternion, 1 - Math.exp(-dt * 2.5));
    const remaining = distance - stop;
    if (remaining < 2) {
      ship.velocity.set(0, 0, 0);
      this.cancel('Destination reached · Scanner ready');
      return;
    }
    const speed = Math.min(
      blocked ? 48 : FLIGHT.cruiseSpeed,
      Math.max(1, remaining * 0.7),
    );
    const desired = heading.normalize().multiplyScalar(speed);
    ship.velocity.lerp(desired, 1 - Math.exp(-dt * 2));
  }
}
