import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { getPathAndTorsion } from '../getPathAndTorsion.js';

test('getPathAndTorsion', () => {
  const molecule = Molecule.fromSmiles('CCOC');

  expect(getPathAndTorsion(molecule, 0, 3)).toStrictEqual({
    atoms: [],
    from: 0,
    to: 3,
    torsion: undefined,
    length: -1,
  });
  expect(getPathAndTorsion(molecule, 0, 2, 4)).toMatchObject({
    atoms: [0, 1, 2],
    from: 0,
    to: 2,
    torsion: undefined,
    length: 2,
  });

  expect(getPathAndTorsion(molecule, 0, 3, 4)).toMatchObject({
    atoms: [0, 1, 2, 3],
    from: 0,
    to: 3,
    torsion: -3.141592653589793,
    length: 3,
  });
});
