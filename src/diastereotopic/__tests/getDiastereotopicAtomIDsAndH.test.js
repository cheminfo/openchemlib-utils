import OCL from 'openchemlib';

import { getDiastereotopicAtomIDsAndH } from '../getDiastereotopicAtomIDsAndH';
import { initOCL } from '../../OCL';

initOCL(OCL);
describe('getDiastereotopicAtomIDsAndH', () => {
  it('propane', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    let diaIDs = getDiastereotopicAtomIDsAndH(molecule);

    expect(diaIDs).toHaveLength(11);
    expect(diaIDs[0].nbHydrogens).toBe(3);
    expect(diaIDs[0].hydrogenOCLIDs).toHaveLength(1);
    expect(diaIDs[0].hydrogenOCLIDs[0]).toBe('gC`HALiKT@RHDRj@');
  });
});
