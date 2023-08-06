import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

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

  it('cyclosporin', () => {
    const molfile = readFileSync(
      join(__dirname, '../../diastereotopic/__tests/data/cyclosporin.mol'),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    const result = getHoseCodesAndInfo(molecule);
    delete result.moleculeWithHydrogens;
    expect(result).toMatchSnapshot();
    const hosesString = JSON.stringify(result.hoses);
    const result2 = getHoseCodesAndInfo(molecule, {
      calculateDiastereotopicIDs: false,
    });
    delete result2.moleculeWithHydrogens;
    expect(JSON.stringify(result2.hoses)).toBe(hosesString);
    expect(result2).toMatchSnapshot();
  });
});
