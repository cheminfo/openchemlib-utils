import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      include: ['src/**'],
    },
    include: ['./src/**/*.test.js', './src/**/*.test.ts'],
  },
});
