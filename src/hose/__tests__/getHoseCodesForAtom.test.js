import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { getHoseCodesForAtom } from '../getHoseCodesForAtom';

describe('getHoseCodesForAtom', () => {
  it('CCC', () => {
    const molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    let hoses = getHoseCodesForAtom(molecule, 0);
    hoses = hoses.map((hose) => escape(hose));

    expect(hoses).toStrictEqual([
      'fH@NJ%60uOkoth%5CJh',
      'eF@Hp%5CQPZQgr%5DW%7Ed%60xUP',
      'gC%60HADIMUIPNHjCVbgOmKW%5B_tbIpj%60',
      'gJPHADIMuTe@xbhMFJ%5Ce%7CYZ%7BZ%5E%7FRHgBj@',
      'gJPHADIMuTe@xbhMFJ%5Ce%7CYZ%7BZ%5E%7FRHgBj@',
    ]);
  });
});
