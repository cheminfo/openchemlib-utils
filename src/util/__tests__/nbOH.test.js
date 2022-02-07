import OCL from 'openchemlib';

import { nbOH } from '../nbOH';

describe('nbOH', () => {
  it('check ethanol', () => {
    let molecule = OCL.Molecule.fromSmiles('CCO');
    expect(nbOH(molecule)).toBe(1);
  });
  it('check diethylether', () => {
    let molecule = OCL.Molecule.fromSmiles('CCOCC');
    expect(nbOH(molecule)).toBe(0);
  });
  it('check acetic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(=O)O');
    expect(nbOH(molecule)).toBe(0);
  });
  it('check benzene', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    expect(nbOH(molecule)).toBe(0);
  });
  it('check glycine', () => {
    let molecule = OCL.Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
    expect(nbOH(molecule)).toBe(0);
  });
  it('check ethylene glycol', () => {
    let molecule = OCL.Molecule.fromSmiles('OCCO');
    expect(nbOH(molecule)).toBe(2);
  });
  it('check butanoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(=O)O');
    expect(nbOH(molecule)).toBe(0);
  });
  it('check if not C or H', () => {
    let molecule = OCL.Molecule.fromSmiles('N=C(O)Br');
    expect(nbOH(molecule)).toBe(0);
  });
  it('check if not C or H (H case)', () => {
    let molecule = OCL.Molecule.fromSmiles('NC(O)Br');
    expect(nbOH(molecule)).toBe(0);
  });
  it('check if not C or H (C case)', () => {
    let molecule = OCL.Molecule.fromSmiles('NC(O)Br');
    molecule.addImplicitHydrogens();
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
    expect(nbOH(molecule)).toBe(0);
  });
  it('check if two OH groups in same carbon', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(O)O');
    expect(nbOH(molecule)).toBe(0);
  });
});
