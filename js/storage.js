export const SAVE_KEY = 'beyond-orbit.save.v1';
export const SETTINGS_KEY = 'beyond-orbit.settings.v1';
export const defaults = {
  quality: 'high',
  renderDistance: 7000,
  bloom: true,
  particles: 'high',
  orbits: false,
  labels: true,
  master: 0.55,
  music: 0.4,
  effects: 0.55,
  mute: false,
  sensitivity: 1,
  camera: 'third',
  invertY: false,
};
const finiteArray = (a, n) =>
  Array.isArray(a) &&
  a.length === n &&
  a.every((v) => Number.isFinite(v) && Math.abs(v) < 1e7);
export function validateSettings(value) {
  const s = { ...defaults };
  if (!value || typeof value !== 'object') return s;
  for (const k of ['bloom', 'orbits', 'labels', 'mute', 'invertY'])
    if (typeof value[k] === 'boolean') s[k] = value[k];
  for (const k of ['quality', 'particles'])
    if (['low', 'medium', 'high'].includes(value[k])) s[k] = value[k];
  if (['first', 'third'].includes(value.camera)) s.camera = value.camera;
  for (const [k, min, max] of [
    ['renderDistance', 2500, 14000],
    ['master', 0, 1],
    ['music', 0, 1],
    ['effects', 0, 1],
    ['sensitivity', 0.2, 2.5],
  ])
    if (Number.isFinite(value[k])) s[k] = Math.min(max, Math.max(min, value[k]));
  return s;
}
export function validateSave(v, systems, planets) {
  if (
    !v ||
    v.version !== 1 ||
    !systems.some((s) => s.id === v.system) ||
    !finiteArray(v.position, 3) ||
    !finiteArray(v.rotation, 4) ||
    !Array.isArray(v.discovered) ||
    !Number.isFinite(v.playtime) ||
    v.playtime < 0
  )
    return null;
  const norm = Math.hypot(...v.rotation);
  if (norm < 0.9 || norm > 1.1) return null;
  return {
    ...v,
    rotation: v.rotation.map((x) => x / norm),
    discovered: [
      ...new Set(v.discovered.filter((id) => planets.some((p) => p.id === id))),
    ],
    target: planets.some((p) => p.id === v.target && p.system === v.system)
      ? v.target
      : null,
    camera: ['first', 'third'].includes(v.camera) ? v.camera : 'third',
    settings: validateSettings(v.settings),
  };
}
export class Storage {
  constructor(systems, planets) {
    this.systems = systems;
    this.planets = planets;
    this.available = true;
    this.corrupt = false;
    this.settings = validateSettings(this.read(SETTINGS_KEY));
    const raw = this.read(SAVE_KEY);
    this.saved = validateSave(raw, systems, planets);
    this.corrupt = !!raw && !this.saved;
  }
  read(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
      this.corrupt = true;
      return null;
    }
  }
  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      this.available = false;
      return false;
    }
  }
  save(game) {
    if (!game.started) return;
    const s = {
      version: 1,
      system: game.system.id,
      position: game.ship.position.toArray(),
      rotation: game.ship.quaternion.toArray(),
      discovered: [...game.discovered],
      target: game.target?.data.id || null,
      camera: game.cameraRig.mode,
      settings: { ...game.settings },
      playtime: game.playtime,
      lastSaved: new Date().toISOString(),
    };
    if (this.write(SAVE_KEY, s)) this.saved = s;
  }
  saveSettings(s) {
    this.settings = { ...s };
    this.write(SETTINGS_KEY, s);
  }
  reset() {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      this.available = false;
    }
    this.saved = null;
  }
}
