import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { getHoseCodesAndInfo } from '../getHoseCodesAndInfo.js';

const { Molecule } = OCL;

describe('getHoseCodesAndInfo', () => {
  it('HCCO', () => {
    const molecule = Molecule.fromSmiles('CCCO');
    molecule.setAtomicNo(0, 1);
    const result = getHoseCodesAndInfo(molecule);
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
    expect(result).toMatchSnapshot();
    const hosesString = JSON.stringify(result.hoses);
    const result2 = getHoseCodesAndInfo(molecule, {
      calculateDiastereotopicIDs: false,
    });
    expect(JSON.stringify(result2.hoses)).toBe(hosesString);
    expect(result2).toMatchSnapshot();
  });
});
