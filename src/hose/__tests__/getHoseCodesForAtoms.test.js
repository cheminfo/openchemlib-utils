import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { getHoseCodesForAtoms } from '../getHoseCodesForAtoms';

const { Molecule } = OCL;

describe('getHoseCodesForAtoms', () => {
  it('C*C(Cl)CC single marked atom', () => {
    const molecule = Molecule.fromSmiles('CC(Cl)CC');
    let hoses = getHoseCodesForAtoms(molecule, [0]);
    hoses = hoses.map((hose) => escape(hose));
    expect(hoses).toStrictEqual([
      'fH@NJ%60uOkoth%5CJh',
      'eF@Hp%5CQPZQgr%5DW%7Ed%60xUP',
      'gC%60HADIMUIPNHjCVbgOmKW%5B_tbIpj%60',
      'gJPHADIMuTe@xbhMFJ%5Ce%7CYZ%7BZ%5E%7FRHgBj@',
      'gJPHADIMuTe@xbhMFJ%5Ce%7CYZ%7BZ%5E%7FRHgBj@',
    ]);
  });
  it('C*C*(Cl)CC double marked atoms', () => {
    const molecule = Molecule.fromSmiles('CC(Cl)CC');
    let hoses = getHoseCodesForAtoms(molecule, [0, 1]);
    hoses = hoses.map((hose) => escape(hose));
    expect(hoses).toStrictEqual([
      'eF@Hp%5CIPUAiF_I%5DwzJCaUSaU@',
      'gC%60HADIMUIPNEJATFmEN_ZVnv%7FhdcaUIpj%60',
      'gJPHADIMuTe@xThEPZLTyKxruvt%7D%7EbRNETgBj@',
      'gJPHADIMuTe@xThEPZLTyKxruvt%7D%7EbRNETgBj@',
      'gJPHADIMuTe@xThEPZLTyKxruvt%7D%7EbRNETgBj@',
    ]);
  });
  it('Hc1ccccc1 double marked atoms in aromatic', () => {
    const molecule = Molecule.fromSmiles('Cc1ccccc1');
    molecule.setAtomicNo(0, 1);
    molecule.addImplicitHydrogens();
    const results = [];
    for (let i = 0; i < molecule.getAllAtoms(); i++) {
      results.push(
        getHoseCodesForAtoms(molecule, [i], { maxSphereSize: 0 })[0],
      );
    }
    expect(results).toStrictEqual([
      'fH@NJ`uWj\x7Fth\\Jj|D@',
      'fH@NJ`uWj\x7Fth\\Jj|D@',
      'fH@NJ`uWj\x7Fth\\Jj|D@',
      'fH@NJ`uWj\x7Fth\\Jj|D@',
      'fH@NJ`uWj\x7Fth\\Jj|D@',
      'fH@NJ`uWj\x7Fth\\Jj|D@',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
      'fHdrA\x7FRaDj`',
    ]);
  });
});
