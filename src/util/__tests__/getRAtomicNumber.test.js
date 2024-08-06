import { Molecule } from 'openchemlib';
import { test, expect } from 'vitest';

import { getRAtomicNumber } from '../getRAtomicNumber.js';

test('getRAtomicNumber', () => {
  const molecule = Molecule.fromSmiles('CC');
  const rAtomicNumber = getRAtomicNumber(molecule);
  expect(rAtomicNumber).toBe(154);
});
