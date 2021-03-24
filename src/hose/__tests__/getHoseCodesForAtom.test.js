import OCL from 'openchemlib';

import { getHoseCodesForAtom } from '../getHoseCodesForAtom';

describe('getHoseCodesForAtom', () => {
  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    let hoses = getHoseCodesForAtom(molecule, 0);
    hoses = hoses.map((hose) => escape(hose));
    expect(hoses).toStrictEqual([
      'fH@NJ%60%7FRapj%60',
      'eF@Hp%5CQP%5EcotdGBj@',
      'gC%60HADIMUIPNHjCrdKotbIpj%60',
      'gJPHADIMuTe@xbhOZPnv_iDSaU@',
      'gJPHADIMuTe@XbhOtbIpj%60',
    ]);
  });
});
