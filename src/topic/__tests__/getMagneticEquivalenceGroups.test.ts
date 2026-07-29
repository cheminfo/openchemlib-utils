import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { TopicMolecule } from '../TopicMolecule.ts';
import { getMagneticEquivalenceGroups } from '../getMagneticEquivalenceGroups.ts';

function getTopicMolecule(smiles: string) {
  return new TopicMolecule(Molecule.fromSmiles(smiles));
}

function getHydrogenGroups(topicMolecule: TopicMolecule) {
  return topicMolecule.magneticEquivalenceGroups
    .filter((group) => group.atomLabel === 'H')
    .map((group) => group.atoms);
}

test('para-xylene, aromatic hydrogens are chemically but not magnetically equivalent', () => {
  const topicMolecule = getTopicMolecule('Cc1ccc(C)cc1');
  const diaIDs = topicMolecule.diaIDs;

  // the six methyl hydrogens share one diaID, the four aromatic ones another
  expect(new Set([8, 9, 10, 13, 14, 15].map((atom) => diaIDs[atom])).size).toBe(
    1,
  );
  expect(new Set([11, 12, 16, 17].map((atom) => diaIDs[atom])).size).toBe(1);

  // each methyl is one group, and every aromatic hydrogen is alone: AA'A''A'''
  expect(getHydrogenGroups(topicMolecule)).toStrictEqual([
    [8, 9, 10],
    [11],
    [12],
    [13, 14, 15],
    [16],
    [17],
  ]);
});

test('1-bromo-4-chlorobenzene is an AA-BB system', () => {
  const topicMolecule = getTopicMolecule('Clc1ccc(Br)cc1');
  const diaIDs = topicMolecule.diaIDs;

  // the hydrogens are chemically equivalent two by two
  expect(diaIDs[8]).toBe(diaIDs[11]);
  expect(diaIDs[9]).toBe(diaIDs[10]);
  expect(diaIDs[8]).not.toBe(diaIDs[9]);

  // but none of them is magnetically equivalent to any other
  expect(getHydrogenGroups(topicMolecule)).toStrictEqual([
    [8],
    [9],
    [10],
    [11],
  ]);
});

test('2-chlorobutane, methyls group, diastereotopic CH2 hydrogens do not', () => {
  const topicMolecule = getTopicMolecule('CC(Cl)CC');
  const diaIDs = topicMolecule.diaIDs;

  // the two hydrogens of the CH2 are diastereotopic, so not even chemically equivalent
  expect(diaIDs[9]).not.toBe(diaIDs[10]);

  expect(getHydrogenGroups(topicMolecule)).toStrictEqual([
    [5, 6, 7],
    [8],
    [9],
    [10],
    [11, 12, 13],
  ]);
});

test('but-2-ene, each methyl is a group, the two vinyl hydrogens are not equivalent', () => {
  for (const smiles of ['C/C=C/C', String.raw`C/C=C\C`]) {
    const topicMolecule = getTopicMolecule(smiles);
    const diaIDs = topicMolecule.diaIDs;

    // the six methyl hydrogens are chemically equivalent, and so are the two vinyl ones
    expect(new Set([4, 5, 6, 9, 10, 11].map((atom) => diaIDs[atom])).size).toBe(
      1,
    );
    expect(diaIDs[7]).toBe(diaIDs[8]);

    // the two methyls stay apart because they couple differently to each vinyl hydrogen
    expect(getHydrogenGroups(topicMolecule)).toStrictEqual([
      [4, 5, 6],
      [7],
      [8],
      [9, 10, 11],
    ]);
  }
});

test('ethanol, the CH2 hydrogens are magnetically equivalent', () => {
  const topicMolecule = getTopicMolecule('CCO');

  expect(getHydrogenGroups(topicMolecule)).toStrictEqual([
    [3, 4, 5],
    [6, 7],
    [8],
  ]);
});

test('benzene, all hydrogens share a diaID but ortho, meta and para couplings differ', () => {
  const topicMolecule = getTopicMolecule('c1ccccc1');
  const diaIDs = topicMolecule.diaIDs;

  expect(new Set([6, 7, 8, 9, 10, 11].map((atom) => diaIDs[atom])).size).toBe(
    1,
  );
  expect(getHydrogenGroups(topicMolecule)).toStrictEqual([
    [6],
    [7],
    [8],
    [9],
    [10],
    [11],
  ]);
});

test('the groups are a partition of all the atoms, hydrogens included', () => {
  const topicMolecule = getTopicMolecule('Cc1ccc(C)cc1');
  const groups = topicMolecule.magneticEquivalenceGroups;

  const atoms = groups
    .flatMap((group) => group.atoms)
    .toSorted((a, b) => a - b);

  expect(atoms).toStrictEqual(
    Array.from(
      { length: topicMolecule.moleculeWithH.getAllAtoms() },
      (_, i) => i,
    ),
  );

  for (const group of groups) {
    expect(
      new Set(group.atoms.map((atom) => topicMolecule.diaIDs[atom])).size,
    ).toBe(1);
  }
});

test('smaller hose codes and shorter coupling paths give the same p-xylene groups', () => {
  const topicMolecule = getTopicMolecule('Cc1ccc(C)cc1');

  const groups = getMagneticEquivalenceGroups(topicMolecule, {
    maxSphereSize: 2,
    maxPathLength: 4,
  });

  expect(
    groups
      .filter((group) => group.atomLabel === 'H')
      .map((group) => group.atoms),
  ).toStrictEqual([[8, 9, 10], [11], [12], [13, 14, 15], [16], [17]]);
});

test('maxPathLength cannot exceed the one of the TopicMolecule', () => {
  const topicMolecule = getTopicMolecule('CCO');

  expect(() =>
    topicMolecule.getMagneticEquivalenceGroups({ maxPathLength: 6 }),
  ).toThrow(
    'maxPathLength cannot be larger than the one defined in topicMolecule: 5',
  );
});
