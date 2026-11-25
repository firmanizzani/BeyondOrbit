export function isMobileDevice(device = navigator) {
  const appleTablet = device.platform === 'MacIntel' && device.maxTouchPoints > 1;
  return (
    (device.maxTouchPoints || 0) > 0 &&
    (/Android|iPhone|iPad|iPod/i.test(device.userAgent || '') || appleTablet)
  );
}

export function stickAxes(dx, dy, radius) {
  const distance = Math.hypot(dx, dy);
  if (distance < radius * 0.12) return { x: 0, z: 0, knobX: dx, knobY: dy };
  const length = Math.min(distance / radius, 1);
  const strength = (length - 0.12) / 0.88;
  return {
    x: (dx / distance) * strength,
    z: (dy / distance) * strength,
    knobX: (dx / distance) * length * radius,
    knobY: (dy / distance) * length * radius,
  };
}

export class MobileControls {
  constructor(game) {
    this.game = game;
    this.controls = game.controls;
    this.root = document.querySelector('#mobile-controls');
    this.steering = document.querySelector('#touch-steering');
    this.stick = document.querySelector('#touch-stick');
    this.knob = document.querySelector('#touch-knob');
    this.boost = document.querySelector('#touch-boost');
    this.stickPointer = null;
    this.lookPointers = new Map();
    this.holds = new Map();
    this.boosting = false;
    this.controls.onClear = () => this.reset();

    this.stick.addEventListener('pointerdown', (event) => {
      if (!game.flying || this.stickPointer !== null) return;
      event.preventDefault();
      this.arm();
      this.stickPointer = event.pointerId;
      this.capture(this.stick, event.pointerId);
      this.moveStick(event);
    });
    this.stick.addEventListener('pointermove', (event) => {
      if (event.pointerId === this.stickPointer) this.moveStick(event);
    });
    const releaseStick = (event) => {
      if (event.pointerId !== this.stickPointer) return;
      this.stickPointer = null;
      this.controls.touchAxes.x = this.controls.touchAxes.z = 0;
      this.knob.style.transform = 'translate(0px, 0px)';
    };
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'])
      this.stick.addEventListener(type, releaseStick);

    this.steering.addEventListener('pointerdown', (event) => {
      if (!game.flying || this.lookPointers.size >= 2) return;
      event.preventDefault();
      this.arm();
      this.lookPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      this.capture(this.steering, event.pointerId);
      this.pinchSpan = this.span();
    });
    this.steering.addEventListener('pointermove', (event) => this.moveLook(event));
    const releaseLook = (event) => {
      this.lookPointers.delete(event.pointerId);
      this.pinchSpan = this.span();
    };
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'])
      this.steering.addEventListener(type, releaseLook);

    this.root.querySelectorAll('[data-touch-key]').forEach((button) => {
      button.addEventListener('pointerdown', (event) => {
        if (!game.flying) return;
        event.preventDefault();
        this.arm();
        this.takeControl();
        this.capture(button, event.pointerId);
        this.holds.set(event.pointerId, button.dataset.touchKey);
        this.controls.touchKeys.add(button.dataset.touchKey);
        button.classList.add('held');
      });
      const release = (event) => {
        const key = this.holds.get(event.pointerId);
        if (!key) return;
        this.holds.delete(event.pointerId);
        if (![...this.holds.values()].includes(key)) this.controls.touchKeys.delete(key);
        button.classList.remove('held');
      };
      for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'])
        button.addEventListener(type, release);
    });
    this.boost.addEventListener('click', () => {
      if (!game.flying) return;
      this.arm();
      this.takeControl();
      this.boosting = !this.boosting;
      if (this.boosting) this.controls.touchKeys.add('ShiftLeft');
      else this.controls.touchKeys.delete('ShiftLeft');
      this.boost.setAttribute('aria-pressed', String(this.boosting));
    });
    window.addEventListener('resize', () => this.controls.clear());
    this.syncVisibility();
  }

  capture(element, id) {
    try {
      element.setPointerCapture?.(id);
    } catch {
      /* Browser cancelled this contact. */
    }
  }
  arm() {
    this.game.audio.start(this.game.settings);
  }
  takeControl() {
    if (this.game.autopilot.active) this.game.autopilot.cancel('Manual touch control');
  }
  moveStick(event) {
    if (!this.game.flying) return;
    const box = this.stick.getBoundingClientRect();
    const axes = stickAxes(
      event.clientX - box.left - box.width / 2,
      event.clientY - box.top - box.height / 2,
      box.width * 0.36,
    );
    this.controls.touchAxes.x = axes.x;
    this.controls.touchAxes.z = axes.z;
    this.knob.style.transform = `translate(${axes.knobX}px, ${axes.knobY}px)`;
    if (Math.abs(axes.x) + Math.abs(axes.z) > 0) this.takeControl();
  }
  span() {
    const points = [...this.lookPointers.values()];
    return points.length === 2
      ? Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y)
      : null;
  }
  moveLook(event) {
    const previous = this.lookPointers.get(event.pointerId);
    if (!previous || !this.game.flying) return;
    const dx = event.clientX - previous.x,
      dy = event.clientY - previous.y;
    this.lookPointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (this.lookPointers.size === 2) {
      const span = this.span();
      if (this.pinchSpan !== null && this.game.cameraRig.mode === 'third') {
        this.game.cameraRig.distance = Math.max(
          6,
          Math.min(24, this.game.cameraRig.distance + (this.pinchSpan - span) * 0.04),
        );
      }
      this.pinchSpan = span;
      return;
    }
    const sensitivity = Math.max(1.4, 900 / Math.min(innerWidth, innerHeight));
    this.controls.mouse.x += dx * sensitivity;
    this.controls.mouse.y += dy * sensitivity;
    if (Math.abs(dx) + Math.abs(dy) > 2) this.takeControl();
  }
  reset() {
    this.controls.touchKeys.clear();
    this.controls.touchAxes.x = this.controls.touchAxes.z = 0;
    this.controls.mouse.x = this.controls.mouse.y = 0;
    this.stickPointer = null;
    this.lookPointers.clear();
    this.holds.clear();
    this.boosting = false;
    this.knob.style.transform = 'translate(0px, 0px)';
    this.boost.setAttribute('aria-pressed', 'false');
    this.root
      .querySelectorAll('.held')
      .forEach((button) => button.classList.remove('held'));
    this.pinchSpan = null;
  }
  syncVisibility() {
    const visible = this.game.flying && !this.game.ui?.panelOpen;
    this.root.classList.toggle('hidden', !visible);
    this.steering.classList.toggle('hidden', !visible);
    document.body.classList.toggle('touch-cinematic', this.game.cinematic);
    const button = document.querySelector('#touch-cinematic');
    button.textContent = this.game.cinematic ? 'Show HUD' : 'Hide HUD';
    button.setAttribute('aria-pressed', String(this.game.cinematic));
  }
}
