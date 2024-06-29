import fs from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { getMF } from '../getMF';

describe('getMF', () => {
  it('check benzene', () => {
    const molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    const result = getMF(molecule);
    expect(result.mf).toBe('C6H6');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('C6H6');
  });
  it('check glycine', () => {
    const molecule = OCL.Molecule.fromSmiles('[NH3+]CC(=O)[O-]');
    const result = getMF(molecule);
    expect(result.mf).toBe('C2H5NO2');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('C2H5NO2');
  });
  it('check isotope of pentane', () => {
    const molecule = OCL.Molecule.fromSmiles('CC[13CH2]CC([2H])([2H])([2H])');
    const result = getMF(molecule);
    expect(result.mf).toBe('C4H9[13C][2H]3');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('C4H9[13C][2H]3');
  });
  it('check multipart', () => {
    const molecule = OCL.Molecule.fromSmiles('OCC(N)CCl.[CH2+][2H]');
    const result = getMF(molecule);
    expect(result.mf).toBe('C4H10ClNO[2H](+)');
    expect(result.parts).toHaveLength(2);
    expect(result.parts[0]).toBe('C3H8ClNO');
    expect(result.parts[1]).toBe('CH2[2H](+)');
  });
  it('check multihydrate', () => {
    const molecule = OCL.Molecule.fromSmiles('[ClH].O.O.O.O');

    const result = getMF(molecule);
    expect(result.mf).toBe('H9ClO4');
    expect(result.parts).toHaveLength(2);
    expect(result.parts[0]).toBe('4H2O');
    expect(result.parts[1]).toBe('HCl');
  });

  it('check 4 H2O', () => {
    const molecule = OCL.Molecule.fromSmiles('O.O.O.O');

    const result = getMF(molecule);
    expect(result.mf).toBe('H8O4');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('4H2O');
  });

  it('check Li+ OH-', () => {
    const molecule = OCL.Molecule.fromIDCode('eDJRpCjP@');
    const result = getMF(molecule);
    expect(result.mf).toBe('HLiO');
    expect(result.parts).toHaveLength(2);
    expect(result.parts[0]).toBe('HO(-)');
    expect(result.parts[1]).toBe('Li(+)');
  });

  it('check 2 atoms of cobalt', () => {
    // if we have the same molecular formula we group them and count in front
    const molecule = OCL.Molecule.fromIDCode('eDACXm`@@');
    const result = getMF(molecule);
    expect(result.mf).toBe('Co2');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('2Co');
  });

  it('check O--', () => {
    const molecule = OCL.Molecule.fromSmiles('[O--]');
    const result = getMF(molecule);
    expect(result.mf).toBe('O(-2)');
    expect(result.parts).toHaveLength(1);
    expect(result.parts[0]).toBe('O(-2)');
  });

  it('multipart molfile', () => {
    const molfile = fs.readFileSync(join(__dirname, 'ru.mol'), 'utf8');
    const molecule = OCL.Molecule.fromMolfile(molfile);
    const mf = getMF(molecule);
    expect(mf).toStrictEqual({ parts: ['2C8H16', '2HORu'], mf: 'C16H34O2Ru2' });
  });

  it('a R group, we would like R at the end', () => {
    const molecule = OCL.Molecule.fromSmiles('CC([R])O');
    const result = getMF(molecule);
    expect(result.mf).toBe('C2H5OR');
  });
});
