import OCL from 'openchemlib';

import { nbNH2 } from '../nbNH2';

describe('nbNH2', () => {
  it('check aniline', () => {
    let molecule = OCL.Molecule.fromSmiles('Nc1ccccc1');
    expect(nbNH2(molecule)).toBe(1);
  });
  it('check 2-pentanamine', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)N');
    expect(nbNH2(molecule)).toBe(1);
  });
  it('check secondary amine', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)NC');
    expect(nbNH2(molecule)).toBe(0);
  });
  it('check ternary amine', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)N(C)C');
    expect(nbNH2(molecule)).toBe(0);
  });
  it('check cyclic amine', () => {
    let molecule = OCL.Molecule.fromSmiles('C1CCNCC1');
    expect(nbNH2(molecule)).toBe(0);
  });
  it('check diamine', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(N)CC(C)N');
    expect(nbNH2(molecule)).toBe(2);
  });
});
