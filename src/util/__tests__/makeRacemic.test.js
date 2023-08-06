import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

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
});
