import OCL from 'openchemlib';

import { nbCHO } from '../nbCHO';

describe('nbCHO', () => {
  it('check hexanoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)C(=O)O');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check 2-pentanoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCCCC(C)C(=O)O');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check benzo aldehyde', () => {
    let molecule = OCL.Molecule.fromSmiles('O=Cc1ccccc1');
    expect(nbCHO(molecule)).toBe(1);
  });
  it('check 2-Butanone', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC(C)=O');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check propanal', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC=O');
    expect(nbCHO(molecule)).toBe(1);
  });
});
