import { Molecule } from 'openchemlib';

import { getProperties } from '../getProperties';

test('getProperties, default options', () => {
  let molecule = Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
  let properties = getProperties(molecule);
  expect(properties).toStrictEqual({
    acceptorCount: 3,
    donorCount: 1,
    logP: -6.870399981737137,
    logS: -0.027999980375170708,
    polarSurfaceArea: 67.76999855041504,
    rotatableBondCount: 1,
    stereoCenterCount: 0,
    mf: 'C2H5NO2',
    mw: 75.0667,
  });
});

test('getProperties, includeToxicities', () => {
  let molecule = Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
  let properties = getProperties(molecule, { includeToxicities: true });
  expect(properties).toStrictEqual({
    acceptorCount: 3,
    donorCount: 1,
    logP: -6.870399981737137,
    logS: -0.027999980375170708,
    polarSurfaceArea: 67.76999855041504,
    rotatableBondCount: 1,
    stereoCenterCount: 0,
    mf: 'C2H5NO2',
    mw: 75.0667,
    mutagenic: 1,
    tumorigenic: 1,
    irritant: 1,
    reproductiveEffective: 1,
  });
});

test('getProperties, include all', () => {
  let molecule = Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
  let properties = getProperties(molecule, {
    includeToxicities: true,
    includeDruglikeness: true,
  });
  expect(properties).toStrictEqual({
    acceptorCount: 3,
    donorCount: 1,
    logP: -6.870399981737137,
    logS: -0.027999980375170708,
    polarSurfaceArea: 67.76999855041504,
    rotatableBondCount: 1,
    stereoCenterCount: 0,
    mf: 'C2H5NO2',
    mw: 75.0667,
    mutagenic: 1,
    tumorigenic: 1,
    irritant: 1,
    reproductiveEffective: 1,
    drugLikeness: -3.0141666666666667,
    drugScore: 0.5218060573381611,
  });
});
