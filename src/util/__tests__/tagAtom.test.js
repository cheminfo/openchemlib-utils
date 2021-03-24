import OCL from 'openchemlib';

import { tagAtom } from '../tagAtom';

describe('tagAtom', () => {
  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    tagAtom(molecule, 0);
    expect(
      escape(
        molecule.getCanonizedIDCode(
          OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
        ),
      ),
    ).toBe('eM@Df%60Xb%60%7FRP%5CJh');
    molecule = OCL.Molecule.fromSmiles('CCC');
    tagAtom(molecule, 1);
    expect(
      escape(
        molecule.getCanonizedIDCode(
          OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
        ),
      ),
    ).toBe('eM@HzAbJC%7DIApj%60');
  });
});
