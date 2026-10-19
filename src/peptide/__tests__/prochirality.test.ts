import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { labelPeptide } from '../labelPeptide.ts';

/**
 * The IUPAC 1998 rule numbers the prochiral hydrogens after the substituent
 * leading to the main chain, not after the CIP priority, so `Hβ2` is the pro-R
 * hydrogen only when Cα also outranks the β substituent. Fig. 1 marks the pro-R
 * hydrogen of Ser, Cys and Asp as `Hβ3` for exactly that reason.
 */
const EXPECTED = [
  { code: 'Gly', smiles: 'NCC(=O)O', proR: ['Hα2'] },
  { code: 'Ser', smiles: 'N[C@@H](CO)C(=O)O', proR: ['Hβ3'] },
  { code: 'Cys', smiles: 'N[C@@H](CS)C(=O)O', proR: ['Hβ3'] },
  { code: 'Asp', smiles: 'N[C@@H](CC(=O)O)C(=O)O', proR: ['Hβ3'] },
  { code: 'Glu', smiles: 'N[C@@H](CCC(=O)O)C(=O)O', proR: ['Hβ2', 'Hγ3'] },
  { code: 'Gln', smiles: 'N[C@@H](CCC(N)=O)C(=O)O', proR: ['Hβ2', 'Hγ3'] },
  { code: 'Leu', smiles: 'N[C@@H](CC(C)C)C(=O)O', proR: ['Hβ2'] },
  { code: 'Phe', smiles: 'N[C@@H](Cc1ccccc1)C(=O)O', proR: ['Hβ2'] },
  {
    code: 'Lys',
    smiles: 'N[C@@H](CCCCN)C(=O)O',
    proR: ['Hβ2', 'Hγ2', 'Hδ3', 'Hε3'],
  },
];

function byCodePoint(first: string, second: string): number {
  if (first < second) return -1;
  return first > second ? 1 : 0;
}

test.each(EXPECTED)('pro-R hydrogens of $code are $proR', (residue) => {
  const { atoms } = labelPeptide(Molecule.fromSmiles(residue.smiles));
  const proR = atoms
    .filter((atom) => atom.proChirality === 'R')
    .map((atom) => atom.name)
    .toSorted(byCodePoint);
  const proS = atoms
    .filter((atom) => atom.proChirality === 'S')
    .map((atom) => atom.name)
    .toSorted(byCodePoint);

  expect(proR).toStrictEqual(residue.proR.toSorted(byCodePoint));
  // Every prochiral pair is complete: one R and one S.
  expect(proS).toHaveLength(residue.proR.length);

  for (const name of proR) {
    const partner = name.endsWith('2')
      ? `${name.slice(0, -1)}3`
      : `${name.slice(0, -1)}2`;

    expect(proS).toContain(partner);
  }
});
