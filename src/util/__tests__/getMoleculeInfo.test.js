import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { getMoleculeInfo } from '../getMoleculeInfo.js';

test('getMoleculeInfo', () => {
  const molecule = Molecule.fromSmiles('[12C+]CO');

  const info = getMoleculeInfo(molecule, new Map());

  expect(info).toMatchInlineSnapshot(`
    {
      "charge": 1,
      "em": 43.01838971626,
      "idCode": "eMHaeIhFILOzg@",
      "mf": "CH3O[12C](+)",
      "molfile": "
    OCL MolfileCreator  2D

      3  2  0  0  0  0  0  0  0  0999 V2000
        1.7321   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
        0.8660    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
        0.0000   -0.5000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
      1  2  1  0  0  0  0
      2  3  1  0  0  0  0
    M  CHG  1   1   1
    M  ISO  1   1  12
    M  RAD  1   1   3
    M  END
    ",
      "mw": 43.033963083220854,
      "mz": 43.01784113635093,
    }
  `);
});
