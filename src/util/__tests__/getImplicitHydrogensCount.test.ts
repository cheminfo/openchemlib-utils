import OCL from 'openchemlib';

import { getImplicitHydrogensCount } from '../getImplicitHydrogensCount';
import { toggleHydrogens } from '../toggleHydrogens';

test('getImplicitHydrogensCount and toggleHydrogens', () => {
  const molecule = OCL.Molecule.fromSmiles('CCC');
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
