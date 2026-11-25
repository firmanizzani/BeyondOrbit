import * as T from '../vendor/three.module.js';
import { Planet, textureFor, atmosphere } from './planet.js';
import { AsteroidBelt } from './asteroids.js';
export function disposeTree(root, retainedTextures = new Set()) {
  const geometries = new Set(),
    materials = new Set(),
    textures = new Set();
  root.traverse((o) => {
    if (o.geometry) geometries.add(o.geometry);
    for (const m of o.material
      ? Array.isArray(o.material)
        ? o.material
        : [o.material]
      : []) {
      materials.add(m);
      for (const v of Object.values(m)) if (v?.isTexture) textures.add(v);
    }
  });
  geometries.forEach((x) => x.dispose());
  materials.forEach((x) => x.dispose());
  textures.forEach((x) => {
    if (!retainedTextures.has(x)) x.dispose();
  });
  root.removeFromParent();
}
export class Universe {
  constructor(scene, planetData) {
    this.scene = scene;
    this.data = planetData;
    this.group = null;
    this.planets = [];
    this.obstacles = [];
    this.nebula = [];
    this.makeBackground();
  }
  makeBackground() {
    const p = [],
      c = [];
    for (let i = 0; i < 6500; i++) {
      const v = new T.Vector3()
        .randomDirection()
        .multiplyScalar(3900 + Math.random() * 800);
      p.push(...v.toArray());
      const color = new T.Color().setHSL(
        0.53 + Math.random() * 0.17,
        0.1 + Math.random() * 0.3,
        0.42 + Math.random() * 0.5,
      );
      c.push(color.r, color.g, color.b);
    }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(p, 3));
    g.setAttribute('color', new T.Float32BufferAttribute(c, 3));
    this.stars = new T.Points(
      g,
      new T.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.85,
      }),
    );
    this.stars.frustumCulled = false;
    this.scene.add(this.stars);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d'),
      gr = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, '#ffffff55');
    gr.addColorStop(0.3, '#ffffff28');
    gr.addColorStop(1, '#ffffff00');
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, 256, 256);
    this.cloudTexture = new T.CanvasTexture(canvas);
    this.background = new T.Group();
    for (let i = 0; i < 18; i++) {
      const m = new T.SpriteMaterial({
        map: this.cloudTexture,
        color: '#345272',
        transparent: true,
        opacity: 0.2,
        blending: T.AdditiveBlending,
        depthWrite: false,
      });
      const s = new T.Sprite(m);
      const a = i * 0.48;
      s.position.set(
        Math.cos(a) * 2300,
        Math.sin(a * 1.7) * 650 - 100,
        Math.sin(a) * 2300,
      );
      s.scale.set(2200, 1000, 1);
      m.rotation = a;
      this.background.add(s);
      this.nebula.push(s);
    }
    this.scene.add(this.background);
  }
  async load(system, settings, onProgress = () => {}, preview = false) {
    if (this.group) disposeTree(this.group, new Set([this.cloudTexture]));
    this.group = new T.Group();
    this.scene.add(this.group);
    this.planets = [];
    this.system = system;
    this.nebula.forEach((s, i) => {
      s.material.color.set(system.nebula[i % 2]);
      s.material.opacity = system.id === 'nebula' ? 0.55 : 0.25;
    });
    this.scene.background = new T.Color('#02050c');
    this.scene.add(this.group);
    const light = new T.PointLight(system.starColor, 150000, 0, 2);
    light.position.set(0, 0, 0);
    this.group.add(
      light,
      new T.AmbientLight(system.starColor, 0.3),
      new T.HemisphereLight('#82abd5', '#050811', 0.45),
    );
    this.sun = new T.Mesh(
      new T.SphereGeometry(49, 48, 32),
      new T.MeshBasicMaterial({ color: system.starColor }),
    );
    this.group.add(this.sun);
    this.corona = atmosphere(57, system.starColor);
    this.group.add(this.corona);
    const glow = new T.Sprite(
      new T.SpriteMaterial({
        map: this.cloudTexture,
        color: system.starColor,
        transparent: true,
        opacity: 0.7,
        blending: T.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.scale.set(700, 700, 1);
    this.group.add(glow);
    const data = this.data.filter(
      (p) => p.system === system.id && (!preview || p.id === 'earth'),
    );
    for (let i = 0; i < data.length; i++) {
      const p = new Planet(data[i], textureFor(data[i]));
      this.group.add(p.group, p.orbit);
      this.planets.push(p);
      onProgress((i + 1) / data.length);
      await new Promise((r) => setTimeout(r, 0));
    }
    this.belt = new AsteroidBelt(system, this.planets);
    this.group.add(this.belt.group);
    this.applySettings(settings);
    this.update(0);
  }
  applySettings(s) {
    if (!this.group) return;
    this.planets.forEach((p) => (p.orbit.visible = s.orbits));
    const count = { low: 1200, medium: 3400, high: 6500 }[s.particles];
    this.stars.geometry.setDrawRange(0, count);
    this.belt.setQuality(s.quality);
    this.corona.visible = s.bloom;
    this.nebula.forEach((x) => (x.visible = s.particles !== 'low'));
  }
  update(dt) {
    this.planets.forEach((p) => p.update(dt));
    this.obstacles = [
      { name: 'star', position: new T.Vector3(), radius: 63 },
      ...this.planets.flatMap((p) => p.obstacles()),
      ...this.belt.obstacles,
    ];
  }
  followBackground(position) {
    this.stars.position.copy(position);
    this.background.position.copy(position);
  }
  find(id) {
    return this.planets.find((p) => p.data.id === id);
  }
  nearest(position) {
    return [...this.planets].sort(
      (a, b) =>
        position.distanceTo(a.position) -
        a.data.radius -
        (position.distanceTo(b.position) - b.data.radius),
    )[0];
  }
}
