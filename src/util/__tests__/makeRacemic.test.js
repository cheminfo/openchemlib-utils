import OCL from 'openchemlib';

import { initOCL } from '../../OCL';
import { makeRacemic } from '../makeRacemic';

initOCL(OCL);

describe('makeRacemic', () => {
  it('C[C@H](Cl)CC', () => {
    let molecule = OCL.Molecule.fromSmiles('C[C@H](Cl)CC');
    expect(molecule.getIDCode()).toBe('gJPHADILuTb@');
    makeRacemic(molecule);
    expect(molecule.getIDCode()).toBe('gJPHADILuTe@@');
  });

  it('C[C@H](Cl)[C@@H](Cl)C', () => {
    let molecule = OCL.Molecule.fromSmiles('C[C@H](Cl)[C@@H](Cl)C');
    expect(molecule.getIDCode()).toBe('gGPDADFHRYjjTR`@');
    makeRacemic(molecule);
    expect(molecule.getIDCode()).toBe('gGPDADFHRYjjThQ@@');
  });
});
