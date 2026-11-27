import * as T from '../vendor/three.module.js';
import { FLIGHT } from './flight.js';
export const SPACECRAFT = [
  {
    id: 'explorer',
    name: 'Explorer',
    description:
      'A balanced silhouette with swept wings and twin engines. Your original companion among the stars.',
  },
  {
    id: 'interceptor',
    name: 'Interceptor',
    description:
      'A slender silver fuselage, sharp delta wings, and violet engine light. Built for a sporting silhouette.',
  },
  {
    id: 'voyager',
    name: 'Voyager',
    description:
      'A broad expedition hull with reinforced nacelles and amber accents. Made to look at home on a long journey.',
  },
];
export class Spaceship {
  constructor(scene, model = 'explorer') {
    this.root = new T.Group();
    this.visual = new T.Group();
    this.root.add(this.visual);
    scene.add(this.root);
    const navigationLight = new T.PointLight('#b8d6f5', 16, 16, 1);
    navigationLight.position.set(0, 3, 4);
    this.root.add(navigationLight);
    this.velocity = new T.Vector3();
    this.bank = 0;
    this.setModel(model);
  }
  disposeModel() {
    const resources = new Set();
    this.visual.traverse((part) => {
      if (part.geometry) resources.add(part.geometry);
      if (part.material) resources.add(part.material);
    });
    resources.forEach((resource) => resource.dispose());
    this.visual.clear();
  }
  setModel(id) {
    this.model = SPACECRAFT.some((model) => model.id === id) ? id : 'explorer';
    this.disposeModel();
    const interceptor = this.model === 'interceptor';
    const voyager = this.model === 'voyager';
    const accent = interceptor ? '#b99aff' : voyager ? '#ffc475' : '#72eaff';
    this.engineOffset = voyager ? 1.85 : interceptor ? 1.05 : 1.45;
    const hull = new T.MeshStandardMaterial({
        color: voyager ? '#d0b99b' : '#b0bac7',
        metalness: 0.72,
        roughness: 0.38,
      }),
      dark = new T.MeshStandardMaterial({
        color: '#182b3c',
        metalness: 0.8,
        roughness: 0.3,
      }),
      trim = new T.MeshStandardMaterial({
        color: '#334d62',
        metalness: 0.7,
        roughness: 0.45,
      }),
      cyan = new T.MeshBasicMaterial({ color: accent });
    const body = new T.Mesh(new T.CapsuleGeometry(0.56, 2.5, 8, 16), hull);
    body.rotation.x = Math.PI / 2;
    body.scale.set(1, 0.95, 0.65);
    if (interceptor) body.scale.set(0.7, 1.3, 0.6);
    if (voyager) body.scale.set(1.6, 1, 0.85);
    this.visual.add(body);
    const cockpit = new T.Mesh(
      new T.SphereGeometry(0.52, 24, 16),
      new T.MeshStandardMaterial({
        color: '#133e59',
        metalness: 0.95,
        roughness: 0.12,
        emissive: '#063047',
        emissiveIntensity: 0.45,
      }),
    );
    cockpit.scale.set(0.7, 0.5, 1.5);
    cockpit.position.set(0, 0.35, -0.55);
    this.visual.add(cockpit);
    const shape = new T.Shape();
    const outline = interceptor
      ? [
          [0.25, -2],
          [0.65, -1.2],
          [2.5, 1.7],
          [1.9, 1.8],
          [0.3, 0.8],
        ]
      : voyager
        ? [
            [0.5, -0.9],
            [2.7, -0.4],
            [3.2, 0.5],
            [3.1, 1.4],
            [0.5, 1.2],
          ]
        : [
            [0.35, -1.2],
            [1.1, -0.35],
            [3.2, 1.5],
            [2.9, 1.9],
            [0.4, 1],
          ];
    shape.moveTo(...outline[0]);
    outline.slice(1).forEach((point) => shape.lineTo(...point));
    shape.closePath();
    const geo = new T.ExtrudeGeometry(shape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelThickness: 0.06,
      bevelSize: 0.08,
      bevelSegments: 2,
      steps: 1,
    });
    geo.rotateX(Math.PI / 2);
    this.engines = [];
    for (const side of [-1, 1]) {
      const wing = new T.Mesh(geo, hull);
      wing.scale.x = side;
      this.visual.add(wing);
      const strut = new T.Mesh(new T.BoxGeometry(0.18, 0.12, 2.2), trim);
      strut.position.set(side * 1.15, 0.02, 0.6);
      strut.rotation.y = side * 0.4;
      this.visual.add(strut);
      const pod = new T.Mesh(new T.CylinderGeometry(0.23, 0.32, 1.65, 16), dark);
      pod.rotation.x = Math.PI / 2;
      pod.position.set(side * this.engineOffset, 0, 1);
      if (voyager) pod.scale.set(1.4, 1.2, 1.4);
      this.visual.add(pod);
      const nozzle = new T.Mesh(new T.TorusGeometry(0.25, 0.07, 8, 20), trim);
      nozzle.position.set(side * this.engineOffset, 0, 1.85);
      this.visual.add(nozzle);
      const engine = new T.Mesh(
        new T.ConeGeometry(0.22, 1.7, 16, 1, true),
        new T.MeshBasicMaterial({
          color: accent,
          transparent: true,
          opacity: 0.8,
          blending: T.AdditiveBlending,
          depthWrite: false,
        }),
      );
      engine.rotation.x = Math.PI / 2;
      engine.position.set(side * this.engineOffset, 0, 2.55);
      this.visual.add(engine);
      this.engines.push(engine);
      const stripe = new T.Mesh(new T.BoxGeometry(0.07, 0.025, 1.4), cyan);
      stripe.position.set(side * this.engineOffset, 0.3, 0.65);
      this.visual.add(stripe);
      const fin = new T.Mesh(new T.BoxGeometry(0.08, 0.85, 0.9), trim);
      fin.position.set(side * 0.7, 0.45, 1.2);
      fin.rotation.z = side * -0.3;
      fin.rotation.x = 0.3;
      this.visual.add(fin);
      if (voyager) {
        const module = new T.Mesh(new T.BoxGeometry(0.65, 0.5, 1.9), trim);
        module.position.set(side * 0.95, 0.2, 0.1);
        this.visual.add(module);
      }
      for (let i = 0; i < 4; i++) {
        const detail = new T.Mesh(new T.BoxGeometry(0.34, 0.035, 0.075), dark);
        detail.position.set(side * 0.7, 0.29, 0.3 + i * 0.2);
        this.visual.add(detail);
      }
    }
    const p = new Float32Array(180 * 3);
    this.exhaust = new T.Points(
      new T.BufferGeometry().setAttribute('position', new T.BufferAttribute(p, 3)),
      new T.PointsMaterial({
        color: accent,
        size: 0.045,
        transparent: true,
        opacity: 0.5,
        blending: T.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.visual.add(this.exhaust);
  }
  get position() {
    return this.root.position;
  }
  get quaternion() {
    return this.root.quaternion;
  }
  forward() {
    return new T.Vector3(0, 0, -1).applyQuaternion(this.quaternion);
  }
  update(dt, input, settings, autopilot = false) {
    if (!autopilot) {
      const { x, y } = input.consumeMouse();
      const yaw = -x * 0.0015 * settings.sensitivity,
        pitch = -y * 0.0015 * settings.sensitivity * (settings.invertY ? -1 : 1);
      const roll = (Number(input.has('KeyQ')) - Number(input.has('KeyE'))) * dt * 1.3;
      this.quaternion
        .multiply(new T.Quaternion().setFromEuler(new T.Euler(pitch, yaw, roll, 'YXZ')))
        .normalize();
      const boost = input.has('ShiftLeft') || input.has('ShiftRight'),
        axis = (positive, negative) =>
          input.axis?.(positive, negative) ??
          Number(input.has(positive)) - Number(input.has(negative)),
        direction = new T.Vector3(
          axis('KeyD', 'KeyA'),
          axis('KeyR', 'ControlLeft') - Number(input.has('ControlRight')),
          axis('KeyS', 'KeyW'),
        );
      // Flight assist removes sideways drift in the ship's current frame while
      // preserving deliberate strafe input and forward acceleration.
      const localVelocity = this.velocity
        .clone()
        .applyQuaternion(this.quaternion.clone().invert());
      const lateralDamping = Math.exp(-FLIGHT.lateralDrag * dt);
      if (Math.abs(direction.x) < 0.08) localVelocity.x *= lateralDamping;
      if (Math.abs(direction.y) < 0.08) localVelocity.y *= lateralDamping;
      this.velocity.copy(localVelocity.applyQuaternion(this.quaternion));
      if (direction.lengthSq() > 1) direction.normalize();
      direction.applyQuaternion(this.quaternion);
      this.velocity.addScaledVector(
        direction,
        dt * (boost ? FLIGHT.boostAcceleration : FLIGHT.acceleration),
      );
      this.velocity.multiplyScalar(
        Math.exp(-dt * (input.has('Space') ? FLIGHT.brakeDrag : FLIGHT.drag)),
      );
      this.velocity.clampLength(0, boost ? FLIGHT.boostSpeed : FLIGHT.cruiseSpeed);
      this.bank = T.MathUtils.lerp(
        this.bank,
        T.MathUtils.clamp(-yaw * 12, -0.4, 0.4),
        0.1,
      );
    }
    this.position.addScaledVector(this.velocity, dt);
    this.visual.rotation.z = this.bank;
    const speed = this.velocity.length();
    for (const e of this.engines) {
      e.scale.y = 0.3 + speed * 0.015 + Math.random() * 0.1;
      e.material.opacity = settings.bloom ? 0.8 : 0.35;
    }
    const p = this.exhaust.geometry.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const age = (performance.now() * 0.0004 + i / 180) % 1;
      p.setXYZ(
        i,
        (i % 2 ? this.engineOffset : -this.engineOffset) + Math.sin(i * 7) * 0.15 * age,
        Math.cos(i * 3) * 0.15 * age,
        1.9 + age * (1 + speed * 0.03),
      );
    }
    p.needsUpdate = true;
    this.exhaust.visible = settings.particles !== 'low' && speed > 1;
  }
  collide(obstacles) {
    let hit = false;
    for (const o of obstacles) {
      const normal = this.position.clone().sub(o.position),
        distance = normal.length();
      if (distance < o.radius + 3) {
        if (distance < 0.001) normal.set(0, 1, 0);
        else normal.divideScalar(distance);
        this.position.copy(o.position).addScaledVector(normal, o.radius + 3);
        const inward = this.velocity.dot(normal);
        if (inward < 0) this.velocity.addScaledVector(normal, -inward);
        hit = true;
      } else if (distance < o.radius + 15) {
        normal.normalize();
        const inward = this.velocity.dot(normal);
        if (inward < 0) this.velocity.addScaledVector(normal, -inward * 0.08);
      }
    }
    return hit;
  }
}
