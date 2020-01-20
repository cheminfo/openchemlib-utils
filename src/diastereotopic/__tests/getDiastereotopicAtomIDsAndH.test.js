import OCL from 'openchemlib';

import { getDiastereotopicAtomIDsAndH } from '../getDiastereotopicAtomIDsAndH';

describe('getDiastereotopicAtomIDsAndH', () => {
  it('propane', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    let diaIDs = getDiastereotopicAtomIDsAndH(OCL, molecule);

    expect(diaIDs).toHaveLength(11);
    expect(diaIDs[0].nbHydrogens).toBe(3);
    expect(diaIDs[0].hydrogenOCLIDs).toHaveLength(1);
    expect(diaIDs[0].hydrogenOCLIDs[0]).toBe('gC`HALiKT@RHDRj@');
  });
});
