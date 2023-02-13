import { Molecule } from 'openchemlib';

import { getAtomFeatures } from '../getAtomFeatures.js';

describe('getAtomFeatures', () => {
  it('CCCC', () => {
    const molecule = Molecule.fromSmiles('CCCC');
    const features = getAtomFeatures(molecule);
    expect(features).toStrictEqual({
      'eF@HpP': 2,
      'eM@HzB': 2,
    });
  });

  it('CC(C)CC', () => {
    const molecule = Molecule.fromSmiles('CC(C)CC');
    const features = getAtomFeatures(molecule);
    expect(features).toStrictEqual({
      'eF@HpP': 3,
      'gC`@H}PD': 1,
      'eM@HzB': 1,
    });
  });

  it('CC(C)CC sphere:2', () => {
    const molecule = Molecule.fromSmiles('CC(C)CC');
    const features = getAtomFeatures(molecule, { sphere: 2 });
    expect(features).toStrictEqual({
      'gC`@H}PD': 2,
      'gJP@DjZh@': 2,
      'eM@HzB': 1,
    });
  });

  it('c1ccccc1', () => {
    const molecule = Molecule.fromSmiles('c1ccccc1');
    const features = getAtomFeatures(molecule);
    expect(features).toStrictEqual({
      'eM@HpB': 6,
    });
  });

  it('c1ccccc1CC', () => {
    const molecule = Molecule.fromSmiles('c1ccccc1CC');
    const features = getAtomFeatures(molecule);
    expect(features).toStrictEqual({
      'eM@HpB': 5,
      'gC`@HxPD': 1,
      'eM@HzB': 1,
      'eF@HpP': 1,
    });
  });
});
