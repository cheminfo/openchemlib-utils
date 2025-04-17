import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { getAllAtomsPaths } from '../getAllAtomsPaths.js';

test('ethanol', () => {
  const molecule = Molecule.fromSmiles('CCO');
  const allAtomsPaths = getAllAtomsPaths(molecule);
  expect(allAtomsPaths).toHaveLength(3);
  expect(allAtomsPaths).toMatchSnapshot();
  const flatten = allAtomsPaths.flat();
  expect(flatten).toHaveLength(18);
});

test('isotopropyl alcohol with hydrogens', () => {
  const molecule = Molecule.fromSmiles('CC(C)O');
  molecule.addImplicitHydrogens();
  const allAtomsPaths = getAllAtomsPaths(molecule);
  expect(allAtomsPaths).toHaveLength(12);
  const flatten = allAtomsPaths.flat().flat();
  expect(flatten).toHaveLength(122);
});

test('isotopropyl alcohol with hydrogens, maxPathLength: 2', () => {
  const molecule = Molecule.fromSmiles('CC(C)O');
  molecule.addImplicitHydrogens();
  const allAtomsPaths = getAllAtomsPaths(molecule, { maxPathLength: 2 });
  expect(allAtomsPaths).toHaveLength(12);
  const flatten = allAtomsPaths.flat().flat();
  expect(flatten).toHaveLength(68);
});

test('cyclosporin with hydrogens', () => {
  const molfile = readFileSync(join(__dirname, 'data/cyclosporin.mol'), 'utf8');
  const molecule = Molecule.fromMolfile(molfile);
  molecule.addImplicitHydrogens();
  const start = Date.now();
  const allAtomsPaths = getAllAtomsPaths(molecule);
  expect(allAtomsPaths).toHaveLength(196);
  const flatten = allAtomsPaths.flat().flat();
  expect(flatten).toHaveLength(5098);
  expect(Date.now() - start).toBeLessThan(50);
});
