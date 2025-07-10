import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { getXAtomicNumber } from '../getXAtomicNumber.js';

test('getXAtomicNumber', () => {
  const molecule = Molecule.fromSmiles('CC');
  const xAtomicNumber = getXAtomicNumber(molecule);

  expect(xAtomicNumber).toBe(153);
});
