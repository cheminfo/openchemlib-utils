import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { labelPeptide } from '../labelPeptide.ts';

import { REFERENCE_RESIDUES } from './data/iupacAtomNames.ts';

// Locale-independent so the expected and computed lists sort identically.
function byCodePoint(first: string, second: string): number {
  if (first < second) return -1;
  return first > second ? 1 : 0;
}

test.each(REFERENCE_RESIDUES)('IUPAC 1998 identifiers of $code', (residue) => {
  const { atoms, residues } = labelPeptide(Molecule.fromSmiles(residue.smiles));

  expect(residues).toHaveLength(1);

  // Everything but the backbone, which the reference table lists apart.
  const backbone = new Set([
    'N',
    'C\u03B1',
    'C\u2032',
    'O',
    'O\u2032',
    'O\u2033',
    'H\u2033',
    'HN',
  ]);
  const sideChain = atoms
    .filter(
      (atom) =>
        !backbone.has(atom.name) &&
        !/^H\d$/.test(atom.name) &&
        !/^H\u03B1[23]?$/.test(atom.name),
    )
    .map((atom) => atom.name);
  const alphaHydrogens = atoms
    .filter((atom) => /^H\u03B1[23]?$/.test(atom.name))
    .map((atom) => atom.name);

  expect(sideChain.toSorted(byCodePoint)).toStrictEqual(
    residue.sideChain.toSorted(byCodePoint),
  );
  expect(alphaHydrogens.toSorted(byCodePoint)).toStrictEqual(
    residue.alphaHydrogens.toSorted(byCodePoint),
  );
});

test('backbone identifiers of a dipeptide', () => {
  const { atoms } = labelPeptide(
    Molecule.fromSmiles('C[C@@H](N)C(=O)NCC(=O)O'),
  );
  const namesOf = (residueNumber: number) =>
    atoms
      .filter((atom) => atom.residueNumber === residueNumber)
      .map((atom) => atom.name)
      .toSorted(byCodePoint);

  expect(namesOf(1)).toStrictEqual([
    'Cα',
    'Cβ',
    'C′',
    'H1',
    'H2',
    'Hα',
    'Hβ1',
    'Hβ2',
    'Hβ3',
    'N',
    'O',
  ]);
  expect(namesOf(2)).toStrictEqual([
    'Cα',
    'C′',
    'HN',
    'Hα2',
    'Hα3',
    'H″',
    'N',
    'O′',
    'O″',
  ]);
});

test('the default custom label is the residue number plus the descriptor', () => {
  const { atoms, molecule } = labelPeptide(
    Molecule.fromSmiles('C[C@@H](N)C(=O)NCC(=O)O'),
  );
  const beta2 = atoms.find((atom) => atom.name === 'Hβ2') as (typeof atoms)[0];

  expect(beta2.label).toBe(']1β2');
  expect(beta2.descriptor).toBe('β2');
  expect(molecule.getAtomCustomLabel(beta2.atom)).toBe(']1β2');
  // The element symbol is left out, openchemlib draws it.
  expect(atoms.find((atom) => atom.name === 'Cβ')?.label).toBe(']1β');
});

test('a custom format receives the structured identifier', () => {
  const { atoms } = labelPeptide(
    Molecule.fromSmiles('C[C@@H](N)C(=O)NCC(=O)O'),
    { format: (label) => `${label.residueNumber}:${label.name}` },
  );

  expect(atoms.find((atom) => atom.name === 'Hβ2')?.label).toBe('1:Hβ2');
});

test('Roman counterparts reproduce the PDB side-chain names', () => {
  const { atoms } = labelPeptide(
    Molecule.fromSmiles('CC[C@H](C)[C@@H](N)C(=O)O'),
    { naming: 'roman' },
  );
  const names = atoms.map((atom) => atom.name);

  expect(names).toContain('CB');
  expect(names).toContain('CG1');
  expect(names).toContain('CG2');
  expect(names).toContain('CD1');
  expect(names).toContain('HG12');
  expect(names).toContain('HG13');
  expect(names).toContain('HD11');
});

test('the PDB atom names leave the backbone unprimed', () => {
  const { atoms } = labelPeptide(
    Molecule.fromSmiles('C[C@@H](N)C(=O)NCC(=O)O'),
    { naming: 'pdb' },
  );
  const namesOf = (residueNumber: number) =>
    atoms
      .filter((atom) => atom.residueNumber === residueNumber)
      .map((atom) => atom.name)
      .toSorted(byCodePoint);

  expect(namesOf(1)).toStrictEqual([
    'C',
    'CA',
    'CB',
    'H1',
    'H2',
    'HA',
    'HB1',
    'HB2',
    'HB3',
    'N',
    'O',
  ]);
  // The amide hydrogen is `H`, and the acid is `OXT` carrying `HXT`.
  expect(namesOf(2)).toStrictEqual([
    'C',
    'CA',
    'H',
    'HA2',
    'HA3',
    'HXT',
    'N',
    'O',
    'OXT',
  ]);
});

