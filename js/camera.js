import * as T from '../vendor/three.module.js';
export class CameraRig {
  constructor(camera, ship) {
    this.camera = camera;
    this.ship = ship;
    this.mode = 'third';
    this.distance = 11;
    this.initial = true;
    window.addEventListener(
      'wheel',
      (e) => {
        if (document.pointerLockElement)
          this.distance = T.MathUtils.clamp(this.distance + e.deltaY * 0.01, 6, 24);
      },
      { passive: true },
    );
  }
  setMode(mode) {
    this.mode = mode;
    document.querySelector('#cockpit').classList.toggle('hidden', mode !== 'first');
    this.ship.visual.visible = mode !== 'first';
    this.initial = true;
  }
  update(dt) {
    const first = this.mode === 'first';
    // Keep the wingspan visible in narrow desktop preview panes.
    const followDistance = this.distance * Math.max(1, 1.45 / this.camera.aspect);
    const offset = new T.Vector3(
      0,
      first ? 0.65 : 3,
      first ? -1.4 : followDistance,
    ).applyQuaternion(this.ship.quaternion);
    const desired = this.ship.position.clone().add(offset);
    const t = this.initial ? 1 : 1 - Math.exp(-dt * (first ? 18 : 6));
    this.camera.position.lerp(desired, t);
    this.camera.quaternion.slerp(this.ship.quaternion, t);
    this.initial = false;
  }
}
