import { Molecule } from 'openchemlib';
import { assert, expect, test } from 'vitest';

import { computeDiastereotopic } from '../computeDiastereotopic.ts';
import { DEFAULT_DIASTEREOTOPIC_OPTIONS } from '../types.ts';

function molfileOf(smiles: string): string {
  return Molecule.fromSmiles(smiles).toMolfile();
}

function describeAtoms(molecule: Molecule): string[] {
  molecule.ensureHelperArrays(Molecule.cHelperNeighbours);
  const described: string[] = [];
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) {
    const parent =
      molecule.getAtomicNo(atom) === 1
        ? molecule.getConnAtom(atom, 0)
        : undefined;
    described.push(`${molecule.getAtomLabel(atom)}<${parent}`);
  }
  return described;
}

test('an empty molfile yields the empty state', () => {
  expect(
    computeDiastereotopic('', DEFAULT_DIASTEREOTOPIC_OPTIONS),
  ).toStrictEqual({ kind: 'empty' });
  expect(
    computeDiastereotopic('   \n  ', DEFAULT_DIASTEREOTOPIC_OPTIONS).kind,
  ).toBe('empty');
});

test('a molfile without any atom yields the error state', () => {
  const result = computeDiastereotopic(
    'garbage',
    DEFAULT_DIASTEREOTOPIC_OPTIONS,
  );

  assert(result.kind === 'error');

  expect(result.step).toBe('Molecule.fromMolfile');
  expect(result.message).toBe(
    'the molfile parsed to a molecule without any atom',
  );
});

test('2-chlorobutane', () => {
  const result = computeDiastereotopic(
    molfileOf('CC(Cl)CC'),
    DEFAULT_DIASTEREOTOPIC_OPTIONS,
  );

  expect(result.kind).toBe('ok');

  assert(result.kind === 'ok');

  expect(result.overMaxNbAtoms).toBe(false);
  expect(result.summary.atomCountMolecule).toBe(5);
  expect(result.summary.atomCountMoleculeWithH).toBe(14);
  expect(result.molecule.getAllAtoms()).toBe(5);
  expect(result.moleculeWithH.getAllAtoms()).toBe(14);
  expect(result.moleculeForDisplay.getAllAtoms()).toBe(14);
  expect(result.rows).toHaveLength(14);

  expect(result.summary.distinctDiaIDs).toBe(10);
  expect(result.summary.distinctEnantioIDs).toBe(10);
  expect(result.summary.groupCount).toBe(10);
  expect(result.groups).toHaveLength(10);
  expect(result.summary.labelledCount).toBe(2);

  const labelled = result.rows.filter((row) => row.labelled);

  expect(labelled.map((row) => row.atom)).toStrictEqual([9, 10]);
  expect(result.rows[9].prochirality).toBe('r');
  expect(result.rows[10].prochirality).toBe('s');
  expect(result.rows[9].customLabel).toBe(']r');
  expect(result.rows[10].customLabel).toBe(']s');
  expect(result.rows[9].topicity).toBe('diastereotopic');
  expect(result.rows[10].topicity).toBe('diastereotopic');
  expect(result.rows[9].siblings).toStrictEqual([10]);
  expect(result.rows[9].parent).toBe(3);
  expect(result.rows[0].parent).toBeUndefined();
  expect(result.rows[0].inMolecule).toBe(true);
  expect(result.rows[5].inMolecule).toBe(false);
  expect(result.rows[9].diaID).not.toBe(result.rows[10].diaID);

  expect(result.summary.prochiralHydrogens).toBe(2);
  expect(result.summary.diastereotopicHydrogens).toBe(2);
  expect(result.summary.enantiotopicHydrogens).toBe(0);

  expect(result.chiralOrHeterotopicCarbons).toStrictEqual([1, 3]);
  expect(result.chiralCarbonsError).toBeUndefined();
  expect(result.distanceMatrix).toHaveLength(14);
  expect(result.distanceMatrix[9]).toStrictEqual([
    3, 2, 3, 1, 2, 4, 4, 4, 3, 0, 2, 3, 3, 3,
  ]);

  expect(result.hoseCodes).toBeUndefined();
  expect(result.spheres).toStrictEqual([0, 1, 2, 3, 4]);
  expect(result.logs).toStrictEqual([]);
  expect(result.timings.length).toBeGreaterThan(10);
  // The two labelled hydrogens are implicit, so only the expanded molfile changes.
  expect(result.molfilesBefore.molecule.v2000).toBe(
    result.molfilesAfter.molecule.v2000,
  );
  expect(result.molfilesBefore.moleculeWithH.v2000).not.toBe(
    result.molfilesAfter.moleculeWithH.v2000,
  );
  expect(result.molfilesAfter.moleculeWithoutH.v2000).toContain('V2000');
  expect(result.molfilesAfter.moleculeWithH.v3000).toContain('V3000');
});

