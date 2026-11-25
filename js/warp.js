import * as T from '../vendor/three.module.js';
export class WarpDrive {
  constructor(game) {
    this.game = game;
    this.elapsed = 0;
    this.destination = null;
    this.phase = 'idle';
    const a = [];
    for (let i = 0; i < 400; i++) {
      const angle = Math.random() * Math.PI * 2,
        r = 8 + Math.random() * 80,
        z = -Math.random() * 700;
      a.push(
        Math.cos(angle) * r,
        Math.sin(angle) * r,
        z,
        Math.cos(angle) * r,
        Math.sin(angle) * r,
        z - 25 - Math.random() * 60,
      );
    }
    this.lines = new T.LineSegments(
      new T.BufferGeometry().setAttribute('position', new T.Float32BufferAttribute(a, 3)),
      new T.LineBasicMaterial({
        color: '#83dfff',
        transparent: true,
        opacity: 0.8,
        blending: T.AdditiveBlending,
      }),
    );
    this.lines.frustumCulled = false;
    this.lines.visible = false;
    game.scene.add(this.lines);
  }
  start(system) {
    const g = this.game;
    if (system.id === g.system.id || g.state === 'warping') return;
    g.ui.hidePanel();
    g.scanner.cancel();
    g.autopilot.cancel();
    g.state = 'warping';
    g.controls.unlock();
    g.ship.velocity.set(0, 0, 0);
    this.destination = system;
    this.elapsed = 0;
    this.phase = 'outbound';
    this.lines.visible = true;
    document.querySelector('#warp-name').textContent = system.name;
    document.querySelector('#warp-overlay').classList.remove('hidden');
    document.querySelector('#hud').classList.add('hidden');
    document.querySelector('#labels').classList.add('hidden');
    g.audio.tone('warp');
  }
  update(dt) {
    if (this.phase === 'idle') return;
    const g = this.game;
    this.elapsed += dt;
    this.lines.position.copy(g.camera.position);
    this.lines.quaternion.copy(g.camera.quaternion);
    const a = this.lines.geometry.attributes.position;
    for (let i = 0; i < a.count; i += 2) {
      const length = a.getZ(i) - a.getZ(i + 1);
      let z = a.getZ(i) + dt * (450 + this.elapsed * 200);
      if (z > 0) z = -700;
      a.setZ(i, z);
      a.setZ(i + 1, z - length);
    }
    a.needsUpdate = true;
    if (this.elapsed > 2 && this.phase === 'outbound') {
      this.phase = 'loading';
      g.loadSystem(this.destination)
        .then(() => {
          this.phase = 'inbound';
          this.elapsed = 0;
        })
        .catch((e) => g.fail(e));
    }
    if (this.elapsed > 1.3 && this.phase === 'inbound') {
      this.phase = 'idle';
      this.lines.visible = false;
      document.querySelector('#warp-overlay').classList.add('hidden');
      g.state = 'playing';
      g.cameraRig.initial = true;
      g.ui.syncVisibility();
      g.save();
      g.ui.toast(`Welcome to ${g.system.name} · Flight controls restored`);
    }
  }
}
