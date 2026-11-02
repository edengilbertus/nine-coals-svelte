import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? files(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`]))).flat();
}
const version = JSON.parse(await readFile('node_modules/svelte/package.json', 'utf8')).version;
const requested = process.argv.slice(2).filter(argument => !argument.startsWith('-'));
const targets = requested.length ? requested : (await files('src')).filter(file => /\.svelte(?:\.[jt]s)?$/.test(file));
for (const file of targets) {
  console.log(`\n${file}`);
  const result = spawnSync('bunx', ['--bun', '@sveltejs/mcp', 'svelte-autofixer', file, '--svelte-version', version], { encoding: 'utf8' });
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  if (result.status !== 0) process.exit(result.status ?? 1);
}
