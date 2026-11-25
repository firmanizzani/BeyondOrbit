# Beyond Orbit

**Explore the unknown. Journey beyond the stars.**

Beyond Orbit is a single-player, browser-based 3D space exploration game. Pilot a spacecraft freely, visit 24 planets across five star systems, scan distant worlds, and collect discoveries in your journal. Explore at your own pace, with no combat, fuel limits, survival mechanics, or time pressure.

Built from [`build.md`](build.md) and [`prd.md`](prd.md) with HTML, CSS, Vanilla JavaScript ES Modules, Three.js, WebGL 2, the Web Audio API, and LocalStorage. No frontend framework, backend, database, or paid service is required.

## Features

- **Free 3D flight:** acceleration, inertia, damping, strafing, vertical movement, pitch, yaw, roll, boost, and braking.
- **A custom spacecraft:** detailed hull, cockpit, swept wings, engine pods, nozzles, fins, illuminated accents, and exhaust particles.
- **Five distinct star systems:** 24 configurable planets, each with its own appearance and survey information.
- **Living space environments:** rotating and orbiting planets, procedural surface textures, atmospheric glow, rings, moons, nebulae, thousands of stars, and an instanced asteroid belt.
- **Planet scanner:** a timed survey that records discoveries, prevents duplicates, and cancels when you leave scanning range.
- **Interactive Galaxy Map:** select local destinations or activate Warp Drive to travel between star systems.
- **Autopilot:** automatic steering, stable obstacle detours, gradual acceleration and braking, animated banking, and arrival at a safe scanning distance. The HUD names the object being avoided. Manual input takes over immediately.
- **Flight navigation:** target distance, velocity, heading, nearby planet, scanner status, autopilot status, and off-screen target indicators.
- **Two camera modes:** smooth third-person flight and a first-person cockpit view. Press **C** to switch.
- **Discovery Journal:** planet previews, survey details, exploration progress, and filters by system and discovery status.
- **Cinematic Mode:** hide the HUD, labels, and navigation markers while retaining flight controls.
- **Complete menus:** New Game, Continue, pause, settings, How to Play, loading screens, and confirmation dialogs.
- **Working settings:** graphics quality, render distance, bloom, particle quality, orbit lines, labels, fullscreen, audio volumes, mouse sensitivity, default camera, and inverted Y axis.
- **Procedural audio:** ambient music and engine, boost, warp, scanner, discovery, and interface sounds.
- **Local saves:** automatic progress and settings storage, save validation, safe recovery from invalid data, and Continue support.
- **Buildless deployment:** all runtime dependencies are bundled locally and the project can run on static hosting.

## Getting Started

### Requirements

- Node.js 22 or newer for the included development server.
- A desktop browser with WebGL 2 and hardware acceleration enabled.
- A keyboard and mouse. Touch flight controls are outside the project's scope.

### Run Locally

```sh
npm start
```

