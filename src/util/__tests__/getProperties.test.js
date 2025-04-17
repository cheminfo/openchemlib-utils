import { Molecule, Resources } from 'openchemlib';
import { beforeAll, expect, it } from 'vitest';

import { getProperties } from '../getProperties';

beforeAll(() => {
  Resources.registerFromNodejs();
});

it('getProperties, default options', () => {
  const molecule = Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
  const properties = getProperties(molecule);
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

it('getProperties, includeToxicities', () => {
  const molecule = Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
  const properties = getProperties(molecule, { includeToxicities: true });
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

it('getProperties, include all', () => {
  const molecule = Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
  const properties = getProperties(molecule, {
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
