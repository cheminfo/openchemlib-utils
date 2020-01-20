import OCL from 'openchemlib';

import { getHoseCodesForPath } from '../getHoseCodesForPath';

describe('getHoseCodesForPath', () => {
  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(C)CCCC');
    let path = getHoseCodesForPath(OCL, molecule, 0, 4, 3);

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
        { sphere: 1, oclID: 'gGP@Dizj%60NDJ@tGzI@xUQ%5CJh' },
        { sphere: 2, oclID: 'gNp@DiVjj@XPhKP_hdCaUUpj%60' },
      ],
      length: 3,
    });
  });
});
