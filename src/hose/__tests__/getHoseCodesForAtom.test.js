import OCL from 'openchemlib';

import { getHoseCodesForAtom } from '../getHoseCodesForAtom';

describe('getHoseCodesForAtom', () => {
  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    let hoses = getHoseCodesForAtom(OCL, molecule, 0);
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
