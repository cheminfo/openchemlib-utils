import { test, expect } from 'vitest';

import { getUnsaturation } from '../getUnsaturation.js';

test('getUnsaturation', () => {
  expect(getUnsaturation('C6H6')).toBe(4);
  expect(getUnsaturation('C6H12')).toBe(1);
  expect(getUnsaturation('C6H12O')).toBe(1);
  expect(getUnsaturation('C6H12O3')).toBe(1);
  expect(getUnsaturation('C6H12O3N2')).toBe(2);
  expect(getUnsaturation('ClBrFIC6H8O3')).toBe(1);
  expect(getUnsaturation('CH3OH')).toBe(0);
  expect(getUnsaturation('CH3Cl')).toBe(0);
});