test('the display molecule keeps the atom numbering of the rows', () => {
  const result = computeDiastereotopic(
    molfileOf('CC(Cl)CC'),
    DEFAULT_DIASTEREOTOPIC_OPTIONS,
  );
  assert(result.kind === 'ok');
  // A custom label makes a hydrogen non-plain, so ensureHelperArrays moves it ahead
  // of the plain hydrogens; the rendered molecule must not be subject to that.
  const expected = result.rows.map((row) => `${row.atomLabel}<${row.parent}`);

  expect(describeAtoms(result.moleculeForDisplay)).toStrictEqual(expected);
  expect(describeAtoms(result.moleculeWithH)).toStrictEqual(expected);
});

test('ethanol labels nothing by default and both CH2 hydrogens with includeEnantiotopic', () => {
  const molfile = molfileOf('CCO');
  const plain = computeDiastereotopic(molfile, DEFAULT_DIASTEREOTOPIC_OPTIONS);
  assert(plain.kind === 'ok');

  expect(plain.summary.labelledCount).toBe(0);
  expect(plain.summary.distinctDiaIDs).toBe(6);
  expect(plain.summary.distinctEnantioIDs).toBe(7);
  expect(plain.rows[6].topicity).toBe('enantiotopic');
  expect(plain.rows[3].topicity).toBe('homotopic');

  const withEnantiotopic = computeDiastereotopic(molfile, {
    ...DEFAULT_DIASTEREOTOPIC_OPTIONS,
    includeEnantiotopic: true,
  });
  assert(withEnantiotopic.kind === 'ok');

  expect(withEnantiotopic.summary.labelledCount).toBe(2);
  expect(
    withEnantiotopic.rows.filter((row) => row.labelled).map((row) => row.atom),
  ).toStrictEqual([6, 7]);
});

test('over maxNbAtoms every ID array is empty and the library logs three warnings', () => {
  const molfile = molfileOf(new Array(20).fill('C1CCCC1').join('.'));
  const result = computeDiastereotopic(molfile, DEFAULT_DIASTEREOTOPIC_OPTIONS);
  assert(result.kind === 'ok');

  expect(result.overMaxNbAtoms).toBe(true);
  expect(result.summary.atomCountMolecule).toBe(100);
  expect(result.summary.atomCountMoleculeWithH).toBe(300);
  expect(result.rows).toHaveLength(300);
  expect(result.summary.distinctDiaIDs).toBe(0);
  expect(result.summary.distinctEnantioIDs).toBe(0);
  expect(result.summary.labelledCount).toBe(0);
  expect(result.groups).toStrictEqual([]);
  expect(result.hydrogenGroups).toStrictEqual([]);
  expect(result.rows[0].diaID).toBeUndefined();
  expect(result.rows[0].enantioID).toBeUndefined();
  expect(result.rows[0].topicity).toBe('none');
  expect(result.rows[100].topicity).toBe('none');
  expect(result.rows[0].nbEquivalentAtoms).toBeUndefined();

  expect(result.logs).toHaveLength(3);
  expect(result.logs[0]).toStrictEqual({
    level: 'warn',
    message: 'too many atoms to evaluate heterotopic chiral bonds: 300 > 250',
  });
  expect(result.logs[1].message).toBe(
    'too many atoms to evaluate heterotopicity: 300 > 250',
  );
});

test('computeHoseCodes fills one code per sphere', () => {
  const result = computeDiastereotopic(molfileOf('CCO'), {
    ...DEFAULT_DIASTEREOTOPIC_OPTIONS,
    computeHoseCodes: true,
    minSphereSize: 1,
    maxSphereSize: 3,
  });
  assert(result.kind === 'ok');

  expect(result.spheres).toStrictEqual([1, 2, 3]);
  expect(result.hoseCodes).toHaveLength(9);
  expect(result.rows[0].hoseCodes).toHaveLength(3);
});
