export class Controls {
  constructor(game) {
    this.game = game;
    this.keys = new Set();
    this.mouse = { x: 0, y: 0 };
    this.locked = false;
    document.addEventListener('keydown', (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.code === 'Tab' && game.flying) return;
      if (
        [
          'Space',
          'ControlLeft',
          'ControlRight',
          'ShiftLeft',
          'ShiftRight',
          'KeyW',
          'KeyS',
          'KeyA',
          'KeyD',
          'KeyQ',
          'KeyE',
          'KeyR',
        ].includes(e.code) &&
        game.flying
      ) {
        e.preventDefault();
        this.keys.add(e.code);
        if (game.autopilot.active) game.autopilot.cancel('Manual control');
      }
      if (e.repeat) return;
      const actions = {
        KeyF: 'scan',
        KeyM: 'map',
        KeyC: 'camera',
        KeyJ: 'journal',
        KeyP: 'autopilot',
        KeyH: 'cinematic',
        Escape: 'escape',
      };
      if (actions[e.code]) {
        e.preventDefault();
        game.action(actions[e.code]);
      }
    });
    document.addEventListener('keyup', (e) => this.keys.delete(e.code));
    document.addEventListener('mousemove', (e) => {
      if (this.locked && game.flying) {
        this.mouse.x += e.movementX;
        this.mouse.y += e.movementY;
        if (Math.abs(e.movementX) + Math.abs(e.movementY) > 4 && game.autopilot.active)
          game.autopilot.cancel('Manual control');
      }
    });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === game.canvas;
      game.ui?.updateLock(this.locked);
      if (!this.locked) {
        this.clear();
        if (game.flying && !game.ui?.panelOpen) game.pause();
      }
    });
    game.canvas.addEventListener('click', () => {
      if (game.flying) this.lock();
    });
    window.addEventListener('blur', () => {
      this.clear();
      if (game.flying) game.pause();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.clear();
        if (game.flying) game.pause();
      }
    });
  }
  has(key) {
    return this.keys.has(key);
  }
  consumeMouse() {
    const m = { ...this.mouse };
    this.mouse.x = 0;
    this.mouse.y = 0;
    return m;
  }
  clear() {
    this.keys.clear();
    this.mouse.x = this.mouse.y = 0;
  }
  lock() {
    try {
      const result = this.game.canvas.requestPointerLock();
      result?.catch?.(() =>
        this.game.ui.toast(
          'Mouse capture unavailable. Use autopilot from the Galaxy Map.',
        ),
      );
    } catch {
      this.game.ui.toast('Click the space view to enable mouse steering.');
    }
  }
  unlock() {
    this.clear();
    if (document.pointerLockElement) document.exitPointerLock();
  }
}
