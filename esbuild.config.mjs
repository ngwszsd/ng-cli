import {rm} from 'node:fs/promises';
import {build} from 'esbuild';

await rm('dist', {recursive: true, force: true});

await build({
  entryPoints: ['src/cli.tsx'],
  outfile: 'dist/cli.js',
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  packages: 'external',
  logLevel: 'info',
});
