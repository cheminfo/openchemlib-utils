import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { labelPeptide } from '../labelPeptide.ts';
import { orderTwinBranches } from '../utils/orderTwinBranches.ts';

import { REFERENCE_BRANCHES } from './data/referenceBranches.ts';

test('the reference rows decode to the geometry they were built from', () => {
  for (const row of REFERENCE_BRANCHES) {
    const molecule = Molecule.fromIDCode(row.idCode, row.coordinates);
    const length = Math.hypot(
      molecule.getAtomX(row.branchOne) - molecule.getAtomX(row.centre),
      molecule.getAtomY(row.branchOne) - molecule.getAtomY(row.centre),
      molecule.getAtomZ(row.branchOne) - molecule.getAtomZ(row.centre),
    );

    expect(length).toBeGreaterThan(1.3);
    expect(length).toBeLessThan(1.7);
  }
});

test.each(REFERENCE_BRANCHES)(
  'branch 1 of $source is atom $branchOne',
  (row) => {
    const molecule = Molecule.fromIDCode(row.idCode, row.coordinates);
    const ordered = orderTwinBranches(
      molecule,
      row.centre,
      row.branchOne,
      row.branchTwo,
    );

    expect(ordered).toStrictEqual([row.branchOne, row.branchTwo]);
  },
);

test('the answer does not depend on which branch is passed first', () => {
  for (const row of REFERENCE_BRANCHES) {
    const molecule = Molecule.fromIDCode(row.idCode, row.coordinates);

    expect(
      orderTwinBranches(molecule, row.centre, row.branchTwo, row.branchOne),
    ).toStrictEqual([row.branchOne, row.branchTwo]);
  }
});

test('a structure that does not determine the order says so', () => {
  // A flat drawing carries a wedge on Ca only, so the centre of the two
  // valine methyls is undefined and no descriptor may be invented for it.
  const flat = Molecule.fromSmiles('N[C@@H](C(C)C)C(=O)O');

  expect(orderTwinBranches(flat, 2, 3, 4)).toBeNull();
});

test.each(REFERENCE_BRANCHES)(
  'labelPeptide numbers branch 1 of $source correctly',
  (row) => {
    const molecule = Molecule.fromIDCode(row.idCode, row.coordinates);
    const { atoms } = labelPeptide(molecule, {
      logger: { warn: () => null } as never,
    });
    const one = atoms.find(
      (atom) => atom.name === (row.code === 'VAL' ? 'Cγ1' : 'Cδ1'),
    );

    expect(one).toBeDefined();
    expect(one?.arbitrary).toBe(false);
    expect(one?.atom).toBe(row.branchOne);
  },
);

test('a flat drawing numbers the pair arbitrarily rather than guessing', () => {
  // Only Cα carries a wedge, so nothing fixes the two methyls of valine.
  const { atoms } = labelPeptide(Molecule.fromSmiles('N[C@@H](C(C)C)C(=O)O'), {
    logger: { warn: () => null } as never,
  });
  const methyls = atoms.filter((atom) => /^Cγ[12]$/.test(atom.name));

  expect(methyls).toHaveLength(2);
  expect(methyls.every((atom) => atom.arbitrary)).toBe(true);
});
