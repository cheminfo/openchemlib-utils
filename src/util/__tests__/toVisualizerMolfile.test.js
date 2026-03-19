import OCL from 'openchemlib';
import { expect, test } from 'vitest';

import { toVisualizerMolfile } from '../toVisualizerMolfile';

test('diastereotopic grouping on propane', () => {
  const molecule = OCL.Molecule.fromSmiles('CCC');
  const molfile = toVisualizerMolfile(molecule, { diastereotopic: true });

  expect(molfile._atoms).toStrictEqual({
    'eM@Df`Xb`RP\\Jh': [0, 2],
    'eM@HzAbJC}IApj`': [1],
});
  expect(molfile._highlight).toStrictEqual([
    'eM@Df`Xb`RP\\Jh',
    'eM@HzAbJC}IApj`',
  ]);
});

test('atomMapNo grouping on propane', () => {
  const molecule = OCL.Molecule.fromSmiles('CCC');
  // Assign same map number to the two terminal carbons, different one to the central carbon
  molecule.setAtomMapNo(0, 1, false);
  molecule.setAtomMapNo(1, 2, false);
  molecule.setAtomMapNo(2, 1, false);
  const molfile = toVisualizerMolfile(molecule, { atomMapNo: true });

  expect(molfile._highlight).toStrictEqual([1, 2]);
  expect(molfile._atoms).toStrictEqual({
    1: [0, 2],
    2: [1],
});
});

test('customAtomLabel grouping on propane', () => {
  const molecule = OCL.Molecule.fromSmiles('CCC');
  molecule.setAtomCustomLabel(0, 'alpha');
  molecule.setAtomCustomLabel(1, 'beta');
  molecule.setAtomCustomLabel(2, 'alpha');
  const molfile = toVisualizerMolfile(molecule, { customAtomLabel: true });

  expect(molfile._highlight).toStrictEqual(['alpha', 'beta']);
  expect(molfile._atoms).toStrictEqual({
    alpha: [0, 2],
    beta: [1],
});
});

test('heavyAtomHydrogen with diastereotopic on propane', () => {
  const molecule = OCL.Molecule.fromSmiles('CCC');
  const molfile = toVisualizerMolfile(molecule, {
    heavyAtomHydrogen: true,
    diastereotopic: true,
});

  expect(molfile._atoms).toStrictEqual({
    'eM@Df`Xb`RP\\Jh': [0, 2],
    'gC`HALiKT@RHDRj@': [0, 2],
    'eM@HzAbJC}IApj`': [1],
    'gC`HALiMT@RHDRj@': [1],
});
  expect(molfile._highlight).toStrictEqual([
    'eM@Df`Xb`RP\\Jh',
    'eM@HzAbJC}IApj`',
    'gC`HALiKT@RHDRj@',
    'gC`HALiMT@RHDRj@',
  ]);
});

test('collapseHydrogens transfers customAtomLabel to heavy atoms', () => {
  const molecule = OCL.Molecule.fromSmiles('CCC');
  molecule.addImplicitHydrogens();
  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
  let labelCount = 0;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) !== 1) continue;
    const parent = molecule.getConnAtom(i, 0);
    if (parent === 0 && labelCount === 0) {
      molecule.setAtomCustomLabel(i, 'Ha');
      labelCount++;
    } else if (parent === 1 && labelCount === 1) {
      molecule.setAtomCustomLabel(i, 'Hb');
      labelCount++;
    }
    if (labelCount === 2) break;
  }
  const molfile = toVisualizerMolfile(molecule, {
    customAtomLabel: true,
    collapseHydrogens: true,
});

  expect(molfile._highlight).toStrictEqual(['Ha', 'Hb']);
  expect(molfile._atoms).toStrictEqual({
    Ha: [0],
    Hb: [1],
});
});

test('collapseHydrogens transfers atomMapNo to heavy atoms', () => {
  const molecule = OCL.Molecule.fromSmiles('CCC');
  molecule.addImplicitHydrogens();
  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (molecule.getAtomicNo(i) !== 1) continue;
    const parent = molecule.getConnAtom(i, 0);
    if (parent === 0) {
      molecule.setAtomMapNo(i, 1, false);
      break;
    }
  }
  const molfile = toVisualizerMolfile(molecule, {
    atomMapNo: true,
    collapseHydrogens: true,
});

  expect(molfile._highlight).toStrictEqual([1]);
  expect(molfile._atoms).toStrictEqual({
    1: [0],
});
});

test('collapseHydrogens with diastereotopic on propane', () => {
  const molecule = OCL.Molecule.fromSmiles('CCC');
  molecule.addImplicitHydrogens();
  const molfile = toVisualizerMolfile(molecule, {
    collapseHydrogens: true,
    diastereotopic: true,
});

  // After collapse, all highlight entries should point to heavy atom indices only
  for (const atomIndices of Object.values(molfile._atoms)) {
    for (const idx of atomIndices) {
      expect(idx).toBeLessThan(3);
    }
  }
  // H diaIDs should have been copied to heavy atoms before removal

  expect(molfile._highlight.length).toBeGreaterThan(2);
});
