import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const buildRoot = '.next';
const standaloneRoot = join(buildRoot, 'standalone');
const assets = [
  [join(buildRoot, 'static'), join(standaloneRoot, '.next', 'static')],
  ['public', join(standaloneRoot, 'public')],
];

for (const [source, destination] of assets) {
  if (!existsSync(source)) throw new Error(`Missing build asset directory: ${source}`);
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true, force: true });
}
