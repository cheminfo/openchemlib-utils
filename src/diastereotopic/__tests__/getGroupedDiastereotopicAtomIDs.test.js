import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { getGroupedDiastereotopicAtomIDs } from '../getGroupedDiastereotopicAtomIDs';

describe('getGroupedDiastereotopicIDs test propane', () => {
  it('should yield the right table for all atoms', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    const diaIDs = getGroupedDiastereotopicAtomIDs(molecule);

    expect(diaIDs).toHaveLength(4);
    expect(diaIDs[0].counter).toBe(2);
    expect(diaIDs[0].atoms).toHaveLength(2);
    expect(diaIDs[0].oclID).toBe('eM@Df`Xb`RP\\Jh');
  });

  it('should yield the right table for carbons', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    const diaIDs = getGroupedDiastereotopicAtomIDs(molecule, {
      atomLabel: 'C',
    });

    expect(diaIDs).toHaveLength(2);
    expect(diaIDs[0].counter).toBe(2);
    expect(diaIDs[0].atoms).toHaveLength(2);
    expect(diaIDs[0].oclID).toBe('eM@Df`Xb`RP\\Jh');
  });

  it('should yield the right table for hydrogens', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    const diaIDs = getGroupedDiastereotopicAtomIDs(molecule, {
      atomLabel: 'H',
    });

    expect(diaIDs).toHaveLength(2);
    expect(diaIDs[0].counter).toBe(6);
    expect(diaIDs[0].atoms).toHaveLength(6);
    expect(diaIDs[0].oclID).toBe('gC`HALiKT@\u007FRHDRj@');
  });
});
