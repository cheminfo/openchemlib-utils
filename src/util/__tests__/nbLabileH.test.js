import OCL from 'openchemlib';

import { nbLabileH } from '../nbLabileH';

describe('nbLabileH', () => {
  it('check ethanol', () => {
    let molecule = OCL.Molecule.fromSmiles('CCO');
    expect(nbLabileH(molecule)).toBe(1);
  });
  it('check diethylether', () => {
    let molecule = OCL.Molecule.fromSmiles('CCOCC');
    expect(nbLabileH(molecule)).toBe(0);
  });
  it('check acetic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(=O)O');
    expect(nbLabileH(molecule)).toBe(1);
  });
  it('check benzene', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    expect(nbLabileH(molecule)).toBe(0);
  });
  it('check glycine', () => {
    let molecule = OCL.Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
    expect(nbLabileH(molecule)).toBe(3);
  });
  it('check ethylene glycol', () => {
    let molecule = OCL.Molecule.fromSmiles('OCCO');
    expect(nbLabileH(molecule)).toBe(2);
  });
  it('check butanoic acid', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(=O)O');
    expect(nbLabileH(molecule)).toBe(1);
  });
  it('check if not C or H', () => {
    let molecule = OCL.Molecule.fromSmiles('N=C(O)Br');
    expect(nbLabileH(molecule)).toBe(2);
  });
  it('check if not C or H (H case)', () => {
    let molecule = OCL.Molecule.fromSmiles('NC(O)Br');
    expect(nbLabileH(molecule)).toBe(3);
  });
  it('check if not C or H (C case)', () => {
    let molecule = OCL.Molecule.fromSmiles('NC(O)Br');
    molecule.addImplicitHydrogens();
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
    expect(nbLabileH(molecule)).toBe(3);
  });
  it('check if two OH groups in same carbon', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(O)O');
    expect(nbLabileH(molecule)).toBe(2);
  });
  it('check HCl', () => {
    let molecule = OCL.Molecule.fromSmiles('Cl');
    expect(nbLabileH(molecule)).toBe(1);
  });
  it('check HBr', () => {
    let molecule = OCL.Molecule.fromSmiles('Br');
    expect(nbLabileH(molecule)).toBe(1);
  });
  it('check HF', () => {
    let molecule = OCL.Molecule.fromSmiles('F');
    expect(nbLabileH(molecule)).toBe(1);
  });
  it('check HI', () => {
    let molecule = OCL.Molecule.fromSmiles('I');
    expect(nbLabileH(molecule)).toBe(1);
  });
  it('check SCCSS', () => {
    let molecule = OCL.Molecule.fromSmiles('SCCSS');
    expect(nbLabileH(molecule)).toBe(2);
  });
});
