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
    expect(nbOH(molecule)).toBe(1);
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
});
