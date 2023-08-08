import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { nbCN } from '../nbCN';

describe('nbCN', () => {
  it('check hexanoic acid', () => {
    const molecule = OCL.Molecule.fromSmiles('CCCC(C)C(=O)O');
    molecule.addImplicitHydrogens();
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
    expect(nbCN(molecule)).toBe(0);
  });
  it('check linear CN', () => {
    const molecule = OCL.Molecule.fromSmiles('CCCCC#N');
    expect(nbCN(molecule)).toBe(1);
  });
  it('check benzo CN', () => {
    const molecule = OCL.Molecule.fromSmiles('N#Cc1ccccc1');
    expect(nbCN(molecule)).toBe(1);
  });
  it('check 2-Butanone', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC(C)=O');
    expect(nbCN(molecule)).toBe(0);
  });
  it('check propanal', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC=O');
    expect(nbCN(molecule)).toBe(0);
  });
  it('check BrCN', () => {
    const molecule = OCL.Molecule.fromSmiles('N#CBr');
    expect(nbCN(molecule)).toBe(0);
  });
  it('check HCN', () => {
    const molecule = OCL.Molecule.fromSmiles('N#C');
    expect(nbCN(molecule)).toBe(1);
  });
  it('check HCN with H', () => {
    const molecule = OCL.Molecule.fromSmiles('N#C');
    expect(nbCN(molecule)).toBe(1);
  });
  it('check H3CCN', () => {
    const molecule = OCL.Molecule.fromSmiles('N#CC');
    expect(nbCN(molecule)).toBe(1);
  });
  it('two CN on the same molecule', () => {
    const molecule = OCL.Molecule.fromSmiles('N#[C+2]#N');
    expect(nbCN(molecule)).toBe(0);
  });
});
