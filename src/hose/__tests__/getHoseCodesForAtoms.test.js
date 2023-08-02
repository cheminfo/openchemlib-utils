import OCL from 'openchemlib';

import { getHoseCodesForAtoms } from '../getHoseCodesForAtoms';

const { Molecule } = OCL;

describe('getHoseCodesForAtoms', () => {
  it('C*C(Cl)CC single marked atom', () => {
    let molecule = Molecule.fromSmiles('CC(Cl)CC');
    let hoses = getHoseCodesForAtoms(molecule, [0]);
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
    let molecule = Molecule.fromSmiles('CC(Cl)CC');
    let hoses = getHoseCodesForAtoms(molecule, [0, 1]);
    hoses = hoses.map((hose) => escape(hose));
    expect(hoses).toStrictEqual([
      'eF@Hp%5CIPUA%7Eb%60xUTxUP',
      'gC%60HADIMUIPNEJATGeHW_hdcaUIpj%60',
      'gJPHADIMuTe@xThEP%5Eta%5Dl%7FQIGBjSaU@',
      'gJPHADIMuTe@XThEP_hdcaUIpj%60',
      'gJPHADIMuTe@XThEP_hdcaUIpj%60',
    ]);
  });
  it('Hc1ccccc1 double marked atoms in aromatic', () => {
    let molecule = Molecule.fromSmiles('Cc1ccccc1');
    molecule.setAtomicNo(0, 1);
    molecule.addImplicitHydrogens();
    const results = [];
    for (let i = 0; i < molecule.getAllAtoms(); i++) {
      results.push(
        getHoseCodesForAtoms(molecule, [i], { maxSphereSize: 0 })[0],
      );
    }
    expect(results).toStrictEqual([
      'fH@NJ`\x7FRapj`',
      'fH@NJ`\x7FRapj`',
      'fH@NJ`\x7FRapj`',
      'fH@NJ`\x7FRapj`',
      'fH@NJ`\x7FRapj`',
      'fH@NJ`\x7FRapj`',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
    ]);
  });
});
