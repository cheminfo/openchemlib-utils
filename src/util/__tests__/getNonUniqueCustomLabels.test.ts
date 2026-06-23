import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { applyFragmentLabels } from '../applyFragmentLabels.ts';
import { getNonUniqueCustomLabels } from '../getNonUniqueCustomLabels.ts';

test('no custom labels returns an empty array', () => {
  const molecule = Molecule.fromSmiles('CCC(=O)CC');

  expect(getNonUniqueCustomLabels(molecule)).toStrictEqual([]);
});

test('all unique custom labels returns an empty array', () => {
  const molecule = Molecule.fromSmiles('CCO');
  molecule.setAtomCustomLabel(0, 'a');
  molecule.setAtomCustomLabel(1, 'b');
  molecule.setAtomCustomLabel(2, 'c');

  expect(getNonUniqueCustomLabels(molecule)).toStrictEqual([]);
});

test('only the duplicated labels are reported', () => {
  const molecule = Molecule.fromSmiles('CCCCO');
  molecule.setAtomCustomLabel(0, 'dup');
  molecule.setAtomCustomLabel(1, 'unique');
  molecule.setAtomCustomLabel(2, 'dup');

  expect(getNonUniqueCustomLabels(molecule)).toStrictEqual(['dup']);
});

test('non-unique labels created by applyFragmentLabels', () => {
  const molecule = Molecule.fromSmiles('CCC(=O)CCCCCCC(=O)CC');
  const fragment = Molecule.fromSmiles('CCC(=O)');
  fragment.setAtomCustomLabel(0, 'β');
  fragment.setAtomCustomLabel(1, 'ɑ');
  fragment.setFragment(true);

  applyFragmentLabels(molecule, fragment);

  expect(getNonUniqueCustomLabels(molecule)).toStrictEqual(['β', 'ɑ']);
});
