# Verification Report

Tested on November 25, 2026, against the static application served by `npm start`.

## Automated Game Tests

Run `npm test` with Node.js 22 or newer. The suite uses the actual game modules and bundled Three.js, with small fixtures for browser storage and survey notifications.

All **16 tests passed**:

1. Exactly five systems and 24 unique, fully configured planets.
2. Translation in all six directions and roll input.
3. Higher boost speed, the speed cap, and braking inertia.
4. Sphere collision response, including a ship starting inside an obstacle.
5. Scan completion, persistence, and duplicate prevention.
6. Rejection and cancellation of out-of-range scans.
7. Autopilot arrival within safe scanning range of all 24 moving planets.
8. Autopilot steering around an intervening sphere.
9. Invalid save rejection and discovery / destination sanitization.
10. Settings type validation and numeric bounds.
11. Save round-trip, corrupt JSON, and inaccessible storage.
12. Journal filtering and computed discovery progress.
13. Protection against menu animation or incomplete warp overwriting a flight save.
14. Disposal of system geometry, materials, and textures while retaining shared background resources.
15. Actual input handling for boost, key release, mouse motion, and clearing input on focus loss.
16. Restoring spacecraft visibility after cockpit mode and adapting camera distance for narrow views.

Autopilot tests advance real steering and flight physics at 60 simulation steps per second. These tests verify logic; they do not constitute a GPU frame-rate benchmark.

## Browser Checks

Manually verified in the available Chromium-based in-app browser:

| Flow                                   | Observed result                                                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Initial loading and animated main menu | Loaded successfully; Continue disabled before the first save                                                    |
| New Game                               | Loaded Solar System and displayed the first-flight tutorial                                                     |
| Manual W thrust and Space brake        | Velocity increased to approximately 30 km/s and returned to 0                                                   |
| Earth scan                             | Timed survey completed and displayed planetary data                                                             |
| Discovery persistence                  | Earth remained discovered after a page reload                                                                   |
| Interactive map                        | Selected systems and planets and set a navigation target                                                        |
| Warp                                   | Visited Solar System, Cryon, Alpha Centauri, Nebula Prime, and Vulcan; restored controls after arrival          |
| Autopilot                              | Navigated to Borealis and stopped within scanner range                                                          |
| Borealis scan                          | Added a second distinct discovery                                                                               |
| Journal                                | Displayed 2 / 24 discoveries; the discovered filter showed Earth and Borealis                                   |
| Camera                                 | Switched between cockpit and third person; restored third person after testing                                  |
| Cinematic mode                         | Hid the flight HUD; H restored it                                                                               |
| Pause and settings                     | Opened and closed panels without continuing flight input                                                        |
| Graphics settings                      | Changed quality, bloom, and orbit visibility                                                                    |
| Audio settings                         | Toggled mute; Web Audio initialization produced no runtime error                                                |
| Settings persistence                   | Low quality, disabled bloom, enabled orbits, and mute survived reload; original choices were restored afterward |
| Continue                               | Restored the saved Cryon location, selected target, discoveries, and camera                                     |
| New Game confirmation                  | Displayed overwrite confirmation; cancelling preserved the existing save                                        |
| Runtime console                        | No error-level messages observed during checked exploration and warp flows                                      |

## Visual Checks

The design inspector was run against the static application at widths of **1440, 768, and 390 pixels**. Final result: **0 failures and 1 warning**. All generated viewport screenshots and contact sheets were inspected.

The remaining warning concerns the large main-menu title. It is intentional: the specification requests an elegant cinematic game title rather than a compact dashboard heading. The title remains within two lines at each tested width.

The first pass caught undersized metadata and an entrance animation that displaced menu content; both were corrected. Initial menu loading now generates the Earth preview first, with the full system generated when starting a journey.

Design direction: **Data terminal**, seed **1267016663**, adapted to the explicitly requested space palette, cinematic title, atmospheric effects, and translucent flight instruments. The underlying idea is an observation deck: the world dominates while instruments remain at the edges. The live experience is real 3D flight and exploration, not a static hero image.

### Final Visual Critique

ROUND 3

- Seen in one second: a large living planet and the Beyond Orbit title.
- Idea: an observation deck that gives the universe most of the screen.
- Live thing: real-time spaceflight, scans, planet motion, and interstellar travel.
- Layout: menu = split title / live world; flight = full viewport with peripheral instruments; map = star chart / destination panel; journal = filtered planet catalog.
- Scores: design 6.5, usability 8, creativity 7, content 8; weighted score 7.2.
- Caps applied: the reference rubric caps imagery at 6.5 without photography; this game intentionally uses procedural 3D worlds, as permitted by the product specification.
- Remaining limits: textures are artistic rather than geographically accurate; the model and effects are procedural rather than production-authored assets; keyboard / mouse gameplay is intended for desktop.

The final screenshots show readable menu metadata, a complete menu at every checked width, and no horizontal document overflow. There are no downloaded images or sample business content requiring replacement.

## Verification Limits

- The embedded preview rejected pointer lock. The fallback message and autopilot remain functional. Full captured-mouse steering must still be tested in standalone Chrome, Edge, and Firefox.
- Chrome, Edge, and Firefox have not each received a complete compatibility run.
- No controlled GPU benchmark was performed. The 60 FPS / 30 FPS Low targets remain to be measured on representative devices.
- Fullscreen availability depends on the embedding browser and was not verified in a standalone browser.
- Audio generation and mute controls were exercised without runtime errors; subjective listening and mix balancing were not independently verified.
- Automated tests survey scanner behavior and autopilot arrival for every planet. Each of the 24 worlds has not been individually scanned through manual browser input.
- Vercel configuration is provided, but a production Vercel deployment was not performed from this workspace.

These limits are intentionally reported rather than claiming complete device, browser, audio, or production certification.
