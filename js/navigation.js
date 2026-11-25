import * as T from '../vendor/three.module.js';
export function surfaceDistance(ship, planet) {
  return Math.max(0, ship.position.distanceTo(planet.position) - planet.data.radius);
}
export class Navigation {
  constructor(game) {
    this.game = game;
    this.labels = [];
    this.timer = 0;
  }
  rebuild() {
    document.querySelector('#labels').replaceChildren();
    this.labels = this.game.universe.planets.map((p) => {
      const el = document.createElement('span');
      el.className = 'planet-label';
      el.textContent = p.data.name;
      document.querySelector('#labels').append(el);
      return { planet: p, el };
    });
  }
  update(dt) {
    const g = this.game;
    if (!g.flying) return;
    this.timer += dt;
    const w = innerWidth,
      h = innerHeight;
    for (const { planet, el } of this.labels) {
      const v = planet.position
        .clone()
        .add(new T.Vector3(0, planet.data.radius * 1.2, 0))
        .project(g.camera);
      const dist = g.ship.position.distanceTo(planet.position);
      const show =
        g.settings.labels &&
        !g.cinematic &&
        v.z < 1 &&
        v.z > -1 &&
        Math.abs(v.x) < 0.95 &&
        Math.abs(v.y) < 0.9 &&
        dist < 2100;
      el.style.display = show ? 'block' : 'none';
      if (show) {
        el.style.left = `${(v.x * 0.5 + 0.5) * w}px`;
        el.style.top = `${(-v.y * 0.5 + 0.5) * h}px`;
      }
    }
    const indicator = document.querySelector('#target-indicator');
    if (g.target && !g.cinematic) {
      const pos = g.target.position.clone().project(g.camera),
        behind = pos.z > 1;
      let x = pos.x,
        y = pos.y;
      if (behind) {
        x = -x;
        y = -y;
      }
      const outside = behind || Math.abs(x) > 0.8 || Math.abs(y) > 0.75;
      indicator.classList.remove('hidden');
      if (outside) {
        const scale = Math.min(
          0.86 / Math.max(Math.abs(x), 0.001),
          0.76 / Math.max(Math.abs(y), 0.001),
        );
        x *= scale;
        y *= scale;
      }
      indicator.style.left = `${(x * 0.5 + 0.5) * w}px`;
      indicator.style.top = `${(-y * 0.5 + 0.5) * h}px`;
      document.querySelector('#indicator-name').textContent =
        (outside ? '› ' : '') + g.target.data.name;
    } else indicator.classList.add('hidden');
    if (this.timer < 0.1) return;
    this.timer = 0;
    const near = g.universe.nearest(g.ship.position),
      ready = g.scanner.nearby(),
      speed = g.ship.velocity.length();
    const set = (id, v) => (document.getElementById(id).textContent = v);
    set('current-system', g.system.name);
    set('nearby', near ? `Nearest · ${near.data.name}` : 'Deep space');
    set('target-name', g.target?.data.name || 'No destination');
    set(
      'target-distance',
      g.target ? Math.round(surfaceDistance(g.ship, g.target)).toLocaleString() : '—',
    );
    set('velocity', Math.round(speed));
    document.querySelector('#speed-fill').style.width = `${(speed / 260) * 100}%`;
    set(
      'thrust-status',
      g.controls.has('Space')
        ? 'BRAKING'
        : g.controls.has('ShiftLeft')
          ? 'BOOST ENGAGED'
          : 'FLIGHT ASSIST ON',
    );
    set('scanner-status', g.scanner.planet ? 'Scanning' : ready ? 'Ready' : 'Standby');
    set('autopilot-status', g.autopilot.active ? 'Engaged · P' : 'Offline · P');
    set(
      'camera-status',
      g.cameraRig.mode === 'first' ? 'Cockpit · C' : 'Third person · C',
    );
    set(
      'scan-text',
      g.scanner.planet
        ? `Scanning ${g.scanner.planet.data.name} · ${Math.floor((g.scanner.elapsed / g.scanner.duration) * 100)}%`
        : ready
          ? `${ready.data.name} · Scanner ready`
          : '',
    );
    const button = document.querySelector('#scan-button');
    button.classList.toggle('hidden', !ready || !!g.scanner.planet);
    const progress = document.querySelector('#scan-progress');
    progress.classList.toggle('hidden', !g.scanner.planet);
    progress.value = g.scanner.elapsed / g.scanner.duration;
    const forward = g.ship.forward();
    set(
      'heading',
      `${String(Math.round(((Math.atan2(-forward.x, -forward.z) * 180) / Math.PI + 360) % 360)).padStart(3, '0')}°`,
    );
  }
}
