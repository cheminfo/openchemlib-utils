import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { nbCHO } from '../nbCHO';

describe('nbCHO', () => {
  it('check hexanoic acid', () => {
    const molecule = OCL.Molecule.fromSmiles('CCCC(C)C(=O)O');
    molecule.addImplicitHydrogens();
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check pentan-2-oic acid', () => {
    const molecule = OCL.Molecule.fromSmiles('CCCCCC(C)C(=O)O');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check benzo aldehyde', () => {
    const molecule = OCL.Molecule.fromSmiles('O=Cc1ccccc1');
    expect(nbCHO(molecule)).toBe(1);
  });
  it('check butan-2-one', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC(C)=O');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check propanal', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC=O');
    expect(nbCHO(molecule)).toBe(1);
  });
  it('check hexane-2,5-dione', () => {
    const molecule = OCL.Molecule.fromSmiles('CC(=O)CCC(=O)C');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check hexanedial', () => {
    const molecule = OCL.Molecule.fromSmiles('O=CCCCCC=O');
    expect(nbCHO(molecule)).toBe(2);
  });
  it('check Br2CO', () => {
    const molecule = OCL.Molecule.fromSmiles('O=C(Br)Br');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check BrCHO', () => {
    const molecule = OCL.Molecule.fromSmiles('O=CBr');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check CH3COBr', () => {
    const molecule = OCL.Molecule.fromSmiles('CC(=O)Br');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('check formaldehyde', () => {
    const molecule = OCL.Molecule.fromSmiles('C=O');
    expect(nbCHO(molecule)).toBe(1);
  });
  it('two carbonyls on same atom', () => {
    const molecule = OCL.Molecule.fromSmiles('CC[CH+](=O)=O');
    expect(nbCHO(molecule)).toBe(0);
  });
  it('butanol', () => {
    const molecule = OCL.Molecule.fromSmiles('CCCCO');
    expect(nbCHO(molecule)).toBe(0);
  });
});
