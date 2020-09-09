import OCL from 'openchemlib';

import { initOCL } from '../../OCL';
import { addDiastereotopicMissingChirality } from '../addDiastereotopicMissingChirality';

initOCL(OCL);
describe('addDiastereotopicMissingChirality', () => {
  it('CC(Cl)CC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    addDiastereotopicMissingChirality(molecule);
    expect(molecule.getIDCode()).toBe('gJPHADILuTe@@');
  });

  it('CCC(C)C', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC(C)C');
    addDiastereotopicMissingChirality(molecule);
    expect(molecule.toMolfile()).toContain('3  4  1  1');
  });
});
