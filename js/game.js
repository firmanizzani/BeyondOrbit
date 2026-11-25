import * as T from '../vendor/three.module.js';
import { Universe } from './universe.js';
import { Spaceship } from './spaceship.js';
import { Controls } from './controls.js';
import { CameraRig } from './camera.js';
import { Storage } from './storage.js';
import { Autopilot } from './autopilot.js';
import { Scanner } from './scanner.js';
import { Navigation } from './navigation.js';
import { WarpDrive } from './warp.js';
import { AudioSystem } from './audio.js';
import { UI } from './ui.js';
import { SpaceRenderer } from './rendering.js';
export class Game {
  constructor(systems, planetData) {
    this.systems = systems;
    this.planetData = planetData;
    this.canvas = document.querySelector('#universe');
    this.state = 'loading';
    this.started = false;
    this.cinematic = false;
    this.storage = new Storage(systems, planetData);
    this.settings = { ...this.storage.settings };
    this.discovered = new Set(this.storage.saved?.discovered || []);
    this.playtime = this.storage.saved?.playtime || 0;
    this.autosave = 0;
    this.frameTime = 0;
    this.performanceTime = 0;
    this.performanceFrames = 0;
    this.adaptiveScale = 1;
    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    this.renderer.toneMapping = T.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    this.renderer.outputColorSpace = T.SRGBColorSpace;
    this.spaceRenderer = new SpaceRenderer(this.renderer);
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 14000);
    this.universe = new Universe(this.scene, planetData);
    this.ship = new Spaceship(this.scene);
    this.cameraRig = new CameraRig(this.camera, this.ship);
    this.audio = new AudioSystem();
    this.controls = new Controls(this);
    this.autopilot = new Autopilot(this);
    this.scanner = new Scanner(this);
    this.navigation = new Navigation(this);
    this.warp = new WarpDrive(this);
    this.ui = new UI(this);
    this.clock = new T.Clock();
    window.addEventListener('resize', () => {
      this.renderer.setSize(innerWidth, innerHeight);
      this.camera.aspect = innerWidth / innerHeight;
      this.camera.updateProjectionMatrix();
    });
    window.addEventListener('pagehide', () => {
      if (this.started) this.save();
    });
  }
  get flying() {
    return this.state === 'playing' || this.state === 'scanning';
  }
  async init() {
    await this.loadSystem(this.systems[0], true);
    this.state = 'menu';
    this.ui.menu();
    this.applySettings();
    document.querySelector('#loading').classList.add('hidden');
    this.loop();
    if (this.storage.corrupt)
      this.ui.toast('Saved data could not be read. You can start a new journey safely.');
  }
  async loadSystem(system, menu = false) {
    this.system = system;
    document.querySelector('#loading-destination').textContent = system.name;
    await this.universe.load(
      system,
      this.settings,
      (p) => {
        document.querySelector('#loading-progress').value = p;
      },
      menu,
    );
    this.target = this.universe.find(
      system.id === 'solar' ? 'earth' : this.universe.planets[0].data.id,
    );
    const offset = menu ? new T.Vector3(-72, 28, 120) : new T.Vector3(-38, 14, 104);
    this.ship.position.copy(this.target.position).add(offset);
    this.ship.velocity.set(0, 0, 0);
    const mat = new T.Matrix4().lookAt(
      this.ship.position,
      this.target.position,
      new T.Vector3(0, 1, 0),
    );
    this.ship.quaternion.setFromRotationMatrix(mat);
    this.ship.collide(this.universe.obstacles);
    this.navigation.rebuild();
    this.cameraRig.initial = true;
  }
  async start(continued = false) {
    this.audio.start(this.settings);
    this.ui.hidePanel();
    this.state = 'loading';
    this.controls.unlock();
    document.querySelector('#menu').classList.add('hidden');
    document.querySelector('#loading').classList.remove('hidden');
    document.querySelector('#loading-caption').textContent = continued
      ? 'Restoring your journey'
      : 'Charting your first horizon';
    const saved = continued ? this.storage.saved : null;
    if (!saved) {
      this.discovered.clear();
      this.playtime = 0;
      this.storage.reset();
    }
    this.cinematic = false;
    await this.loadSystem(this.systems.find((s) => s.id === (saved?.system || 'solar')));
    if (saved) {
      this.ship.position.fromArray(saved.position);
      this.ship.quaternion.fromArray(saved.rotation);
      this.ship.collide(this.universe.obstacles);
      this.discovered = new Set(saved.discovered);
      this.playtime = saved.playtime;
      this.target = this.universe.find(saved.target) || null;
    }
    this.cameraRig.setMode(saved?.camera || this.settings.camera);
    this.started = true;
    this.state = 'playing';
    this.clock.getDelta();
    this.cameraRig.update(0);
    document.querySelector('#loading').classList.add('hidden');
    this.ui.syncVisibility();
    this.save();
    if (!saved) this.ui.help();
    else this.ui.toast('Journey restored · Click space to steer');
  }
  reset() {
    this.storage.reset();
    this.discovered.clear();
    this.playtime = 0;
    this.started = false;
    this.cinematic = false;
    this.autopilot.cancel();
    this.scanner.cancel();
    this.state = 'menu';
    this.cameraRig.setMode('third');
    this.ui.menu();
  }
  save() {
    // The menu camera animates the ship; never replace a flight save with that pose.
    if (['menu', 'loading', 'warping'].includes(this.state)) return;
    this.storage.save(this);
    if (!this.storage.available && !this.storageWarned) {
      this.storageWarned = true;
      this.ui.toast(
        'Browser storage unavailable. Progress will last for this session only.',
      );
    }
  }
  applySettings() {
    this.renderer.setPixelRatio(
      Math.min(
        devicePixelRatio,
        { low: 0.8, medium: 1.2, high: 1.7 }[this.settings.quality],
      ) * this.adaptiveScale,
    );
    this.camera.far = this.settings.renderDistance;
    this.camera.updateProjectionMatrix();
    this.universe.applySettings(this.settings);
    this.audio.apply(this.settings);
    this.storage.saveSettings(this.settings);
    if (this.started && this.state !== 'menu') this.save();
    document.querySelector('#audio-toggle').textContent = this.settings.mute
      ? 'Sound off'
      : 'Sound on';
    this.ui.syncVisibility();
  }
  pause() {
    if (!this.flying) return;
    this.ui.pause();
  }
  action(name) {
    if (name === 'new') {
      const run = () => this.start(false).catch((e) => this.fail(e));
      if (this.storage.saved)
        this.ui.confirm(
          'Start a new journey?',
          'Your current discoveries and flight position will be replaced. Settings will be kept.',
          run,
        );
      else run();
      return;
    }
    if (name === 'continue') {
      if (this.storage.saved) this.start(true).catch((e) => this.fail(e));
      return;
    }
    if (name === 'close' || name === 'resume') {
      this.ui.close();
      return;
    }
    if (name === 'escape') {
      if (this.ui.panelOpen) this.ui.close();
      else if (this.flying) this.pause();
      return;
    }
    if (name === 'settings') {
      if (this.state !== 'warping' && this.state !== 'loading') this.ui.settings();
      return;
    }
    if (name === 'help') {
      if (this.state !== 'warping' && this.state !== 'loading') this.ui.help();
      return;
    }
    if (name === 'journal') {
      if (this.state !== 'loading' && this.state !== 'warping') {
        if (this.ui.kind === 'journal') this.ui.close();
        else this.ui.journal();
      }
      return;
    }
    if (name === 'mainmenu') {
      this.save();
      this.autopilot.cancel();
      this.scanner.cancel();
      this.state = 'menu';
      this.controls.unlock();
      this.ui.menu();
      return;
    }
    if (name === 'map' && (this.flying || this.ui.kind === 'map')) {
      if (this.ui.kind === 'map') this.ui.close();
      else this.ui.map();
      return;
    }
    if (!this.flying) return;
    switch (name) {
      case 'pause':
        this.pause();
        break;
      case 'lock':
        this.controls.lock();
        break;
      case 'scan':
        this.scanner.start();
        break;
      case 'autopilot':
        this.autopilot.toggle();
        break;
      case 'camera':
        this.cameraRig.setMode(this.cameraRig.mode === 'first' ? 'third' : 'first');
        this.save();
        break;
      case 'cinematic':
        this.cinematic = !this.cinematic;
        this.ui.syncVisibility();
        break;
    }
  }
  menuCamera(dt) {
    const earth = this.universe.find('earth') || this.universe.planets[0];
    this.menuTime = (this.menuTime || 0) + dt;
    const p = earth.position;
    this.camera.position
      .copy(p)
      .add(new T.Vector3(-73 + Math.sin(this.menuTime * 0.04) * 5, 26, 110));
    this.camera.lookAt(p.clone().add(new T.Vector3(-43, 4, -4)));
    this.ship.visual.visible = true;
    this.ship.position.copy(p).add(new T.Vector3(-45, -26, 86));
    this.ship.quaternion.setFromEuler(new T.Euler(0.12, -0.8, -0.12));
  }
  loop = () => {
    requestAnimationFrame(this.loop);
    const raw = this.clock.getDelta(),
      dt = Math.min(raw, 0.05);
    if (this.flying) {
      this.playtime += dt;
      this.universe.update(dt);
      this.autopilot.update(dt);
      this.ship.update(dt, this.controls, this.settings, this.autopilot.active);
      const hit = this.ship.collide(this.universe.obstacles);
      if (hit && this.autopilot.active)
        this.autopilot.cancel('Safety stop · Obstacle clearance');
      this.scanner.update(dt);
      this.cameraRig.update(dt);
      this.navigation.update(dt);
      this.autosave += dt;
      if (this.autosave > 15) {
        this.autosave = 0;
        this.save();
      }
    } else if (this.state === 'menu') {
      this.universe.update(dt);
      this.menuCamera(dt);
    }
    if (this.state === 'warping') this.warp.update(dt);
    this.universe.followBackground(this.camera.position);
    this.audio.update(
      this.ship.velocity.length(),
      this.controls.has('ShiftLeft') || this.controls.has('ShiftRight'),
      this.flying,
      !!this.scanner.planet,
    );
    this.spaceRenderer.render(this.scene, this.camera, this.settings.bloom);
    if (this.flying) {
      this.performanceTime += raw;
      this.performanceFrames++;
      if (this.performanceTime > 5) {
        const fps = this.performanceFrames / this.performanceTime;
        if (fps < 28 && this.adaptiveScale > 0.65) {
          this.adaptiveScale = Math.max(0.65, this.adaptiveScale - 0.15);
          this.renderer.setPixelRatio(
            Math.min(
              devicePixelRatio,
              { low: 0.8, medium: 1.2, high: 1.7 }[this.settings.quality],
            ) * this.adaptiveScale,
          );
        }
        this.fps = Math.round(fps);
        this.performanceTime = 0;
        this.performanceFrames = 0;
      }
    }
  };
  fail(error) {
    console.error(error);
    document.querySelector('#loading').classList.add('hidden');
    const el = document.createElement('div');
    el.className = 'fatal';
    el.innerHTML = `
      <h2>Unable to initialize the universe</h2>
      <p>
        Beyond Orbit needs a browser with WebGL 2 and hardware acceleration.
        Run this folder through a local static server, then reload.
        Check the browser console for details.
      </p>
      <button onclick="location.reload()">Try again</button>
    `;
    document.body.append(el);
  }
}
