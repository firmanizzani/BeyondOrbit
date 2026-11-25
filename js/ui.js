// Tagged HTML keeps UI markup formatted vertically by Prettier.
const html = (strings, ...values) => String.raw({ raw: strings }, ...values);
import { journalPlanets, discoveryProgress } from './journal.js';
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export class UI {
  constructor(game) {
    this.game = game;
    this.panelOpen = false;
    this.kind = null;
    this.returnTo = 'menu';
    this.selectedSystem = 'solar';
    this.selectedPlanet = null;
    this.journalSystem = 'all';
    this.journalStatus = 'all';
    this.previews = new Map();
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (el && !el.disabled) {
        game.audio.start(game.settings);
        game.audio.tone('ui');
        game.action(el.dataset.action);
      }
    });
    $('#audio-toggle').onclick = () => {
      game.settings.mute = !game.settings.mute;
      game.audio.start(game.settings);
      game.applySettings();
    };
    $('.wordmark').onclick = (e) => e.preventDefault();
    $('#panel-backdrop').addEventListener('click', (e) => {
      if (e.target === $('#panel-backdrop')) this.close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab' || !this.panelOpen) return;
      const nodes = [
        ...$('#panel').querySelectorAll(
          'button:not(:disabled),select,input,[tabindex="0"]',
        ),
      ].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0],
        last = nodes.at(-1);
      if (
        e.shiftKey &&
        (document.activeElement === first || document.activeElement === $('#panel'))
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }
  toast(message) {
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4000);
  }
  menu() {
    this.hidePanel();
    $('#menu').classList.remove('hidden');
    $('#hud').classList.add('hidden');
    $('#labels').classList.add('hidden');
    $('#cockpit').classList.add('hidden');
    this.game.mobile?.syncVisibility();
    const previewPlanet =
      this.game.universe.find('earth') || this.game.universe.planets[0];
    if (previewPlanet) {
      document.querySelector('.menu-location strong').textContent =
        previewPlanet.data.name;
      document.querySelector('.menu-location div>span:last-child').textContent =
        this.game.system.name +
        (previewPlanet.data.id === 'earth' ? ' · The pale blue dot' : ' · A new horizon');
    }
    $('#continue-button').disabled = !this.game.storage.saved;
    $('#save-caption').textContent = this.game.storage.saved
      ? `${this.game.storage.saved.discovered.length} / 24 discovered`
      : 'No saved journey';
  }
  syncVisibility() {
    const g = this.game;
    $('#menu').classList.toggle('hidden', g.started && g.state !== 'menu');
    $('#hud').classList.toggle(
      'hidden',
      !g.started ||
        this.panelOpen ||
        g.state === 'menu' ||
        g.cinematic ||
        g.state === 'warping',
    );
    $('#labels').classList.toggle(
      'hidden',
      g.cinematic ||
        !g.started ||
        g.state === 'menu' ||
        g.state === 'warping' ||
        this.panelOpen,
    );
    $('#cockpit').classList.toggle(
      'hidden',
      g.cameraRig.mode !== 'first' || g.state === 'menu' || !g.started,
    );
    g.mobile?.syncVisibility();
  }
  updateLock(locked) {
    $('#mouse-hint').classList.toggle('hidden', locked);
  }
  open(kind, title, subtitle = '') {
    const g = this.game;
    if (g.state === 'warping' || g.state === 'loading') return false;
    if (!this.panelOpen) {
      this.returnTo = g.state === 'menu' ? 'menu' : 'playing';
      this.previousFocus = document.activeElement;
    }
    g.scanner.cancel();
    g.state =
      this.returnTo === 'menu'
        ? 'menu'
        : kind === 'map'
          ? 'map'
          : kind === 'journal'
            ? 'journal'
            : 'paused';
    this.kind = kind;
    this.panelOpen = true;
    $('#menu').inert = true;
    $('#hud').inert = true;
    $('#hud').classList.add('hidden');
    g.controls.unlock();
    $('#panel-backdrop').classList.remove('hidden');
    $('#labels').classList.add('hidden');
    $('#panel').innerHTML = html`
      <header class="panel-head">
        <div>
          <h2 id="panel-title">${title}</h2>
          ${subtitle
            ? html`
                <p>${subtitle}</p>
              `
            : ''}
        </div>
        <button class="close-panel" data-action="close">
          Close
          <kbd>Esc</kbd>
        </button>
      </header>
      <div id="panel-body"></div>
    `;
    $('#panel').focus();
    g.mobile?.syncVisibility();
    return true;
  }
  hidePanel() {
    this.panelOpen = false;
    $('#menu').inert = false;
    $('#hud').inert = false;
    $('#panel-backdrop').classList.add('hidden');
    this.kind = null;
  }
  close() {
    if (!this.panelOpen) return;
    const menu = this.returnTo === 'menu';
    if (this.kind === 'settings' && this.settingsBack === 'pause' && !menu) {
      this.settingsBack = null;
      this.pause();
      return;
    }
    if (this.kind === 'help' && this.helpBack === 'pause' && !menu) {
      this.helpBack = null;
      this.pause();
      return;
    }
    this.hidePanel();
    this.game.state = menu ? 'menu' : 'playing';
    this.syncVisibility();
    this.previousFocus?.focus?.();
  }
  pause() {
    if (!this.open('pause', 'Flight paused')) return;
    $('#panel-body').innerHTML = html`
      <div class="pause-content">
        <h3>A moment of stillness.</h3>
        <p>${esc(this.game.system.name)} · Your journey is saved locally.</p>
        <nav>
          <button class="primary" data-action="resume">Resume Game</button>
          <button data-action="settings">Settings</button>
          <button data-action="help">How to Play</button>
          <button data-action="mainmenu">Save &amp; Return to Main Menu</button>
        </nav>
      </div>
    `;
  }
  map() {
    const g = this.game;
    this.selectedSystem = g.system.id;
    this.selectedPlanet = g.target?.data.id || g.universe.planets[0].data.id;
    this.drawMap();
  }
  drawMap() {
    const g = this.game,
      s = g.systems.find((x) => x.id === this.selectedSystem),
      ps = g.planetData.filter((p) => p.system === s.id),
      progress = discoveryProgress(ps, g.discovered);
    if (
      !this.open(
        'map',
        'Galaxy Map',
        'Find your next horizon. Select a world, or journey to another star.',
      )
    )
      return;
    const coordinates = g.systems.map((s) => s.map.join(',')).join(' ');
    $('#panel-body').innerHTML = html`
      <div class="map-layout">
        <div class="galaxy-chart" aria-label="Star systems">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline
              points="${coordinates}"
              fill="none"
              stroke="#526b8b"
              stroke-width=".15"
              stroke-dasharray="1 2"
            />
          </svg>
          ${g.systems
            .map(
              (x) => html`
                <button
                  class="system-node ${s.id === x.id ? 'selected' : ''}"
                  data-system="${x.id}"
                  style="left:${x.map[0]}%;top:${x.map[1]}%;--node:${x.color}"
                >
                  <span class="star-point"></span>
                  ${esc(x.name)}${x.id === g.system.id
                    ? '<small>Current location</small>'
                    : ''}
                </button>
              `,
            )
            .join('')}
        </div>
        <div class="system-info">
          <h3>${esc(s.name)}</h3>
          <p>${esc(s.description)}</p>
          <div class="discovery-count">
            <span>${progress.found} / ${progress.total} worlds discovered</span>
            <span>${progress.percent}%</span>
          </div>
          <progress max="100" value="${progress.percent}"></progress>
          <div class="planet-list">
            ${ps
              .map(
                (p) => html`
                  <button
                    class="planet-row ${p.id === this.selectedPlanet ? 'selected' : ''}"
                    data-planet="${p.id}"
                  >
                    <span>
                      <i class="planet-dot" style="--planet:${p.color}"></i>
                      ${esc(p.name)}
                    </span>
                    <small>${g.discovered.has(p.id) ? 'Discovered' : p.type}</small>
                  </button>
                `,
              )
              .join('')}
          </div>
          <div class="panel-actions">
            ${s.id === g.system.id
              ? html`
                  <button id="set-destination" class="secondary">Set Destination</button>
                  <button id="fly-destination" class="primary">Fly with Autopilot</button>
                `
              : '<button id="activate-warp" class="primary">Activate Warp Drive</button>'}
          </div>
          <p style="margin-top:14px;font-size:.75rem">
            ${s.fictional
              ? 'Fictional exploration worlds'
              : 'Real-world planet references · gameplay scale simplified'}
          </p>
        </div>
      </div>
    `;
    $('#panel')
      .querySelectorAll('[data-system]')
      .forEach(
        (el) =>
          (el.onclick = () => {
            this.selectedSystem = el.dataset.system;
            this.selectedPlanet = g.planetData.find(
              (p) => p.system === el.dataset.system,
            ).id;
            this.drawMap();
          }),
      );
    $('#panel')
      .querySelectorAll('[data-planet]')
      .forEach(
        (el) =>
          (el.onclick = () => {
            this.selectedPlanet = el.dataset.planet;
            this.drawMap();
          }),
      );
    const chooseDestination = (fly) => {
      g.target = g.universe.find(this.selectedPlanet);
      g.autopilot.cancel();
      this.close();
      g.save();
      if (fly) g.autopilot.toggle();
      else this.toast(`Destination set · ${g.target.data.name}. Press P for autopilot.`);
    };
    if ($('#set-destination'))
      $('#set-destination').onclick = () => chooseDestination(false);
    if ($('#fly-destination'))
      $('#fly-destination').onclick = () => chooseDestination(true);
    if ($('#activate-warp')) $('#activate-warp').onclick = () => g.warp.start(s);
  }
  preview(data) {
    let image = this.previews.get(data.id);
    const active = this.game.universe.find(data.id);
    if (!image && active) {
      image = active.surface.material.map.image.toDataURL();
      this.previews.set(data.id, image);
    }
    return `style="--planet:${data.color};${image ? `background-image:radial-gradient(circle at 28% 25%,transparent,#000c 95%),url('${image}');` : ''}"`;
  }
  journal() {
    if (
      !this.open(
        'journal',
        'Discovery Journal',
        'Every discovery is a new chapter in your journey.',
      )
    )
      return;
    const g = this.game,
      progress = discoveryProgress(g.planetData, g.discovered),
      ps = journalPlanets(
        g.planetData,
        g.discovered,
        this.journalSystem,
        this.journalStatus,
      );
    $('#panel-body').innerHTML = html`
      <div class="journal-summary">
        <strong>
          ${progress.found}
          <span>/ ${progress.total}</span>
        </strong>
        <span>worlds discovered · ${progress.percent}% explored</span>
      </div>
      <progress value="${progress.percent}" max="100"></progress>
      <div class="filters">
        <select id="journal-system" aria-label="Filter by star system">
          <option value="all">All star systems</option>
          ${g.systems
            .map(
              (s) => html`
                <option value="${s.id}" ${s.id === this.journalSystem ? 'selected' : ''}>
                  ${esc(s.name)}
                </option>
              `,
            )
            .join('')}
        </select>
        <select id="journal-status" aria-label="Filter by discovery status">
          ${[
            ['all', 'All discoveries'],
            ['discovered', 'Discovered'],
            ['unknown', 'Undiscovered'],
          ]
            .map(
              ([id, name]) => html`
                <option value="${id}" ${this.journalStatus === id ? 'selected' : ''}>
                  ${name}
                </option>
              `,
            )
            .join('')}
        </select>
      </div>
      <div class="planet-grid">
        ${ps
          .map((p) => {
            const known = g.discovered.has(p.id);
            return html`
              <button
                class="planet-card ${known ? '' : 'unknown'}"
                data-detail="${p.id}"
                ${known ? '' : 'disabled'}
              >
                <div class="planet-preview" ${known ? this.preview(p) : ''}></div>
                <h3>${known ? esc(p.name) : 'Unknown Planet'}</h3>
                <small>
                  ${known
                    ? 'Discovered'
                    : esc(g.systems.find((s) => s.id === p.system).name)}
                </small>
              </button>
            `;
          })
          .join('')}
      </div>
      ${ps.length === 0
        ? '<p class="help-intro">No worlds match this filter. Your next discovery is waiting.</p>'
        : ''}
    `;
    $('#journal-system').onchange = (e) => {
      this.journalSystem = e.target.value;
      this.journal();
    };
    $('#journal-status').onchange = (e) => {
      this.journalStatus = e.target.value;
      this.journal();
    };
    $('#panel')
      .querySelectorAll('[data-detail]')
      .forEach(
        (el) =>
          (el.onclick = () =>
            this.details(
              g.planetData.find((p) => p.id === el.dataset.detail),
              'journal',
            )),
      );
  }
  details(p, back = 'flight') {
    if (
      !this.open(
        'details',
        'Planetary Survey',
        back === 'journal' ? 'Discovery archive' : 'Scan complete · Discovery saved',
      )
    )
      return;
    const s = this.game.systems.find((s) => s.id === p.system);
    const fields = [
      ['Star system', s.name],
      ['Planet type', p.type],
      ['Diameter', p.diameter.toLocaleString() + ' km'],
      ['Mean temperature', p.temperature + ' °C'],
      ['Atmosphere', p.atmosphere],
      ['Moons', p.moons],
      ['Habitability', p.habitability],
      ['Catalog ID', p.id.toUpperCase()],
    ];
    $('#panel-body').innerHTML = html`
      <div class="planet-detail">
        <div class="planet-preview" ${this.preview(p)}></div>
        <div>
          <h3>${esc(p.name)}</h3>
          <p class="source-note">
            ${p.fictional
              ? 'Fictional world · Creative exploration data'
              : 'Real Solar System world · Approximate reference data'}
          </p>
          <p class="description">${esc(p.description)}</p>
          <dl class="data-grid">
            ${fields
              .map(
                ([k, v]) => html`
                  <div>
                    <dt>${k}</dt>
                    <dd>${esc(v)}</dd>
                  </div>
                `,
              )
              .join('')}
          </dl>
        </div>
      </div>
      <div class="panel-actions">
        <button class="primary" data-action="${back === 'journal' ? 'journal' : 'close'}">
          ${back === 'journal' ? 'Back to Journal' : 'Continue Exploration'}
        </button>
      </div>
    `;
  }
  settings() {
    const g = this.game;
    if (this.kind === 'pause') this.settingsBack = 'pause';
    if (
      !this.open(
        'settings',
        'Settings',
        'Changes apply immediately and save automatically.',
      )
    )
      return;
    const s = g.settings;
    const select = (key, label, values) => html`
      <div class="setting">
        <label for="s-${key}">${label}</label>
        <select id="s-${key}" data-setting="${key}">
          ${values
            .map(
              ([v, l]) => html`
                <option value="${v}" ${s[key] === v ? 'selected' : ''}>${l}</option>
              `,
            )
            .join('')}
        </select>
      </div>
    `;
    const check = (key, label) => html`
      <div class="setting">
        <label for="s-${key}">${label}</label>
        <input
          id="s-${key}"
          data-setting="${key}"
          type="checkbox"
          ${s[key] ? 'checked' : ''}
        />
      </div>
    `;
    const range = (key, label, min, max, step) => html`
      <div class="setting">
        <label for="s-${key}">
          ${label}
          <output id="v-${key}">
            ${key === 'renderDistance' ? s[key] : Math.round(s[key] * 100) + '%'}
          </output>
        </label>
        <input
          id="s-${key}"
          data-setting="${key}"
          type="range"
          min="${min}"
          max="${max}"
          step="${step}"
          value="${s[key]}"
        />
      </div>
    `;
    $('#panel-body').innerHTML = html`
      <div class="settings-layout">
        <section class="settings-section">
          <h3>Graphics</h3>
          ${select('quality', 'Graphics quality', [
            ['low', 'Low'],
            ['medium', 'Medium'],
            ['high', 'High'],
          ])}${range('renderDistance', 'Render distance', 2500, 14000, 500)}${check(
            'bloom',
            'Bloom / light halos',
          )}${select('particles', 'Particle quality', [
            ['low', 'Low'],
            ['medium', 'Medium'],
            ['high', 'High'],
          ])}${check('orbits', 'Orbit lines')}${check('labels', 'Planet labels')}
          <div class="setting">
            <label>Fullscreen</label>
            <button id="fullscreen" class="secondary">Toggle fullscreen</button>
          </div>
        </section>
        <section class="settings-section">
          <h3>Audio</h3>
          ${range('master', 'Master volume', 0, 1, 0.01)}${range(
            'music',
            'Music volume',
            0,
            1,
            0.01,
          )}${range('effects', 'Sound effects', 0, 1, 0.01)}${check('mute', 'Mute audio')}
          <div class="panel-actions">
            <button class="secondary" id="preview-music">Test music</button>
            <button class="secondary" id="preview-effects">Test sound effects</button>
          </div>
        </section>
        <section class="settings-section">
          <h3>Controls</h3>
          ${range('sensitivity', 'Mouse sensitivity', 0.2, 2.5, 0.05)}${select(
            'camera',
            'Default camera',
            [
              ['third', 'Third person'],
              ['first', 'Cockpit'],
            ],
          )}${check('invertY', 'Invert Y axis')}
        </section>
        <section class="settings-section">
          <h3>Game data</h3>
          <p class="help-intro" style="font-size:.85rem">
            ${g.discovered.size} / 24 worlds discovered.
            <br />
            ${Math.floor(g.playtime / 60)} minutes exploring.
            <br />
            Progress is stored on this browser.
          </p>
          <div class="panel-actions">
            <button id="reset-progress" class="secondary danger">Reset progress</button>
          </div>
        </section>
      </div>
    `;
    $('#panel')
      .querySelectorAll('[data-setting]')
      .forEach(
        (el) =>
          (el.oninput = () => {
            const key = el.dataset.setting;
            s[key] =
              el.type === 'checkbox'
                ? el.checked
                : el.type === 'range'
                  ? Number(el.value)
                  : el.value;
            if ($(`#v-${key}`))
              $(`#v-${key}`).textContent =
                key === 'renderDistance' ? s[key] : Math.round(s[key] * 100) + '%';
            if (key === 'camera') g.cameraRig.setMode(s.camera);
            g.applySettings();
          }),
      );
    for (const bus of ['music', 'effects']) {
      $(`#preview-${bus}`).onclick = () => {
        g.audio.start(s);
        if (s.mute || s.master === 0 || s[bus] === 0) {
          this.toast(
            'Audio is muted or its volume is zero. Adjust the audio settings first.',
          );
          return;
        }
        if (!g.audio.context) {
          this.toast('Web Audio is unavailable in this browser.');
          return;
        }
        g.audio.preview(bus);
      };
    }
    $('#fullscreen').onclick = () => {
      const promise = document.fullscreenElement
        ? document.exitFullscreen()
        : document.documentElement.requestFullscreen();
      promise?.catch(() => this.toast('Fullscreen unavailable in this browser view.'));
    };
    $('#reset-progress').onclick = () =>
      this.confirm(
        'Reset your journey?',
        'This deletes all discoveries and your saved flight position. Your settings will be kept.',
        () => {
          g.reset();
          this.menu();
        },
      );
  }
  featureOverview() {
    const features = this.game.touchMode
      ? [
          [
            'Flight & boost',
            'Use the left joystick to thrust and strafe. Boost toggles extra speed; hold Brake to stop.',
          ],
          [
            'Galaxy & warp',
            'Tap Map to explore five star systems and activate Warp Drive.',
          ],
          [
            'Autopilot',
            'Tap Auto to toggle navigation. Moving the joystick or steering takes control.',
          ],
          [
            'Cockpit & cinematic views',
            'View switches cameras. Pinch space to adjust chase distance. Hide HUD enters cinematic mode.',
          ],
          [
            'Scans & Discovery Journal',
            'Tap Scan planet when ready. Journal opens discoveries, details, and filters.',
          ],
          [
            'Settings & automatic saves',
            'Pause opens settings. Graphics, audio, and flight progress save on this browser.',
          ],
        ]
      : [
          [
            'Flight & boost',
            'Strafe, climb, descend, and roll. Shift boosts; Space brakes.',
          ],
          [
            'Galaxy & warp',
            'Use M to explore five star systems and activate Warp Drive.',
          ],
          [
            'Autopilot',
            'Press P to toggle navigation. Manual input takes control immediately.',
          ],
          [
            'Cockpit & cinematic views',
            'C switches cameras; the mouse wheel changes chase distance. H hides the HUD.',
          ],
          [
            'Scans & Discovery Journal',
            'F surveys nearby worlds. J opens discoveries, planet details, and filters.',
          ],
          [
            'Settings & automatic saves',
            'Esc opens pause and settings. Graphics, audio, and flight progress save on this browser.',
          ],
        ];
    return html`
      <section class="feature-overview">
        <h3>More to explore</h3>
        <ul>
          ${features
            .map(
              ([title, text]) => html`
                <li>
                  <strong>${title}</strong>
                  <span>${text}</span>
                </li>
              `,
            )
            .join('')}
        </ul>
      </section>
    `;
  }
  onboarding() {
    if (
      !this.open(
        'tutorial',
        'Your first discovery',
        'The universe is yours to explore. Start with these three actions.',
      )
    )
      return;
    $('#panel-body').innerHTML = html`
      <div class="onboarding-steps">
        <section>
          <h3>Take the controls</h3>
          ${this.game.touchMode
            ? html`
                <p>
                  Move the left joystick to fly. Swipe space to steer and hold
                  <strong>Brake</strong>
                  to stop.
                </p>
              `
            : html`
                <p>
                  Click space to steer with your mouse. Hold
                  <kbd>W</kbd>
                  to fly forward and
                  <kbd>Space</kbd>
                  to brake.
                </p>
              `}
        </section>
        <section>
          <h3>Choose a world</h3>
          ${this.game.touchMode
            ? html`
                <p>
                  Tap
                  <strong>Map</strong>
                  , select a planet, and choose
                  <strong>Fly with Autopilot</strong>
                  .
                </p>
              `
            : html`
                <p>
                  Open the Galaxy Map with
                  <kbd>M</kbd>
                  , select a planet, and choose
                  <strong>Fly with Autopilot</strong>
                  .
                </p>
              `}
        </section>
        <section>
          <h3>Record your discovery</h3>
          ${this.game.touchMode
            ? html`
                <p>
                  Tap
                  <strong>Scan planet</strong>
                  when ready. Review your discoveries through
                  <strong>Journal</strong>
                  .
                </p>
              `
            : html`
                <p>
                  Press
                  <kbd>F</kbd>
                  when the scanner is ready. Find your discoveries in the journal with
                  <kbd>J</kbd>
                  .
                </p>
              `}
        </section>
      </div>
      ${this.featureOverview()}
      <p class="help-intro">
        You're already near Earth, within scanning range. There are no missions, enemies,
        or time limits.
      </p>
      <div class="panel-actions">
        <button class="primary" data-action="close">Begin Flight</button>
        <button class="secondary" data-action="help">Features &amp; controls</button>
      </div>
    `;
  }
  help() {
    if (this.kind === 'pause') this.helpBack = 'pause';
    if (
      !this.open(
        'help',
        'How to Play',
        'Your ship. Your heading. An entire universe to discover.',
      )
    )
      return;
    const controls = this.game.touchMode
      ? [
          ['Left joystick', 'Forward, reverse, and strafe'],
          ['Swipe space', 'Pitch and yaw'],
          ['Up / Down', 'Vertical movement'],
          ['Roll L / Roll R', 'Roll left / right'],
          ['Boost', 'Toggle speed boost'],
          ['Brake (hold)', 'Brake'],
          ['Scan planet', 'Scan nearby planet'],
          ['Map', 'Galaxy Map and Warp Drive'],
          ['Auto', 'Toggle autopilot'],
          ['View', 'Switch camera'],
          ['Journal', 'Discovery Journal'],
          ['Hide HUD / Show HUD', 'Cinematic mode'],
          ['Pause', 'Pause menu'],
          ['Pinch space', 'Third-person camera distance'],
        ]
      : [
          ['W / S', 'Forward / reverse'],
          ['A / D', 'Strafe left / right'],
          ['R / Ctrl', 'Up / down'],
          ['Mouse', 'Pitch and yaw'],
          ['Q / E', 'Roll left / right'],
          ['Shift', 'Speed boost'],
          ['Space', 'Brake'],
          ['F', 'Scan nearby planet'],
          ['M', 'Galaxy Map'],
          ['P', 'Toggle autopilot'],
          ['C', 'Switch camera'],
          ['J', 'Discovery Journal'],
          ['H', 'Cinematic mode'],
          ['Esc', 'Pause / close panel'],
          ['Mouse wheel', 'Third-person camera distance'],
        ];
    $('#panel-body').innerHTML = html`
      <p class="help-intro">
        ${this.game.touchMode
          ? 'Fly freely using the joystick and swipe steering. Tap Map, select a planet, and choose Fly with Autopilot. Tap Scan planet within range, then review your discoveries in Journal. Landscape orientation provides more space for flight.'
          : `Fly freely, select a planet in the Galaxy Map, and press P to let autopilot guide
        you there. Once the scanner is ready, press F to record your discovery. Visit
        another star system by selecting it in the map and activating Warp Drive.`}
      </p>
      <div class="controls-grid">
        ${controls
          .map(
            ([key, description]) => html`
              <div class="control-row">
                <span>${description}</span>
                <kbd>${key}</kbd>
              </div>
            `,
          )
          .join('')}
      </div>
      <div class="help-tip">
        ${this.game.touchMode
          ? 'Use the left thumb on the joystick and swipe open space with the right thumb. Boost is a toggle; Brake, Up, Down, and Roll act while held. Touch input stops when released or when a menu opens. In cinematic mode, flight controls remain available and Show HUD restores the instruments. Atmospheric landing is not available.'
          : `Click the space view to capture the mouse and steer. Escape releases the mouse and
        pauses flight. Manual thrust or mouse steering takes over from autopilot. Explore
        from orbit; atmospheric landing is not available. There are no enemies, fuel
        limits, or time limits.`}
      </div>
      <div class="panel-actions">
        <button class="primary" data-action="close">
          ${this.game.started ? 'Ready to Explore' : 'Back to Main Menu'}
        </button>
      </div>
    `;
  }
  confirm(title, message, onConfirm) {
    this.confirmBack = this.kind;
    if (!this.open('confirm', title)) return;
    $('#panel-body').innerHTML = html`
      <div class="confirm">
        <p>${esc(message)}</p>
        <div class="panel-actions">
          <button id="confirm-yes" class="primary">Confirm</button>
          <button id="confirm-no" class="secondary">Cancel</button>
        </div>
      </div>
    `;
    $('#confirm-yes').onclick = onConfirm;
    $('#confirm-no').onclick = () =>
      this.confirmBack === 'settings' ? this.settings() : this.close();
  }
}
