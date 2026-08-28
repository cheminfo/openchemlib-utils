import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const { version } = JSON.parse(
  readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8'),
) as { version: string };

// Derived from the first commit date (2020-01-20) so the dev server never
// collides with another cheminfo project: 0 + 01 + 20 = 00120, under 10000 so
// 10000 is added.
const PORT = 10120;

export default defineConfig({
  root: import.meta.dirname,
  plugins: [react()],
  define: {
    APP_VERSION: JSON.stringify(version),
  },
  server: {
    port: PORT,
  },
});
