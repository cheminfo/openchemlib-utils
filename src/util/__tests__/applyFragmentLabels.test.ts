import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { applyFragmentLabels } from '../applyFragmentLabels.ts';

test('default option find all matching', () => {
  const molecule = Molecule.fromSmiles('CCC(=O)CCCCCCC(=O)CC');
  const fragment = Molecule.fromSmiles('CCC(=O)');
  fragment.setAtomCustomLabel(0, 'β');
  fragment.setAtomCustomLabel(1, 'ɑ');
  fragment.setFragment(true);

  const found = applyFragmentLabels(molecule, fragment);

  expect(found).toBe(4);

  const labels = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    labels.push(molecule.getAtomCustomLabel(i));
  }

  expect(labels).toStrictEqual([
    'β',
    'ɑ',
    null,
    null,
    'ɑ',
    'β',
    null,
    null,
    'β',
    'ɑ',
    null,
    null,
    'ɑ',
    'β',
  ]);
  expect(molecule.toMolfile()).toMatchSnapshot();
});

test('separated, we can not reuse twice the same atoms', () => {
  const molecule = Molecule.fromSmiles('CCC(=O)CCCCCCC(=O)CC');
  const fragment = Molecule.fromSmiles('CCC(=O)');
  fragment.setAtomCustomLabel(0, 'β');
  fragment.setAtomCustomLabel(1, 'ɑ');
  fragment.setFragment(true);

  const found = applyFragmentLabels(molecule, fragment, {
    algorithm: 'separated',
  });

  expect(found).toBe(2);

  const labels = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    labels.push(molecule.getAtomCustomLabel(i));
  }

  expect(labels).toStrictEqual([
    'β',
    'ɑ',
    null,
    null,
    null,
    null,
    null,
    null,
    'β',
    'ɑ',
    null,
    null,
    null,
    null,
  ]);
  expect(molecule.toMolfile()).toMatchSnapshot();
});

test('with prefix and suffix', () => {
  const molecule = Molecule.fromSmiles('CCC(=O)CCCCCCC(=O)CC');
  const fragment = Molecule.fromSmiles('CCC(=O)');
  fragment.setAtomCustomLabel(0, 'B');
  fragment.setAtomCustomLabel(1, 'A');
  fragment.setFragment(true);

  const found = applyFragmentLabels(molecule, fragment, {
    prefix: 'pre-',
    suffix: '-suf',
  });

  expect(found).toBe(4);

  const labels = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    labels.push(molecule.getAtomCustomLabel(i));
  }

  expect(labels).toStrictEqual([
    'pre-B-suf',
    'pre-A-suf',
    null,
    null,
    'pre-A-suf',
    'pre-B-suf',
    null,
    null,
    'pre-B-suf',
    'pre-A-suf',
    null,
    null,
    'pre-A-suf',
    'pre-B-suf',
  ]);
  expect(molecule.toMolfile()).toMatchSnapshot();
});
