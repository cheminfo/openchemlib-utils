import OCL from 'openchemlib';

import { getHoseCodesForPath } from '../getHoseCodesForPath';

describe('getHoseCodesForPath', () => {
  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCCCCC');
    let hoses = getHoseCodesForPath(OCL, molecule, 0, 3, 3);
    console.log(hoses);
    hoses = hoses.map((hose) => escape(hose));

    expect(hoses).toStrictEqual([
      'fH@NJ%60%7FRapj%60',
      'eF@Hp%5CQP_iHNET',
      'gC%60HADIMTAqEP_iDSaU@',
      'gJPHADIMuPGDUA%7EdQNET',
      'gJPHADIMuPGDUA%7EdQNET',
    ]);
  });
});
