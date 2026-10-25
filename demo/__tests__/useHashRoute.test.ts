import { expect, test } from 'vitest';

import { parseHash, toRouteId } from '../useHashRoute.ts';

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

test('the peptide route is recognised', () => {
  expect(parseHash('#/peptide')).toBe('peptide');
});

test('the diastereotopic route is recognised', () => {
  expect(parseHash('#/diastereotopic')).toBe('diastereotopic');
});

test('an unknown route falls back to the diastereotopic route', () => {
  expect(parseHash('#/nonsense')).toBe('diastereotopic');
});

test('the nmrhints route is recognised', () => {
  expect(parseHash('#/nmrhints')).toBe('nmrhints');
});

test('a tab id resolves to its route', () => {
  expect(toRouteId('nmrhints')).toBe('nmrhints');
  expect(toRouteId('autolabel')).toBe('autolabel');
  expect(toRouteId('peptide')).toBe('peptide');
  expect(toRouteId('nonsense')).toBe('diastereotopic');
});
