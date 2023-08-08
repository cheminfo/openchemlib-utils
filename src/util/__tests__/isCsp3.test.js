import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { isCsp3 } from '../isCsp3';

describe('isCsp3', () => {
  it('CC=CCC', () => {
    const molecule = OCL.Molecule.fromSmiles('CC=CCO');
    expect(isCsp3(molecule, 0)).toBe(true);
    expect(isCsp3(molecule, 1)).toBe(false);
    expect(isCsp3(molecule, 2)).toBe(false);
    expect(isCsp3(molecule, 3)).toBe(true);
    expect(isCsp3(molecule, 4)).toBe(false);
  });
});
