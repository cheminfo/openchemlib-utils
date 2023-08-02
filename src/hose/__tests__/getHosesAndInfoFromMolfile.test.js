import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { getHosesAndInfoFromMolfile } from '../getHosesAndInfoFromMolfile.js';

const { Molecule } = OCL;

describe('getHosesAndInfoFromMolfile', () => {
  it('HCCO', () => {
    const molecule = Molecule.fromSmiles('CCCO');
    molecule.setAtomicNo(0, 1);
    // we create a molfile with the H at the beginning because OCL always remap them to the end
    const molfile = molecule
      .toMolfile()
      .replace('O', 'X')
      .replace('H', 'O')
      .replace('X', 'H');
    const result = getHosesAndInfoFromMolfile(OCL, molfile);
    delete result.molecule;
    expect(result).toMatchSnapshot();
    //console.log(result)
    //
  });

  it('cyclosporin', () => {
    const molfile = readFileSync(
      join(__dirname, '../../diastereotopic/__tests/data/cyclosporin.mol'),
      'utf8',
    );
    const result = getHosesAndInfoFromMolfile(OCL, molfile);
    delete result.molecule;
    expect(result).toMatchSnapshot();
    const hosesString = JSON.stringify(result.hoses);
    const result2 = getHosesAndInfoFromMolfile(OCL, molfile, {
      calculateDiastereotopicIDs: false,
    });
    delete result2.molecule;
    expect(JSON.stringify(result2.hoses)).toBe(hosesString);
    expect(result2).toMatchSnapshot();
  });
});
