import OCL from 'openchemlib';

import { nbCN } from '../nbCN';

describe('nbCN', () => {
  it('check hexanoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)C(=O)O');
    molecule.addImplicitHydrogens();
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
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
  it('check BrCN', () => {
    let molecule = OCL.Molecule.fromSmiles('N#CBr');
    expect(nbCN(molecule)).toBe(0);
  });
  it('check HCN', () => {
    let molecule = OCL.Molecule.fromSmiles('N#C');
    expect(nbCN(molecule)).toBe(1);
  });
  it('check HCN with H', () => {
    let molecule = OCL.Molecule.fromSmiles('N#C');
    expect(nbCN(molecule)).toBe(1);
  });
  it('check H3CCN', () => {
    let molecule = OCL.Molecule.fromSmiles('N#CC');
    expect(nbCN(molecule)).toBe(1);
  });
  it('two CN on the same molecule', () => {
    let molecule = OCL.Molecule.fromSmiles('N#[C+2]#N');
    expect(nbCN(molecule)).toBe(0);
  });
});
