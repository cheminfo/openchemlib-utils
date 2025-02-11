import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Tests are generally slow because they have to load OCL each time.
    testTimeout: 15_000,
    include: ['./src/**/*.test.js', './src/**/*.test.ts'],
  },
});
