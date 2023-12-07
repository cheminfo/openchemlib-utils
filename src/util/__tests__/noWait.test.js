import { expect, it } from 'vitest';

import { noWait } from '../noWait.js';

it('noWait', async () => {
  const start = performance.now();
  for (let i = 0; i < 10000; i++) {
    // eslint-disable-next-line no-await-in-loop
    await noWait();
  }
  const end = performance.now();
  expect(end - start).toBeLessThan(1000);
});
