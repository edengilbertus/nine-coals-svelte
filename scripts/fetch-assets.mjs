import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const source = 'https://saastemp-zeta.vercel.app';
const media = ['smoke-black', 'match-flame', 'flames-black', 'embers-coals', 'hearth-meat', 'embers-dark', 'firewood', 'steak-flames', 'dining-candles', 'sardines', 'chef-flames', 'corn-coals', 'steak-tongs', 'dining-orange', 'meat-grill', 'grill-night', 'burning-wood'];
const cutouts = ['tomahawk-skillet', 'lamb-chops', 'lamb-rack', 'chicken-grill', 'spiced-fish', 'sausage-pan', 'bread', 'peppers-roasted', 'corn-charred', 'potato', 'chocolate-tart'];
async function save(url, path) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, new Uint8Array(await response.arrayBuffer()));
  console.log(path);
}
const assets = [...media.map(name => `/media/${name}.jpg`), ...cutouts.map(name => `/cutouts/${name}.webp`), '/favicon.ico'];
for (let i = 0; i < assets.length; i += 4) {
  await Promise.all(assets.slice(i, i + 4).map(path => save(source + path, `static${path}`)));
}
await save(`${source}/_next/static/immutable/media/e63b65bb308a9351-s.p.3strvg7o-g5v2.woff2`, 'static/fonts/instrument-serif-italic.woff2');
await save('https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/OFL.txt', 'static/fonts/instrument-serif-OFL.txt');
