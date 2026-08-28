import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { TopicMolecule } from '../../../src/topic/TopicMolecule.ts';
import { buildAtomRows } from '../rows.ts';
import {
  classifyTopicity,
  fromDisplayAtom,
  getSiblingHydrogens,
  toDisplayAtom,
} from '../topicity.ts';
import type { AtomRow } from '../types.ts';

function analyse(smiles: string) {
  const topicMolecule = new TopicMolecule(Molecule.fromSmiles(smiles));
  const moleculeWithH = topicMolecule.moleculeWithH;
  const rows: AtomRow[] = buildAtomRows({
    moleculeWithH,
    atomCountMolecule: topicMolecule.getMolecule().getAllAtoms(),
    symRanks: topicMolecule.heterotopicSymmetryRanks.slice(),
    finalRanks: topicMolecule.finalRanks.slice(),
    diaIDs: topicMolecule.diaIDs.slice(),
    enantioIDs: topicMolecule.enantioIDs.slice(),
    prochiralities: topicMolecule.prochiralities.slice(),
    diaIDsAndInfo: topicMolecule.diaIDsAndInfo.slice(),
    hoseCodes: undefined,
  });
  return {
    moleculeWithH,
    rows,
    diaIDs: topicMolecule.diaIDs.slice(),
    enantioIDs: topicMolecule.enantioIDs.slice(),
    atomCountMolecule: topicMolecule.getMolecule().getAllAtoms(),
  };
}

test('ethanol CH2 hydrogens 6 and 7 are enantiotopic', () => {
  const { diaIDs, enantioIDs } = analyse('CCO');

  expect(classifyTopicity(6, [7], diaIDs, enantioIDs)).toBe('enantiotopic');
  expect(classifyTopicity(7, [6], diaIDs, enantioIDs)).toBe('enantiotopic');
  expect(diaIDs[6]).toBe(diaIDs[7]);
  expect(enantioIDs[6]).not.toBe(enantioIDs[7]);
});

test('ethanol methyl hydrogens 3, 4 and 5 are homotopic', () => {
  const { diaIDs, enantioIDs } = analyse('CCO');

  expect(classifyTopicity(3, [4, 5], diaIDs, enantioIDs)).toBe('homotopic');
  expect(classifyTopicity(4, [3, 5], diaIDs, enantioIDs)).toBe('homotopic');
  expect(classifyTopicity(5, [3, 4], diaIDs, enantioIDs)).toBe('homotopic');
});

test('2-chlorobutane hydrogens 9 and 10 are diastereotopic', () => {
  const { diaIDs, enantioIDs } = analyse('CC(Cl)CC');

  expect(classifyTopicity(9, [10], diaIDs, enantioIDs)).toBe('diastereotopic');
  expect(classifyTopicity(10, [9], diaIDs, enantioIDs)).toBe('diastereotopic');
  expect(diaIDs[9]).not.toBe(diaIDs[10]);
});

test('a hydrogen without sibling is none', () => {
  const { diaIDs, enantioIDs } = analyse('CCO');

  expect(classifyTopicity(8, [], diaIDs, enantioIDs)).toBe('none');
});

test('missing IDs classify as none', () => {
  expect(classifyTopicity(0, [1], [], [])).toBe('none');
  expect(classifyTopicity(0, [1], ['a', 'a'], ['a'])).toBe('none');
  expect(classifyTopicity(0, [1], ['a'], ['a', 'a'])).toBe('none');
});

test('getSiblingHydrogens returns the exact sibling indices of ethanol', () => {
  const { moleculeWithH } = analyse('CCO');

  expect(getSiblingHydrogens(moleculeWithH, 3)).toStrictEqual([4, 5]);
  expect(getSiblingHydrogens(moleculeWithH, 4)).toStrictEqual([3, 5]);
  expect(getSiblingHydrogens(moleculeWithH, 6)).toStrictEqual([7]);
  expect(getSiblingHydrogens(moleculeWithH, 7)).toStrictEqual([6]);
  expect(getSiblingHydrogens(moleculeWithH, 8)).toStrictEqual([]);
  expect(getSiblingHydrogens(moleculeWithH, 0)).toStrictEqual([]);
});

test('getSiblingHydrogens returns the exact sibling indices of 2-chlorobutane', () => {
  const { moleculeWithH } = analyse('CC(Cl)CC');

  expect(getSiblingHydrogens(moleculeWithH, 9)).toStrictEqual([10]);
  expect(getSiblingHydrogens(moleculeWithH, 10)).toStrictEqual([9]);
  expect(getSiblingHydrogens(moleculeWithH, 8)).toStrictEqual([]);
  expect(getSiblingHydrogens(moleculeWithH, 5)).toStrictEqual([6, 7]);
});

test('toDisplayAtom maps a hidden hydrogen to its parent heavy atom', () => {
  const { rows, atomCountMolecule } = analyse('CCO');

  expect(atomCountMolecule).toBe(3);
  expect(toDisplayAtom(3, rows, atomCountMolecule, false)).toBe(0);
  expect(toDisplayAtom(5, rows, atomCountMolecule, false)).toBe(0);
  expect(toDisplayAtom(6, rows, atomCountMolecule, false)).toBe(1);
  expect(toDisplayAtom(7, rows, atomCountMolecule, false)).toBe(1);
  expect(toDisplayAtom(8, rows, atomCountMolecule, false)).toBe(2);
  expect(toDisplayAtom(1, rows, atomCountMolecule, false)).toBe(1);
  expect(toDisplayAtom(12, rows, atomCountMolecule, false)).toBeUndefined();
});

test('toDisplayAtom is the identity when hydrogens are shown', () => {
  const { rows, atomCountMolecule } = analyse('CCO');
  for (let atom = 0; atom < rows.length; atom++) {
    expect(toDisplayAtom(atom, rows, atomCountMolecule, true)).toBe(atom);
  }
});

test('fromDisplayAtom is the identity', () => {
  expect(fromDisplayAtom(0)).toBe(0);
  expect(fromDisplayAtom(7)).toBe(7);
});
