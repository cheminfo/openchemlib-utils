import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { ensureMapNo } from '../ensureMapNo.ts';

test('assigns mapNo to all atoms when none are set', () => {
  const molecule = Molecule.fromSmiles('CCO');
  ensureMapNo(molecule);

  const mapNos = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    mapNos.push(molecule.getAtomMapNo(i));
  }

  expect(mapNos).toStrictEqual([1, 2, 3]);
});

test('preserves existing mapNo and fills gaps', () => {
  const molecule = Molecule.fromSmiles('CCO');
  molecule.setAtomMapNo(1, 5, false);
  ensureMapNo(molecule);

  const mapNos = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    mapNos.push(molecule.getAtomMapNo(i));
  }

  expect(mapNos).toStrictEqual([1, 5, 2]);
});

test('throws on duplicate mapNo', () => {
  const molecule = Molecule.fromSmiles('CCO');
  molecule.setAtomMapNo(0, 3, false);
  molecule.setAtomMapNo(1, 3, false);

  expect(() => ensureMapNo(molecule)).toThrow(
    'The molecule contains several atoms with the same mapNo',
  );
});
