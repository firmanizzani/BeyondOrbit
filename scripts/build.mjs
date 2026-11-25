import { cp, mkdir, readFile, readdir, stat } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
await mkdir(output, { recursive: true });
for (const path of ['index.html', 'css', 'js', 'data', 'vendor']) {
  await cp(resolve(root, path), resolve(output, path), { recursive: true, force: true });
}

async function files(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await files(path)));
    else result.push(path);
  }
  return result;
}

let checked = 0;
for (const path of await files(output)) {
  if (!/\.(html|js|css)$/.test(path)) continue;
  const source = await readFile(path, 'utf8');
  const references = path.endsWith('.html')
    ? [...source.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map((m) => m[1])
    : path.endsWith('.js')
      ? [...source.matchAll(/(?:from\s*|import\s*)["'](\.[^"']+)["']/g)].map((m) => m[1])
      : [];
  for (const reference of references) {
    if (reference.startsWith('#') || reference.startsWith('data:')) continue;
    if (/^https?:/.test(reference))
      throw new Error(`Unexpected external runtime asset: ${reference}`);
    const target = resolve(dirname(path), reference.split(/[?#]/)[0]);
    if (!target.startsWith(output + sep))
      throw new Error(`Asset leaves output directory: ${reference}`);
    if (!(await stat(target)).isFile())
      throw new Error(`Missing asset: ${relative(output, target)}`);
    checked++;
  }
}
const planets = JSON.parse(await readFile(resolve(output, 'data/planets.json'), 'utf8'));
const systems = JSON.parse(await readFile(resolve(output, 'data/systems.json'), 'utf8'));
if (planets.length !== 24 || systems.length !== 5)
  throw new Error('Incomplete universe catalog');
console.log(
  `Static deployment ready: dist/ (${checked} local asset references verified; 5 systems, 24 planets).`,
);
