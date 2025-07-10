import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { getDiastereotopicAtomIDsAndH } from '../getDiastereotopicAtomIDsAndH';

describe('getDiastereotopicAtomIDsAndH', () => {
  it('propane', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    const diaIDs = getDiastereotopicAtomIDsAndH(molecule);

    expect(diaIDs).toHaveLength(11);
    expect(diaIDs[0].nbHydrogens).toBe(3);
    expect(diaIDs[0].hydrogenOCLIDs).toHaveLength(1);
    expect(diaIDs[0].hydrogenOCLIDs[0]).toBe('gC`HALiKT@RHDRj@');

    expect(escape(diaIDs[3].heavyAtom)).toBe('eM@Df%60Xb%60%7FRP%5CJh');
  });
});
