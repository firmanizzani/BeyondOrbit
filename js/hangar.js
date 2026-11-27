import * as T from '../vendor/three.module.js';
import { Spaceship } from './spaceship.js';

export class Hangar {
  constructor(canvas, model) {
    this.canvas = canvas;
    this.renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.scene = new T.Scene();
    this.scene.add(new T.HemisphereLight('#dceaff', '#475369', 3));
    const light = new T.DirectionalLight('#ffffff', 4);
    light.position.set(-3, 5, -4);
    this.scene.add(light);
    this.camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
    this.ship = new Spaceship(this.scene, model);
    this.ship.exhaust.visible = false;
    this.angle = -0.5;
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  setModel(id) {
    this.ship.setModel(id);
    this.ship.exhaust.visible = false;
  }
  render(dt) {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (!width || !height) return;
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      const distance = 12 / Math.min(1, this.camera.aspect);
      this.camera.position.set(0, distance * 0.5, -distance);
      this.camera.lookAt(0, 0, 0);
    }
    if (!this.reducedMotion) this.angle += dt * 0.18;
    this.ship.root.rotation.y = this.angle;
    this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.ship.disposeModel();
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
