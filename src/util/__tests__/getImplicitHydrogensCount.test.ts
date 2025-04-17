import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { getImplicitHydrogensCount } from '../getImplicitHydrogensCount.js';
import { toggleHydrogens } from '../toggleHydrogens.js';

test('getImplicitHydrogensCount and toggleHydrogens', () => {
  const molecule = Molecule.fromSmiles('CCC');
  expect(getImplicitHydrogensCount(molecule, 0)).toBe(3);
  expect(getImplicitHydrogensCount(molecule, 1)).toBe(2);
  expect(getImplicitHydrogensCount(molecule, 2)).toBe(3);
  toggleHydrogens(molecule, 0);
  expect(getImplicitHydrogensCount(molecule, 0)).toBe(0);
  expect(getImplicitHydrogensCount(molecule, 1)).toBe(2);
  expect(getImplicitHydrogensCount(molecule, 2)).toBe(3);
  toggleHydrogens(molecule, 0);
  expect(getImplicitHydrogensCount(molecule, 0)).toBe(3);
  expect(getImplicitHydrogensCount(molecule, 1)).toBe(2);
  expect(getImplicitHydrogensCount(molecule, 2)).toBe(3);
  toggleHydrogens(molecule, 1);
  expect(getImplicitHydrogensCount(molecule, 0)).toBe(3);
  expect(getImplicitHydrogensCount(molecule, 1)).toBe(0);
  expect(getImplicitHydrogensCount(molecule, 2)).toBe(3);
});
