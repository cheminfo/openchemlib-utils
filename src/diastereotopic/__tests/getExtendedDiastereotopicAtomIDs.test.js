import OCL from 'openchemlib';

import { getExtendedDiastereotopicAtomIDs } from '../getExtendedDiastereotopicAtomIDs';

describe('getExtendedDiastereotopicIDs test propane', () => {
  it('should yield the right table - propane', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    let diaIDs = getExtendedDiastereotopicAtomIDs(molecule);

    expect(diaIDs).toHaveLength(11);
    expect(diaIDs[0].nbHydrogens).toBe(3);
    expect(diaIDs[0].hydrogenOCLIDs).toHaveLength(1);
    expect(diaIDs[0].hydrogenOCLIDs[0]).toBe('gC`HALiKT@RHDRj@');
  });
});
