import OCL from 'openchemlib';

import { nbCOOH } from '../nbCOOH';

describe('nbCOOH', () => {
  it('check hexanoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)C(=O)O');
    molecule.addImplicitHydrogens();
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
    expect(nbCOOH(molecule)).toBe(1);
  });
  it('check ethyl acetate', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(=O)OCC');
    expect(nbCOOH(molecule)).toBe(0);
  });
  it('check ethyl formate', () => {
    let molecule = OCL.Molecule.fromSmiles('C(=O)OCC');
    expect(nbCOOH(molecule)).toBe(0);
  });
  it('check 2-pentanoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCCCC(C)C(=O)O');
    expect(nbCOOH(molecule)).toBe(1);
  });
  it('check benzoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('O=C(O)c1ccccc1');
    expect(nbCOOH(molecule)).toBe(1);
  });
  it('check 2-Butanone', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC(C)=O');
    expect(nbCOOH(molecule)).toBe(0);
  });
  it('check propanal', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC=O');
    expect(nbCOOH(molecule)).toBe(0);
  });
  it('check BrCOOH', () => {
    let molecule = OCL.Molecule.fromSmiles('O=C(O)Br');
    expect(nbCOOH(molecule)).toBe(0);
  });
  it('check COOH2', () => {
    let molecule = OCL.Molecule.fromSmiles('O=CO');
    expect(nbCOOH(molecule)).toBe(1);
  });
  it('two carbonyls on same atom', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC[C+](=O)=O');
    expect(nbCOOH(molecule)).toBe(0);
  });
  it('two hydroxyl on same atom', () => {
    let molecule = OCL.Molecule.fromSmiles('O=[C+](=O)CCC(O)O');
    expect(nbCOOH(molecule)).toBe(0);
  });
});