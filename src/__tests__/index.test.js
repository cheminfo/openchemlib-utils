import OCL from 'openchemlib';

import { Util, initOCL } from '..';

describe('openchemlib-utils', () => {
  it('makeRacemic', () => {
    const molecule = OCL.Molecule.fromSmiles('C[C@H](Cl)CC');
    expect(() => Util.makeRacemic(molecule)).toThrow(
      'OCL has to be initialized',
    );
    initOCL(OCL);
    Util.makeRacemic(molecule);
    expect(molecule.getIDCode()).toBe('gJPHADILuTe@@');
  });

  it('isCsp3', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    expect(Util.isCsp3(molecule, 0)).toBe(true);
  });
});
