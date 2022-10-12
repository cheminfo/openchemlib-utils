import OCL from 'openchemlib';

import { getHoseCodesForBond } from '../getHoseCodesForBond';

describe('getHoseCodesForAtoms', () => {
  it('C*C(Cl)CC single marked atom', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    let hoses = getHoseCodesForBond(molecule, [0]);
    hoses = hoses.map((hose) => escape(hose));
    expect(hoses).toStrictEqual([
      'fH@NJ%60%7FRapj%60',
      'eF@Hp%5CQP%5EcotdGBj@',
      'gC%60HADIMUIPNHjCrdKotbIpj%60',
      'gJPHADIMuTe@xbhOZPnv_iDSaU@',
      'gJPHADIMuTe@XbhOtbIpj%60',
    ]);
  });
  it('C*C*(Cl)CC double marked atoms', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    let hoses = getHoseCodesForBond(molecule, [0, 1]);
    hoses = hoses.map((hose) => escape(hose));
    expect(hoses).toStrictEqual([
      'eF@Hp%5CIPUA%7Eb%60xUTxUP',
      'gC%60HADIMUIPNEJATGeHW_hdcaUIpj%60',
      'gJPHADIMuTe@xThEP%5Eta%5Dl%7FQIGBjSaU@',
      'gJPHADIMuTe@XThEP_hdcaUIpj%60',
      'gJPHADIMuTe@XThEP_hdcaUIpj%60',
    ]);
  });
});
