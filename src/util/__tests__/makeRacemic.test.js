import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { makeRacemic } from '../makeRacemic';

describe('makeRacemic', () => {
  it('C[C@H](Cl)CC', () => {
    const molecule = OCL.Molecule.fromSmiles('C[C@H](Cl)CC');

    expect(molecule.getIDCode()).toBe('gJPHADILuTb@');

    makeRacemic(molecule);

    expect(molecule.getIDCode()).toBe('gJPHADILuTe@@');
  });

  it('C[C@H](Cl)[C@@H](Cl)C', () => {
    const molecule = OCL.Molecule.fromSmiles('C[C@H](Cl)[C@@H](Cl)C');

    expect(molecule.getIDCode()).toBe('gGPDADFHRYjjTR`@');

    makeRacemic(molecule);

    expect(molecule.getIDCode()).toBe('gGPDADFHRYjjThQ@@');
  });

  it('2 enantiomers', () => {
    const moleculeR = OCL.Molecule.fromSmiles('C[C@H](Cl)Br');
    const idCodeR = moleculeR.getIDCode();
    const moleculeS = OCL.Molecule.fromSmiles('C[C@@H](Cl)Br');
    const idCodeS = moleculeS.getIDCode();

    expect(moleculeR.getAtomCIPParity(1)).toBe(1);
    expect(moleculeS.getAtomCIPParity(1)).toBe(2);

    makeRacemic(moleculeR);
    const idCodeRacemic = moleculeR.getIDCode();
    makeRacemic(moleculeS);
    const idCodeSRacemic = moleculeS.getIDCode();

    expect(idCodeR).not.toBe(idCodeS);
    expect(idCodeSRacemic).toBe(idCodeRacemic);
  });
});
