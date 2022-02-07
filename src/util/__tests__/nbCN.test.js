import OCL from 'openchemlib';

import { nbCN } from '../nbCN';

describe('nbCHO', () => {
  it('check hexanoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)C(=O)O');
    expect(nbCN(molecule)).toBe(0);
  });
  it('check linear CN', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCCC#N');
    expect(nbCN(molecule)).toBe(1);
  });
  it('check benzo CN', () => {
    let molecule = OCL.Molecule.fromSmiles('N#Cc1ccccc1');
    expect(nbCN(molecule)).toBe(1);
  });
  it('check 2-Butanone', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC(C)=O');
    expect(nbCN(molecule)).toBe(0);
  });
  it('check propanal', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC=O');
    expect(nbCN(molecule)).toBe(0);
  });
});
