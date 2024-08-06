import { Molecule } from 'openchemlib';
import { test, expect } from 'vitest';

import { getXAtomicNumber } from '../getXAtomicNumber.js';

test('getXAtomicNumber', () => {
  const molecule = Molecule.fromSmiles('CC');
  const xAtomicNumber = getXAtomicNumber(molecule);
  expect(xAtomicNumber).toBe(153);
});
