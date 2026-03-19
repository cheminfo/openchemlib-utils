import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

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

  it('should yield the right molfile with atomMapNo', () => {
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

  it('should yield the right molfile with customAtomLabel', () => {
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