test('the Roman counterparts keep the primes the PDB drops', () => {
  const { atoms } = labelPeptide(Molecule.fromSmiles('C[C@@H](N)C(=O)O'), {
    naming: 'roman',
  });
  const names = atoms.map((atom) => atom.name);

  expect(names).toContain("C'");
  expect(names).toContain("O'");
  expect(names).toContain("O''");
  expect(names).toContain("H''");
});

test('a molecule that is not a peptide is reported as such', () => {
  const logs: string[] = [];
  const { atoms, residues, unassignedAtoms } = labelPeptide(
    Molecule.fromSmiles('CCO'),
    { logger: { warn: (message: string) => logs.push(message) } as never },
  );

  expect(atoms).toStrictEqual([]);
  expect(residues).toStrictEqual([]);
  expect(unassignedAtoms).toHaveLength(9);
  expect(logs).toStrictEqual(['labelPeptide: no peptide backbone found']);
});

test('a capped, N-methylated peptide is labelled end to end', () => {
  // Me-Ala-Gly-Pro-Ph: an N-methyl on the first residue and a phenyl ketone on
  // the last, neither of which IUPAC names.
  const { atoms, unassignedAtoms, molecule } = labelPeptide(
    Molecule.fromSmiles('C[C@@H](C(NCC(N(CCC1)[C@@H]1C(c1ccccc1)=O)=O)=O)NC'),
    { logger: { warn: () => null } as never },
  );
  const byResidue = (number: number) =>
    atoms
      .filter((atom) => atom.residueNumber === number)
      .map((atom) => atom.name)
      .toSorted(byCodePoint);

  // N-methyl alanine: the amino acid is named, its N-methyl is not, so the
  // nitrogen keeps a single hydrogen and it is `H1`.
  expect(byResidue(1)).toStrictEqual([
    'Cα',
    'Cβ',
    'C′',
    'H1',
    'Hα',
    'Hβ1',
    'Hβ2',
    'Hβ3',
    'N',
    'O',
  ]);
  expect(byResidue(2)).toStrictEqual([
    'Cα',
    'C′',
    'HN',
    'Hα2',
    'Hα3',
    'N',
    'O',
  ]);
  // Proline: the ring is lettered from Cα, so the carbon bonded to the backbone
  // nitrogen is δ and not γ.
  expect(byResidue(3)).toContain('Cδ');
  expect(byResidue(3)).toContain('Hδ2');
  expect(byResidue(3)).toContain('Hδ3');

  // The N-methyl (CH3) and the phenyl ketone (C6H5) carry no identifier.
  expect(unassignedAtoms).toHaveLength(15);

  for (const atom of unassignedAtoms) {
    expect(molecule.getAtomCustomLabel(atom)).toBeNull();
  }
});

// Cyclosporin A: eleven residues closed head to tail, seven of them
// N-methylated. No residue opens the ring, so the walk has to pick a start.
const CYCLOSPORIN =
  'CC[C@H]1C(=O)N(CC(=O)N([C@H](C(=O)N[C@H](C(=O)N([C@H](C(=O)N[C@H](C(=O)N[C@@H](C(=O)N([C@H](C(=O)N([C@H](C(=O)N([C@H](C(=O)N([C@H](C(=O)N1)[C@@H]([C@H](C)C/C=C/C)O)C)C(C)C)C)CC(C)C)C)CC(C)C)C)C)C)CC(C)C)C)C(C)C)CC(C)C)C)C';

test('a head-to-tail cycle is numbered from one residue', () => {
  const warnings: string[] = [];
  const { residues, unassignedAtoms } = labelPeptide(
    Molecule.fromSmiles(CYCLOSPORIN),
    { logger: { warn: (message: string) => warnings.push(message) } as never },
  );

  expect(residues.map((residue) => residue.code)).toStrictEqual([
    'Ala',
    'Gly',
    'Leu',
    'Val',
    'Leu',
    'Ala',
    'Ala',
    'Leu',
    'Leu',
    'Val',
    'Leu',
  ]);

  // Every residue hands its carbonyl to the next, the last one back to the
  // first: that is what makes the chain a cycle.
  expect(residues.map((residue) => residue.alpha)).toStrictEqual([
    2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42,
  ]);
  expect(residues[0].nitrogen).toBe(45);

  // The seven N-methyls, the ethyl of Abu and the side chain of MeBmt.
  expect(unassignedAtoms).toHaveLength(42);
  expect(warnings).toStrictEqual([
    'labelPeptide: 42 atoms carry no IUPAC identifier',
  ]);
});

test('firstResidue rotates the cycle', () => {
  const { residues } = labelPeptide(Molecule.fromSmiles(CYCLOSPORIN), {
    firstResidue: 10,
    logger: { warn: () => null } as never,
  });

  expect(residues[0].alpha).toBe(10);
  expect(residues.map((residue) => residue.code)).toStrictEqual([
    'Leu',
    'Val',
    'Leu',
    'Ala',
    'Ala',
    'Leu',
    'Leu',
    'Val',
    'Leu',
    'Ala',
    'Gly',
  ]);
});
