import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { getAtoms } from '../getAtoms';

describe('getAtoms', () => {
  it('CC', () => {
    const molecule = OCL.Molecule.fromSmiles('CC');
    const result = getAtoms(molecule);
    expect(result).toStrictEqual({
      atoms: { C: 2, H: 6 },
      parts: [{ C: 2, H: 6 }],
    });
  });

  it('CC with implicit hydrogens', () => {
    const molecule = OCL.Molecule.fromSmiles('CC');
    molecule.addImplicitHydrogens();
    const result = getAtoms(molecule);
    expect(result).toStrictEqual({
      atoms: { C: 2, H: 6 },
      parts: [{ C: 2, H: 6 }],
    });
  });

  it('parts', () => {
    const molecule = OCL.Molecule.fromSmiles('OCC(N)CCl.[CH2+][2H]');
    const result = getAtoms(molecule);
    expect(result).toStrictEqual({
      atoms: {
        O: 1,
        H: 11,
        C: 4,
        N: 1,
        Cl: 1,
      },
      parts: [
        {
          O: 1,
          H: 8,
          C: 3,
          N: 1,
          Cl: 1,
        },
        {
          C: 1,
          H: 3,
        },
      ],
    });
  });
});
