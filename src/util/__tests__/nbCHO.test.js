import OCL from 'openchemlib';

import { nbCHO } from '../nbCHO';

describe('nbCHO', () => {
  it('check hexanoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)C(=O)O');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check pentan-2-oic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCCCC(C)C(=O)O');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check benzo aldehyde', () => {
    let molecule = OCL.Molecule.fromSmiles('O=Cc1ccccc1');
    expect(nbCHO(molecule)).toBe(1);
  });
  it('check butan-2-one', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC(C)=O');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check propanal', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC=O');
    expect(nbCHO(molecule)).toBe(1);
  });
  it('check hexane-2,5-dione', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(=O)CCC(=O)C');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check hexanedial', () => {
    let molecule = OCL.Molecule.fromSmiles('O=CCCCCC=O');
    expect(nbCHO(molecule)).toBe(2);
  });
  it('check Br2CO', () => {
    let molecule = OCL.Molecule.fromSmiles('O=C(Br)Br');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check BrCHO', () => {
    let molecule = OCL.Molecule.fromSmiles('O=CBr');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check CH3COBr', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(=O)Br');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check formaldehyde', () => {
    let molecule = OCL.Molecule.fromSmiles('C=O');
    expect(nbCHO(molecule)).toBe(1);
  });
});
