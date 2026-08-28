import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { AUTO_LABEL_ENTRIES } from '../entries.ts';
import {
  DEFAULT_RUN_OPTIONS,
  runAutoLabel,
  runSingleEntry,
} from '../runAutoLabel.ts';

const CHOLESTANOL =
  'CC(C)CCC[C@@H](C)[C@H]1CC[C@H]2[C@@H]3CC[C@H]4C[C@@H](O)CC[C@]4(C)[C@H]3CC[C@]12C';
const CHOLESTEROL =
  'CC(C)CCC[C@@H](C)[C@H]1CC[C@H]2[C@@H]3CC=C4C[C@@H](O)CC[C@]4(C)[C@H]3CC[C@]12C';

test('5α-cholestan-3β-ol is labelled by entry 19, cholesterol', () => {
  const molecule = Molecule.fromSmiles(CHOLESTANOL);
  const result = runAutoLabel(molecule, DEFAULT_RUN_OPTIONS);

  expect(result.winnerIndex).toBe(19);
  expect(AUTO_LABEL_ENTRIES[19].label).toBe('cholesterol');
  expect(result.found).toBe(1);
  expect(result.labelledAtoms).toBe(27);
  expect(result.triedEntries).toBe(20);
  expect(result.nonUniqueLabels).toStrictEqual([]);
  expect(result.molfileWithLabels).toContain('V    1 27');
});

test('the winner shadows exactly six other entries', () => {
  const molecule = Molecule.fromSmiles(CHOLESTANOL);
  const result = runAutoLabel(molecule, DEFAULT_RUN_OPTIONS);

  expect(result.allMatches).toStrictEqual([19, 20, 21, 23, 34, 35, 46]);
  expect(
    result.allMatches.map((index) => AUTO_LABEL_ENTRIES[index].label),
  ).toStrictEqual([
    'cholesterol',
    'Cholestane',
    'Cholane',
    'Pregnane',
    'steroid',
    'Androstane',
    'steroid core',
  ]);
});

test('the caller molecule is never modified', () => {
  const molecule = Molecule.fromSmiles(CHOLESTANOL);
  const result = runAutoLabel(molecule, DEFAULT_RUN_OPTIONS);

  expect(result.molecule).not.toBe(molecule);

  let labelled = 0;
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) {
    if (molecule.getAtomCustomLabel(atom)) labelled++;
  }

  expect(labelled).toBe(0);
});

test('real cholesterol matches nothing at all', () => {
  const molecule = Molecule.fromSmiles(CHOLESTEROL);
  const result = runAutoLabel(molecule, DEFAULT_RUN_OPTIONS);

  expect(result.winnerIndex).toBeUndefined();
  expect(result.found).toBe(0);
  expect(result.labelledAtoms).toBe(0);
  expect(result.allMatches).toStrictEqual([]);
  expect(result.triedEntries).toBe(65);
});

test('runSingleEntry applies a shadowed entry', () => {
  const molecule = Molecule.fromSmiles(CHOLESTANOL);
  const result = runSingleEntry(molecule, 23, DEFAULT_RUN_OPTIONS);

  expect(AUTO_LABEL_ENTRIES[23].label).toBe('Pregnane');
  expect(result.winnerIndex).toBe(23);
  expect(result.found).toBe(1);
  expect(result.labelledAtoms).toBe(21);
  expect(result.triedEntries).toBe(1);
  expect(result.nonUniqueLabels).toStrictEqual([]);
  expect(result.allMatches).toStrictEqual([19, 20, 21, 23, 34, 35, 46]);
});

test('runSingleEntry reports an entry that cannot match', () => {
  const molecule = Molecule.fromSmiles(CHOLESTANOL);
  const result = runSingleEntry(molecule, 47, DEFAULT_RUN_OPTIONS);

  expect(AUTO_LABEL_ENTRIES[47].label).toBe('Gonane');
  expect(result.winnerIndex).toBeUndefined();
  expect(result.found).toBe(0);
  expect(result.labelledAtoms).toBe(0);
});

test('overlapping gives Pregnane a duplicate locant 21', () => {
  const molecule = Molecule.fromSmiles(CHOLESTANOL);
  const result = runSingleEntry(molecule, 23, {
    ...DEFAULT_RUN_OPTIONS,
    algorithm: 'overlapping',
  });

  expect(result.found).toBe(2);
  expect(result.labelledAtoms).toBe(22);
  expect(result.nonUniqueLabels).toStrictEqual(['21']);
});

test('prefix and suffix reach the applied labels', () => {
  const molecule = Molecule.fromSmiles(CHOLESTANOL);
  const result = runAutoLabel(molecule, {
    algorithm: 'separated',
    prefix: 'X',
    suffix: 'y',
  });

  expect(result.winnerIndex).toBe(19);

  const labels: string[] = [];
  for (let atom = 0; atom < result.molecule.getAllAtoms(); atom++) {
    const label = result.molecule.getAtomCustomLabel(atom);
    if (label) labels.push(label);
  }

  expect(labels).toHaveLength(27);
  expect(labels[0]).toBe('X27y');
});

test('runSingleEntry rejects an unknown index', () => {
  const molecule = Molecule.fromSmiles(CHOLESTANOL);

  expect(() => runSingleEntry(molecule, 65, DEFAULT_RUN_OPTIONS)).toThrow(
    'no autoLabel entry with index 65',
  );
});