Open **[http://127.0.0.1:4173](http://127.0.0.1:4173)**.

No dependency installation is needed to play: Three.js 0.180.0 is included in `vendor/`. Another static HTTP server, such as VS Code Live Server, works too. Opening `index.html` through `file://` will not work because the game uses ES Modules and JSON loading.

Modern Chrome, Edge, and Firefox are the compatibility targets. See [Testing](TESTING.md) for what was actually verified.

### Your First Journey

1. Select **New Game**, read the tutorial, and choose **Ready to Explore**.
2. You start near Earth. Click the space view to capture the mouse and steer.
3. Hold **W** to accelerate and **Space** to brake.
4. Press **F** when the scanner is ready. Remain within range for 3.5 seconds to record a discovery.
5. Open **M**, select a planet, and choose **Set Destination**. Press **P** to let autopilot guide you to scanning range.
6. Select another star system and choose **Activate Warp Drive** to travel there.
7. Open **J** to review discoveries. Exploration remains available after all 24 worlds are discovered.

**Escape** releases the mouse and pauses. After resuming, click the space view to capture it again. Some embedded browser previews do not permit pointer lock; use a standalone desktop browser for mouse steering. Autopilot remains usable without pointer lock.

## Controls

| Input       | Action                                                           |
| ----------- | ---------------------------------------------------------------- |
| W / S       | Forward / reverse                                                |
| A / D       | Strafe left / right                                              |
| R / Ctrl    | Move up / down                                                   |
| Mouse       | Pitch and yaw while pointer lock is active                       |
| Q / E       | Roll left / right                                                |
| Shift       | Speed boost                                                      |
| Space       | Brake                                                            |
| F           | Scan a planet within range                                       |
| M           | Open Galaxy Map                                                  |
| P           | Toggle autopilot                                                 |
| C           | Switch third-person / cockpit camera                             |
| J           | Open Discovery Journal                                           |
| H           | Toggle Cinematic Mode                                            |
| Esc         | Pause / close the active panel                                   |
| Mouse wheel | Adjust third-person camera distance while pointer lock is active |

Manual thrust or mouse steering cancels autopilot. Held inputs are cleared when opening a panel, losing browser focus, hiding the tab, or releasing pointer lock. Atmospheric landing is not supported.

Manual flight and autopilot share a **210 km/s** cruise limit. Holding W reaches cruise speed in approximately **1.8 seconds**; W + Shift raises the limit to **320 km/s**. Release thrust to coast or hold Space to brake.

Flight assist stabilizes lateral drift after turning or releasing strafe input. The chase camera follows the ship's position directly while smoothing its rotation, keeping the spacecraft centered even during high-speed turns.

## The Galaxy

| Star system    | Planets                                                       |
| -------------- | ------------------------------------------------------------- |
| Solar System   | Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune |
| Alpha Centauri | Proxima Haven, Aurelia, Terra Nova, Kepleris                  |
| Nebula Prime   | Nyx, Lumora, Aether, Orionis, Velora                          |
| Cryon System   | Glacius, Borealis, Frostara                                   |
| Vulcan System  | Ignis, Inferna, Pyron, Magmora                                |

Definitions live in `data/planets.json` and `data/systems.json`. Additional worlds can be added through configuration without changing the core exploration logic.

Solar System diameters, temperatures, and atmospheric compositions are approximate reference values. Moon counts are illustrative catalog snapshots, not a current astronomical census. Textures are artistic rather than geographically accurate. Visual radii, orbital distances, periods, and travel speeds are simplified for gameplay. At most four moons are rendered per planet for performance, even when its survey lists a larger count.

Every planet outside the Solar System is **fictional**, including the worlds in Alpha Centauri. The map and survey details identify fictional data explicitly.

## Saves and Settings

LocalStorage stores the save version, active system, spacecraft position and quaternion, discovered planet IDs, selected destination, camera mode, settings, playtime, and last-saved timestamp.

Autosave runs after a completed scan, a completed warp, settings changes, returning to the menu, leaving the page, and every 15 seconds of active flight. Continue validates saved data and corrects positions intersecting an object. The animated menu cannot overwrite the last saved flight position.

| Storage key                | Contents                              |
| -------------------------- | ------------------------------------- |
| `beyond-orbit.save.v1`     | Flight progress and discoveries       |
| `beyond-orbit.settings.v1` | Graphics, audio, and control settings |

Invalid saves are safely ignored. If storage is blocked or full, a notification appears and the game remains playable for the current session. **Reset progress** and **New Game** with an existing save require confirmation. Resetting preserves settings. Saves are local to this browser and website origin.

## Project Structure

```text
index.html
css/
  main.css          Shared styles, loading screens, and visual states
  menu.css          Main menu and interactive panels
  hud.css           Flight instruments and cockpit overlay
js/
  main.js           Catalog loading and startup
  game.js           Central game state and single animation loop
  flight.js         Shared acceleration, speed, and braking configuration
  rendering.js      Bright-pass bloom composite
  universe.js       Active system, background, asteroids, and disposal
  planet.js         Textures, atmospheres, planets, rings, and moons
  spaceship.js      Ship model, physics, engines, and collisions
  controls.js       Keyboard, mouse, pointer lock, and focus handling
  camera.js         Third-person and cockpit cameras
  navigation.js     HUD, distances, heading, labels, and target markers
  autopilot.js      Steering, deceleration, and obstacle avoidance
  scanner.js        Scan range, progress, and discovery recording
  warp.js           Interstellar hyperspace transitions
  journal.js        Catalog filters and discovery progress
  storage.js        Save and settings validation
  audio.js          Procedural music and sound effects
  ui.js             Menus, map, journal, surveys, and settings
data/
  systems.json      Five star system definitions
  planets.json      All 24 planet definitions
vendor/             Local Three.js distribution and MIT license
tests/              Game logic tests using node:test
server.mjs          Local static development server
vercel.json         Static hosting configuration
```

Project-owned HTML, CSS, JavaScript, JSON, and embedded UI templates use a readable multiline format with two-space indentation. Vendor files retain their upstream formatting.

## Development

```sh
npm ci
npm test
npm run format:check
npm run format
```

Prettier is a development dependency only. No runtime package installation or compilation step is needed.

Tests cover catalog integrity, movement, boost, braking, collision response, scanning and cancellation, duplicate discoveries, autopilot arrival at all 24 worlds, obstacle avoidance, save validation, settings normalization, storage failures, journal filtering, save-overwrite prevention, and resource disposal.

See [TESTING.md](TESTING.md) for results and verification limits.

## Performance

The game uses one animation loop, a 50 ms delta-time cap, HUD updates at 10 Hz, one active system, instanced asteroids, a bounded cache of eight procedural texture canvases, GPU resource disposal, built-in frustum culling, and a capped pixel ratio.

Pixel ratio is reduced automatically when average frame rate is below 28 FPS over five seconds. Low graphics quality reduces resolution and asteroid count. Particle quality controls star count, nebula visibility, and exhaust separately. Turning off bloom reduces GPU work further.

The targets are 60 FPS on suitable hardware and at least 30 FPS on Low. These are targets rather than guarantees; cross-device performance testing is still required.

## Assets and Licenses

Planet textures, nebulae, the spacecraft, asteroids, visual effects, music, and sound effects are generated procedurally. No external images, GLB models, audio files, or web fonts are needed. Typography uses locally available Segoe UI or Arial.

The bundled runtime, **Three.js 0.180.0**, copyright Three.js authors, is released under the **MIT License**. A copy is included in [`vendor/THREE-LICENSE.txt`](vendor/THREE-LICENSE.txt).

- [Three.js source repository](https://github.com/mrdoob/three.js)
- [Three.js 0.180.0 package](https://www.npmjs.com/package/three/v/0.180.0)

## Deploy to Vercel

1. Import **`firmanizzani/BeyondOrbit`** into Vercel.
2. Select **Other** as the framework preset.
3. Leave the build command empty and use the repository root (`.`) as the output directory.
4. Deploy. `vercel.json` provides static output and vendor / JSON cache settings.

No environment variables, API keys, backend, or database are needed. For another static host, publish `index.html`, `css/`, `js/`, `data/`, and `vendor/`, serving ES Modules with the correct JavaScript MIME type.

Production deployment requires the owner's Vercel account and project. Configuration is included; a production Vercel deployment has not been performed from this workspace.
