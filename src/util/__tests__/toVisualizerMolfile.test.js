import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { toVisualizerMolfile } from '../toVisualizerMolfile';

describe('toVisualizerMolfilen propane', () => {
  it('should yield the right molfile', () => {
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

  it('should yield the right molfile with ID on the heavy atom', () => {
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
      'gC`HALiKT@RHDRj@',
      'eM@HzAbJC}IApj`',
      'gC`HALiMT@RHDRj@',
    ]);
  });
});
