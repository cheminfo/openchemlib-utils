import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { getMoleculeInfo } from '../getMoleculeInfo.js';

test('getMoleculeInfo', () => {
  const molecule = Molecule.fromSmiles('[12C+]CO');

  const info = getMoleculeInfo(molecule, new Map());
  expect(info).toStrictEqual({
    molfile:
      '\n' +
      'Actelion Java MolfileCreator 1.0\n' +
      '\n' +
      '  3  2  0  0  0  0  0  0  0  0999 V2000\n' +
      '    1.7321   -0.5000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n' +
      '    0.8660    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n' +
      '    0.0000   -0.5000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n' +
      '  1  2  1  0  0  0  0\n' +
      '  2  3  1  0  0  0  0\n' +
      'M  CHG  1   1   1\n' +
      'M  ISO  1   1  12\n' +
      'M  RAD  1   1   3\n' +
      'M  END\n',
    idCode: 'eMHaeIhFILOzg@',
    mf: 'CH3O[12C](+)',
    mw: 43.033963083220854,
    em: 43.01838971626,
    mz: 43.01784113635093,
    charge: 1,
  });
});
