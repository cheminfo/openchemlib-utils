import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { getHoseCodesAndInfo } from '../getHoseCodesAndInfo.js';

const { Molecule } = OCL;

describe('getHoseCodesAndInfo', () => {
  it('HCCO', () => {
    const molecule = Molecule.fromSmiles('CCCO');
    molecule.setAtomicNo(0, 1);
    const result = getHoseCodesAndInfo(molecule);

    delete result.moleculeWithHydrogens;
    expect(result.hoses).toHaveLength(9);
    expect(result.hoses[0]).toHaveLength(5);
    expect(result).toMatchSnapshot();
  });

  it('Ethyl benzene', () => {
    const molfile = `Benzene, ethyl-, ID: C100414
  NIST    16081116462D 1   1.00000     0.00000
Copyright by the U.S. Sec. Commerce on behalf of U.S.A. All rights reserved.
  8  8  0     0  0              1 V2000
    0.5015    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
    0.0000    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    1.5046    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
    2.0062    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    3.0092    0.8526    0.0000 C   0  0  0  0  0  0           0  0  0
    1.5046    1.7554    0.0000 C   0  0  0  0  0  0           0  0  0
    0.5015    1.7052    0.0000 C   0  0  0  0  0  0           0  0  0
    3.5108    0.0000    0.0000 C   0  0  0  0  0  0           0  0  0
  1  2  2  0     0  0
  3  1  1  0     0  0
  2  7  1  0     0  0
  4  3  2  0     0  0
  4  5  1  0     0  0
  6  4  1  0     0  0
  5  8  1  0     0  0
  7  6  2  0     0  0
M  END`;
    const molecule = OCL.Molecule.fromMolfile(molfile);
    const result = getHoseCodesAndInfo(molecule, {
      calculateDiastereotopicIDs: false,
    });
    expect(result.diaIDs).toBeUndefined();
  });

  it('cyclosporin', { timeout: 30_000 }, () => {
    const molfile = readFileSync(
      join(
        import.meta.dirname,
        '../../diastereotopic/__tests__/data/cyclosporin.mol',
      ),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    const result = getHoseCodesAndInfo(molecule);
    delete result.moleculeWithHydrogens;
    expect(result).toMatchSnapshot();
    const hosesString = JSON.stringify(result.hoses, undefined, 2);
    const result2 = getHoseCodesAndInfo(molecule, {
      calculateDiastereotopicIDs: false,
    });
    delete result2.moleculeWithHydrogens;
    expect(JSON.stringify(result2.hoses, undefined, 2)).toBe(hosesString);
    expect(result2).toMatchSnapshot();
  });
});
