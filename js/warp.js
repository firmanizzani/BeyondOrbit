import * as T from '../vendor/three.module.js';

const ease = (value) => {
  const t = T.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

export class WarpDrive {
  constructor(game) {
    this.game = game;
    this.phase = 'idle';
    this.elapsed = 0;
    this.loaded = false;
    this.lengths = [];
    const points = [];
    for (let i = 0; i < 400; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 8 + Math.random() * 80;
      const z = -Math.random() * 700;
      const length = 20 + Math.random() * 55;
      this.lengths.push(length);
      points.push(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
      points.push(Math.cos(angle) * radius, Math.sin(angle) * radius, z - length);
    }
    this.lines = new T.LineSegments(
      new T.BufferGeometry().setAttribute(
        'position',
        new T.Float32BufferAttribute(points, 3),
      ),
      new T.LineBasicMaterial({
        color: '#83dfff',
        transparent: true,
        opacity: 0,
        blending: T.AdditiveBlending,
        depthWrite: false,
      }),
    );
    this.lines.frustumCulled = false;
    this.lines.visible = false;
    game.scene.add(this.lines);
  }

  start(system) {
    const g = this.game;
    if (system.id === g.system.id || this.phase !== 'idle') return;
    g.ui.hidePanel();
    g.scanner.cancel();
    g.autopilot.cancel();
    g.state = 'warping';
    g.controls.unlock();
    g.ship.velocity.set(0, 0, 0);
    this.destination = system;
    this.baseFov = g.camera.fov;
    this.reducedMotion = !!window.matchMedia?.('(prefers-reduced-motion: reduce)')
      .matches;
    this.loaded = false;
    this.enter('charge');
    this.lines.visible = !this.reducedMotion;
    g.ship.visual.visible = false;
    document.querySelector('#warp-name').textContent = system.name;
    document.querySelector('#warp-overlay').classList.remove('hidden');
    document.querySelector('#warp-curtain').classList.remove('hidden');
    for (const id of ['hud', 'labels', 'cockpit'])
      document.querySelector(`#${id}`).classList.add('hidden');
    this.frame(0, 0, 1);
    g.audio.tone('warp');
  }

  enter(phase) {
    this.phase = phase;
    this.elapsed = 0;
  }

  frame(curtain, stretch, textOpacity = 1) {
    const g = this.game;
    document.querySelector('#warp-curtain').style.opacity = String(curtain);
    document.querySelector('#warp-overlay').style.opacity = String(textOpacity);
    if (!this.reducedMotion) {
      g.camera.fov = this.baseFov + stretch * 21;
      g.camera.updateProjectionMatrix();
    }
    this.stretch = stretch;
  }

  beginLoading() {
    const g = this.game;
    this.enter('travel');
    g.universe.hiddenDuringWarp = true;
    g.universe.group.visible = false;
    g.universe.background.visible = false;
    document.querySelector('#warp-caption').textContent =
      'In transit · Charting your destination';
    g.loadSystem(this.destination)
      .then(() => {
        this.loaded = true;
      })
      .catch((error) => {
        this.finish();
        g.fail(error);
      });
  }

  update(dt) {
    if (this.phase === 'idle') return;
    const g = this.game;
    this.elapsed += dt;
    const motionTime = this.reducedMotion ? this.elapsed * 1.8 : this.elapsed;
    switch (this.phase) {
      case 'charge': {
        const t = ease(motionTime / 0.9);
        document.querySelector('#warp-caption').textContent = 'Charging warp drive';
        this.frame(ease((t - 0.3) / 0.7), t * 0.48, ease(motionTime / 0.25));
        if (motionTime >= 0.9) this.beginLoading();
        break;
      }
      case 'travel':
        this.frame(1 - ease(motionTime / 0.4), 0.48 + ease(motionTime / 1.1) * 0.52);
        if (this.loaded && motionTime >= 1.8) this.enter('arrival');
        break;
      case 'arrival': {
        const t = ease(motionTime / 0.4);
        this.frame(t, 1 - t * 0.28);
        document.querySelector('#warp-caption').textContent = 'Leaving hyperspace';
        if (motionTime >= 0.4) {
          // Reposition the camera only while the screen is fully covered.
          g.cameraRig.initial = true;
          g.cameraRig.update(0);
          g.universe.hiddenDuringWarp = false;
          g.universe.group.visible = true;
          g.universe.background.visible = true;
          this.enter('reveal');
        }
        break;
      }
      case 'reveal': {
        const t = ease(motionTime / 1.2);
        this.frame(1 - t, 0.72 * (1 - t), 1 - ease((t - 0.25) / 0.75));
        document.querySelector('#warp-caption').textContent =
          'Arrival confirmed · Restoring flight controls';
        if (motionTime >= 1.2) this.finish();
        break;
      }
    }
    if (this.phase === 'idle') return;
    this.lines.position.copy(g.camera.position);
    this.lines.quaternion.copy(g.camera.quaternion);
    const fading = this.phase === 'reveal' ? 1 - ease(motionTime / 1.2) : 1;
    this.lines.material.opacity = (0.15 + this.stretch * 0.7) * fading;
    const positions = this.lines.geometry.attributes.position;
    for (let i = 0; i < positions.count; i += 2) {
      let z = positions.getZ(i) + dt * (120 + this.stretch * 1200);
      if (z > 2) z = -700;
      positions.setZ(i, z);
      positions.setZ(i + 1, z - this.lengths[i / 2] * (0.15 + this.stretch));
    }
    positions.needsUpdate = true;
  }

  finish() {
    const g = this.game;
    this.phase = 'idle';
    this.lines.visible = false;
    g.camera.fov = this.baseFov;
    g.camera.updateProjectionMatrix();
    g.universe.hiddenDuringWarp = false;
    g.universe.group.visible = true;
    g.universe.background.visible = true;
    g.ship.visual.visible = g.cameraRig.mode !== 'first';
    document.querySelector('#warp-overlay').classList.add('hidden');
    document.querySelector('#warp-curtain').classList.add('hidden');
    g.state = 'playing';
    g.ui.syncVisibility();
    g.save();
    g.audio.tone('ui');
    g.ui.toast(`Welcome to ${g.system.name} · Flight controls restored`);
  }
}
