import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      exclude: ['**/__tests__/**'],
      include: ['src/**'],
    },
    include: ['./src/**/*.test.js', './src/**/*.test.ts'],
  },
});
