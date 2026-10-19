# openchemlib-utils

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

.

## Installation

`$ npm i openchemlib-utils`

## Usage

```js
import { Molecule } from 'openchemlib';
import { getPathsInfo } from 'openchemlib-utils';

const molecule = Molecule.fromSmiles('CCCCC');

const paths = getPathsInfo(molecule, {
  fromLabel: 'H',
  toLabel: 'H',
  minLength: 1,
  maxLength: 4,
});

console.log(paths);
```

We will add more examples in `/examples`.

## Peptides

`labelPeptide` perceives the residues of a peptide and writes the IUPAC
identifier of every atom as an openchemlib custom label. Residues are numbered
from the N-terminus, side chains are lettered `α`, `β`, `γ`, … and prochiral
hydrogens are numbered `2`/`3`.

```js
import { Molecule } from 'openchemlib';
import { labelPeptide } from 'openchemlib-utils';

// H-Ala-Gly-OH
const { molecule, atoms } = labelPeptide(
  Molecule.fromSmiles('C[C@@H](N)C(=O)NCC(=O)O'),
);

console.log(atoms.map((atom) => `${atom.residueNumber}${atom.name}`).join(' '));
// 1Cβ 1Cα 1N 1C′ 1O 1Hβ1 1Hβ2 1Hβ3 1Hα 1H1 1H2
// 2N 2Cα 2C′ 2O′ 2O″ 2HN 2Hα3 2Hα2 2H″

// `molecule` is a copy with explicit hydrogens whose custom labels are `]1β2`,
// which openchemlib draws as a superscript next to the atom symbol.
```

The numbering of the prochiral hydrogens follows the **main-chain precedence
rule** of the [IUPAC Recommendations 1998][iupac] (Markley et al., _Pure Appl.
Chem._ **70**:117): the substituent leading to the main chain takes precedence,
not the one with the highest CIP priority. `Hβ2` is therefore the pro-R hydrogen
of Glu but the pro-S hydrogen of Ser, Cys and Asp; every label carries its CIP
descriptor in `proChirality`.

Only the amino acids are named. Groups grafted on the backbone — an N-methyl, an
acyl or amide cap, a phenyl ketone — get no invented identifier: they are left
unlabelled and listed in `unassignedAtoms`. Numbers that a 2D structure cannot
fix, such as the `δ1`/`δ2` of a phenylalanine ring, are flagged `arbitrary` but
stay stable across runs.

Options: `naming`, one of `greek` (the default: `Cβ`, `Hγ2`, `C′`), `roman`
(the Greek letters transliterated: `CB`, `HB2`, `C'`) or `pdb` (the PDB atom
names, which also leave the backbone unprimed: `CB`, `HB2`, `C`, `O`, `OXT`,
`HXT` and `H`); `format` to build the custom label yourself; `firstResidue` to
choose which residue of a cyclic peptide is numbered `1`.

To start from an abbreviation such as `HAlaGlyOH` rather than from a structure,
build the molecule with [`sequence-to-molecule`][sequence-to-molecule] and pass
it here:

```js
import * as OCL from 'openchemlib';
import { sequenceToMolecule } from 'sequence-to-molecule';
import { labelPeptide } from 'openchemlib-utils';

const { molecule } = sequenceToMolecule(OCL, 'MeAlaGlyProPh');
const { atoms } = labelPeptide(molecule);
```

`npm run dev` starts the debug playground (`demo/`); its _Peptide labelling_ tab
(`#/peptide`) labels an idcode, a SMILES or a molfile and renders it with
`react-ocl`, atom by atom.

[iupac]: https://publications.iupac.org/pac/1998/pdf/7001x0117.pdf
[sequence-to-molecule]: https://github.com/cheminfo/sequence-to-molecule

## [API Documentation](https://cheminfo.github.io/openchemlib-utils/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/openchemlib-utils.svg
[npm-url]: https://www.npmjs.com/package/openchemlib-utils
[ci-image]: https://github.com/cheminfo/openchemlib-utils/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/openchemlib-utils/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/openchemlib-utils.svg
[download-url]: https://www.npmjs.com/package/openchemlib-utils
