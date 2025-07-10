import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { nbLabileH } from '../nbLabileH';

describe('nbLabileH', () => {
  it('check ethanol', () => {
    const molecule = OCL.Molecule.fromSmiles('CCO');

    expect(nbLabileH(molecule)).toBe(1);
  });

  it('check diethylether', () => {
    const molecule = OCL.Molecule.fromSmiles('CCOCC');

    expect(nbLabileH(molecule)).toBe(0);
  });

  it('check acetic acid', () => {
    const molecule = OCL.Molecule.fromSmiles('CC(=O)O');

    expect(nbLabileH(molecule)).toBe(1);
  });

  it('check benzene', () => {
    const molecule = OCL.Molecule.fromSmiles('c1ccccc1');

    expect(nbLabileH(molecule)).toBe(0);
  });

  it('check glycine', () => {
    const molecule = OCL.Molecule.fromSmiles('[NH3+]CC(=O)[O-]');

    expect(nbLabileH(molecule)).toBe(3);
  });

  it('check ethylene glycol', () => {
    const molecule = OCL.Molecule.fromSmiles('OCCO');

    expect(nbLabileH(molecule)).toBe(2);
  });

  it('check butanoic acid', () => {
    const molecule = OCL.Molecule.fromSmiles('CCCC(=O)O');

    expect(nbLabileH(molecule)).toBe(1);
  });

  it('check if not C or H', () => {
    const molecule = OCL.Molecule.fromSmiles('N=C(O)Br');

    expect(nbLabileH(molecule)).toBe(2);
  });

  it('check if not C or H (H case)', () => {
    const molecule = OCL.Molecule.fromSmiles('NC(O)Br');

    expect(nbLabileH(molecule)).toBe(3);
  });

  it('check if not C or H (C case)', () => {
    const molecule = OCL.Molecule.fromSmiles('NC(O)Br');
    molecule.addImplicitHydrogens();
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

    expect(nbLabileH(molecule)).toBe(3);
  });

  it('check if two OH groups in same carbon', () => {
    const molecule = OCL.Molecule.fromSmiles('CCCC(O)O');

    expect(nbLabileH(molecule)).toBe(2);
  });

  it('check HCl', () => {
    const molecule = OCL.Molecule.fromSmiles('Cl');

    expect(nbLabileH(molecule)).toBe(1);
  });

  it('check HBr', () => {
    const molecule = OCL.Molecule.fromSmiles('Br');

    expect(nbLabileH(molecule)).toBe(1);
  });

  it('check HF', () => {
    const molecule = OCL.Molecule.fromSmiles('F');

    expect(nbLabileH(molecule)).toBe(1);
  });

  it('check HI', () => {
    const molecule = OCL.Molecule.fromSmiles('I');

    expect(nbLabileH(molecule)).toBe(1);
  });

  it('check SCCSS', () => {
    const molecule = OCL.Molecule.fromSmiles('SCCSS');

    expect(nbLabileH(molecule)).toBe(2);
  });
});
