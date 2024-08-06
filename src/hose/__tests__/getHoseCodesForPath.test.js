import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { getHoseCodesForPath } from '../getHoseCodesForPath';

describe('getHoseCodesForPath', () => {
  it('CC(C)CCCC', () => {
    const molecule = OCL.Molecule.fromSmiles('CC(C)CCCC');
    const path = getHoseCodesForPath(molecule, 0, 4, 3);

    for (const hose of path.hoses) {
      hose.oclID = escape(hose.oclID);
    }
    expect(path).toStrictEqual({
      atoms: [0, 1, 3, 4],
      from: 0,
      to: 4,
      torsion: -3.141592653589793,
      hoses: [
        { sphere: 0, oclID: 'gC%60@Dej@xPhMP_hdCaUYpj%60' },
        { sphere: 1, oclID: 'gGP@DizjibApaPF%60%7CQdsP%5E%7FQHGBjKaU@' },
        { sphere: 2, oclID: 'gNp@DiVjjfHGBEAZCsFSEfb%7C%7E%7FQHGBjkaU@' },
      ],
      length: 3,
    });
  });

  it('CC with hydrogens', () => {
    const molecule = OCL.Molecule.fromSmiles('CC');
    molecule.addImplicitHydrogens();
    const path = getHoseCodesForPath(molecule, 6, 7, 3);

    for (const hose of path.hoses) {
      hose.oclID = escape(hose.oclID);
    }

    expect(path).toStrictEqual({
      atoms: [6, 1, 7],
      from: 6,
      to: 7,
      torsion: undefined,
      hoses: [
        { sphere: 0, oclID: 'eMABYYeIhOzJBIUJIU@' },
        { sphere: 1, oclID: 'gC%60DALjYRZhCzROtRADjdbUP' },
        { sphere: 2, oclID: 'gC%60DALjYRZhA%7EbPHeTdRj@' },
      ],
      length: 2,
    });
  });

  it('CCO', () => {
    const molecule = OCL.Molecule.fromSmiles('CCO');

    const path = getHoseCodesForPath(molecule, 1, 2, 3);

    for (const hose of path.hoses) {
      hose.oclID = escape(hose.oclID);
    }

    expect(path).toStrictEqual({
      atoms: [1, 2],
      from: 1,
      to: 2,
      torsion: undefined,
      hoses: [
        { sphere: 0, oclID: 'eFHBLGBTEP_hhOeUNET' },
        { sphere: 1, oclID: 'eMHAIhNDhJ%60%7CdV_hhOeUNET' },
        { sphere: 2, oclID: 'eMHAIhFDhJ%60%7FQP_Jj%5CJh' },
      ],
      length: 1,
    });
  });
});
