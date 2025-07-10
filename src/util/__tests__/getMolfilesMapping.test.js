import OCL, { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { getMolfilesMapping } from '../getMolfilesMapping';

// view to debug: https://my.cheminfo.org/?viewURL=https%3A%2F%2Fmyviews.cheminfo.org%2Fdb%2Fvisualizer%2Fentry%2F5aa275a236efa574581f4fd4f20a7045%2Fview.json
test('getMolfilesMapping', () => {
  const fromMolfile = `
  ChemDraw12102416212D

  6  5  0  0  0  0  0  0  0  0999 V2000
   -0.3572   -0.6188    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.3572   -0.2062    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.0717   -0.6188    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.3572    0.6188    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    1.0717    0.2063    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -1.0717   -0.2062    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0        0
  2  3  1  0        0
  2  4  1  0        0
  2  5  1  0        0
  1  6  1  0        0
M  END`;

  const toMolfile = `
  ChemDraw12102416212D

  6  5  0  0  0  0  0  0  0  0999 V2000
    0.0000   -0.2062    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.7145    0.2062    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.7145    1.0312    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7145    0.2062    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -1.0312    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.6188    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0        0
  2  3  1  0        0
  1  4  1  0        0
  1  5  1  0        0
  1  6  1  0        0
M  END`;

  const { fromTo, toFrom } = getMolfilesMapping(OCL, fromMolfile, toMolfile);

  expect(fromTo).toStrictEqual([1, 0, 3, 4, 5, 2]);
  expect(toFrom).toStrictEqual([1, 0, 5, 2, 3, 4]);
});

test('toluene', () => {
  const aromatic = Molecule.fromSmiles('c1ccccc1C').toMolfile();
  const localized = Molecule.fromSmiles('CC1=CC=CC=C1').toMolfile();
  const { fromTo, toFrom } = getMolfilesMapping(OCL, aromatic, localized);

  expect(fromTo).toStrictEqual([2, 3, 4, 5, 6, 1, 0]);
  expect(toFrom).toStrictEqual([6, 5, 0, 1, 2, 3, 4]);
});

test('starting with H', () => {
  const fromMolfile = `
  ChemDraw12112408172D

  3  2  0  0  0  0  0  0  0  0999 V2000
   -0.7145   -0.2062    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.2062    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.7145   -0.2062    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0        0
  2  3  1  0        0
M  END
`;

  const toMolfile = `
  ChemDraw12112408172D

  3  2  0  0  0  0  0  0  0  0999 V2000
   -0.7145   -0.2062    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.2062    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    0.7145   -0.2062    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0        0
  2  3  1  0        0
M  END
`;

  const { fromTo, toFrom } = getMolfilesMapping(OCL, fromMolfile, toMolfile);

  expect(fromTo).toStrictEqual([2, 1, 0]);
  expect(toFrom).toStrictEqual([2, 1, 0]);
});

test('testing different molecules', () => {
  const methane = Molecule.fromSmiles('C').toMolfile();
  const water = Molecule.fromSmiles('O').toMolfile();

  expect(() => getMolfilesMapping(OCL, methane, water)).toThrow(
    'Molecules are different',
  );
});

test('testing with and without hydrogens', () => {
  const methane = Molecule.fromSmiles('C').toMolfile();
  const methaneMolecule = Molecule.fromSmiles('C');
  methaneMolecule.addImplicitHydrogens();
  const methaneWithHydrogens = methaneMolecule.toMolfile();

  expect(() => getMolfilesMapping(OCL, methane, methaneWithHydrogens)).toThrow(
    'Molecules do not have the same explicit hydrogens',
  );
});
