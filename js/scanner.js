export class Scanner {
  constructor(game) {
    this.game = game;
    this.planet = null;
    this.elapsed = 0;
    this.duration = 3.5;
  }
  nearby() {
    const g = this.game;
    const p = g.universe.nearest(g.ship.position);
    return p && g.ship.position.distanceTo(p.position) - p.data.radius <= p.data.scanRange
      ? p
      : null;
  }
  start() {
    if (this.planet) return;
    const p = this.nearby();
    if (!p) {
      this.game.ui.toast('Outside scanner range. Approach a planet or engage autopilot.');
      return;
    }
    this.planet = p;
    this.elapsed = 0;
    this.game.state = 'scanning';
    this.game.audio.tone('scan');
    this.game.ui.toast(`Scanning ${p.data.name} · Hold position`);
  }
  cancel(message) {
    this.planet = null;
    this.elapsed = 0;
    if (this.game.state === 'scanning') this.game.state = 'playing';
    if (message) this.game.ui.toast(message);
  }
  update(dt) {
    if (!this.planet) return;
    const p = this.planet,
      g = this.game;
    if (g.ship.position.distanceTo(p.position) - p.data.radius > p.data.scanRange) {
      this.cancel('Scan cancelled · Planet out of range');
      return;
    }
    this.elapsed += dt;
    if (this.elapsed >= this.duration) {
      const isNew = !g.discovered.has(p.data.id);
      g.discovered.add(p.data.id);
      this.cancel();
      g.save();
      g.audio.tone('discovery');
      g.ui.toast(
        isNew ? `Discovery recorded · ${p.data.name}` : `Scan complete · ${p.data.name}`,
      );
      g.ui.details(p.data);
      if (g.discovered.size === g.planetData.length)
        g.ui.toast('Every world discovered. The universe is still yours to explore.');
    }
  }
}
