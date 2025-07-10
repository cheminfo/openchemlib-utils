import OCL from 'openchemlib';
import { expect, test } from 'vitest';

import { getCharge } from '../getCharge';

test('getCharge', () => {
  expect(getCharge(OCL.Molecule.fromSmiles('CCCC'))).toBe(0);
  expect(getCharge(OCL.Molecule.fromSmiles('[NH4+]'))).toBe(1);
  expect(getCharge(OCL.Molecule.fromSmiles('[NH4+]C(=O)[O-]'))).toBe(0);
  expect(getCharge(OCL.Molecule.fromSmiles('[NH4+]C(=O)[O-].[NH4+]'))).toBe(1);
  expect(getCharge(OCL.Molecule.fromSmiles('[NH4+].[NH4+]'))).toBe(2);
});
