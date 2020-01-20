import OCL from 'openchemlib';

import { addDiastereotopicMissingChirality } from '../addDiastereotopicMissingChirality';

describe('addDiastereotopicMissingChirality', () => {
  it('CC(Cl)CC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    addDiastereotopicMissingChirality(OCL, molecule);
    expect(molecule.getIDCode()).toBe('gJPHADILuTb@');
  });

  it('CCC(C)C', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC(C)C');
    addDiastereotopicMissingChirality(OCL, molecule);
    expect(molecule.toMolfile()).toContain('3  4  1  1');
  });
});
