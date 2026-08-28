import { expect, test } from 'vitest';

import { parseHash } from '../useHashRoute.ts';

test('an empty hash falls back to the diastereotopic route', () => {
  expect(parseHash('')).toBe('diastereotopic');
});

test('a bare hash falls back to the diastereotopic route', () => {
  expect(parseHash('#')).toBe('diastereotopic');
});

test('a hash root falls back to the diastereotopic route', () => {
  expect(parseHash('#/')).toBe('diastereotopic');
});

test('the autolabel route is recognised', () => {
  expect(parseHash('#/autolabel')).toBe('autolabel');
});

test('the diastereotopic route is recognised', () => {
  expect(parseHash('#/diastereotopic')).toBe('diastereotopic');
});

test('an unknown route falls back to the diastereotopic route', () => {
  expect(parseHash('#/nonsense')).toBe('diastereotopic');
});
