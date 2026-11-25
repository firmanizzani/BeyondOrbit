import { Game } from './game.js';
async function boot() {
  try {
    const [systems, planets] = await Promise.all(
      ['systems', 'planets'].map(async (name) => {
        const response = await fetch(`data/${name}.json`);
        if (!response.ok) throw new Error(`Cannot load ${name}`);
        return response.json();
      }),
    );
    const game = new Game(systems, planets);
    await game.init();
    if (new URLSearchParams(location.search).has('test')) window.__game = game;
  } catch (error) {
    console.error(error);
    document.querySelector('#loading-destination').textContent =
      'Unable to load the universe';
    document.querySelector('#loading-caption').textContent =
      'Use npm start, open localhost:4173, and enable WebGL 2. See console for details.';
  }
}
boot();
