import OCL from 'openchemlib';

import { nbNH2 } from '../nbNH2';

describe('nbNH2', () => {
  /*
  it('check aniline', () => {
    let molecule = OCL.Molecule.fromSmiles('Nc1ccccc1');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(1);
  });*/
  it('check 2-pentanamine', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)N');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(1);
  }); /*
  it('check secondary amine', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)NC');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(0);
  });
  it('check ternary amine', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCC(C)N(C)C');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(0);
  });
  it('check cyclic amine', () => {
    let molecule = OCL.Molecule.fromSmiles('C1CCNCC1');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(0);
  });
  it('check diamine', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(N)CC(C)N');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(2);
  });
  it('check H2CNH2', () => {
    let molecule = OCL.Molecule.fromSmiles('CN');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(1);
  });
  it('check NCN', () => {
    let molecule = OCL.Molecule.fromSmiles('NCN');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(0);
  });
  it('check NH3', () => {
    let molecule = OCL.Molecule.fromSmiles('N');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(0);
  });
  it('check Br3NH2', () => {
    let molecule = OCL.Molecule.fromSmiles('NC(Br)(Br)Br');
    molecule.addImplicitHydrogens();
    expect(nbNH2(molecule)).toBe(0);
  });*/
});
