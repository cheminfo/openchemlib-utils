import OCL from 'openchemlib';

import { getHoseCodesForPath } from '../getHoseCodesForPath';
import { initOCL } from '../../OCL';

initOCL(OCL);

describe('getHoseCodesForPath', () => {
  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(C)CCCC');
    let path = getHoseCodesForPath(molecule, 0, 4, 3);

    path.hoses.forEach((hose) => {
      hose.oclID = escape(hose.oclID);
    });
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

  it('CCO', () => {
    let molecule = OCL.Molecule.fromSmiles('CCO');

    let path = getHoseCodesForPath(molecule, 1, 2, 3);

    path.hoses.forEach((hose) => {
      hose.oclID = escape(hose.oclID);
    });

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
