import * as T from '../vendor/three.module.js';
import { FLIGHT } from './flight.js';
export class Autopilot {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.detour = null;
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
    this.detour = null;
    this.game.ui.toast(`Autopilot engaged · ${this.game.target.data.name}`);
  }
  cancel(message) {
    this.active = false;
    this.detour = null;
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
    const remaining = distance - stop;
    if (remaining < 2) {
      ship.velocity.set(0, 0, 0);
      this.cancel('Destination reached · Scanner ready');
      return;
    }

    // Keep a stable side and route until the obstacle has been passed. Rebuilding
    // a tangent every frame made avoidance oscillate and forced the ship upward.
    let destination = target.position;
    if (this.detour) {
      destination = this.detour.center.clone().add(this.detour.offsets[0]);
      if (ship.position.distanceTo(destination) < 18) {
        this.detour.offsets.shift();
        if (!this.detour.offsets.length) this.detour = null;
        destination = this.detour
          ? this.detour.center.clone().add(this.detour.offsets[0])
          : target.position;
      }
    }
    const route = destination.clone().sub(ship.position);
    const routeLength = route.length();
    const routeDirection = route.normalize();
    let blocker = null;
    let closestAlong = Infinity;
    let obstacleSpeed = FLIGHT.cruiseSpeed;
    for (const o of g.universe.obstacles) {
      if (o.position === target.position) continue;
      const rel = o.position.clone().sub(ship.position),
        along = rel.dot(routeDirection),
        clearance = o.radius + 35;
      const lateral = rel.clone().addScaledVector(routeDirection, -along).length();
      if (along > 0 && lateral < clearance) {
        obstacleSpeed = Math.min(
          obstacleSpeed,
          Math.max(22, (rel.length() - o.radius - 12) * 0.8),
        );
      }
      if (
        !this.detour &&
        along > 0 &&
        along <
          Math.min(routeLength, Math.max(260, ship.velocity.length() * 3) + clearance) &&
        lateral < clearance &&
        along < closestAlong
      ) {
        blocker = o;
        closestAlong = along;
      }
    }
    if (blocker) {
      const rel = ship.position.clone().sub(blocker.position);
      const side = rel.addScaledVector(routeDirection, -rel.dot(routeDirection));
      if (side.lengthSq() < 1) {
        const up = new T.Vector3(0, 1, 0).applyQuaternion(ship.quaternion);
        side.crossVectors(routeDirection, up);
        if (side.lengthSq() < 0.01)
          side.crossVectors(routeDirection, new T.Vector3(1, 0, 0));
      }
      side.normalize();
      const clearance = blocker.radius + 55;
      const lateralOffset = side.multiplyScalar(clearance * 1.7);
      this.detour = {
        name: blocker.name || 'obstacle',
        center: blocker.position,
        offsets: [
          lateralOffset.clone().addScaledVector(routeDirection, -clearance),
          lateralOffset.clone().addScaledVector(routeDirection, clearance),
        ],
      };
      destination = this.detour.center.clone().add(this.detour.offsets[0]);
    }

    const heading = destination.clone().sub(ship.position).normalize();
    // Rotate from the current orientation, preserving roll instead of resetting
    // world-up with lookAt (which can flip at near-vertical headings).
    const rotation = new T.Quaternion().setFromUnitVectors(ship.forward(), heading);
    const orientation = rotation.multiply(ship.quaternion);
    ship.quaternion.rotateTowards(orientation, dt * 1.6);
    const localHeading = heading
      .clone()
      .applyQuaternion(ship.quaternion.clone().invert());
    const bank = T.MathUtils.clamp(-localHeading.x * 0.65, -0.32, 0.32);
    ship.bank = T.MathUtils.damp(ship.bank, bank, 5, dt);
    const alignment = Math.max(0.12, ship.forward().dot(heading));
    const waypointSpeed = this.detour
      ? Math.max(18, ship.position.distanceTo(destination) * 0.8)
      : FLIGHT.cruiseSpeed;
    const speed =
      Math.min(
        FLIGHT.cruiseSpeed,
        obstacleSpeed,
        waypointSpeed,
        Math.max(1, remaining * 0.7),
      ) * alignment;
    const desired = ship.forward().multiplyScalar(speed);
    const change = desired.sub(ship.velocity).clampLength(0, FLIGHT.acceleration * dt);
    ship.velocity.add(change);
  }
}
