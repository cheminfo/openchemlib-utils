import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { getHoseCodesFromDiastereotopicID } from '../getHoseCodesFromDiastereotopicID';

describe('getHoseCodesFromDiastereotopicID', () => {
  it('CC(Cl)CC', () => {
    const molecule = OCL.Molecule.fromIDCode('gJPHADILuTe@X`hOtbCpfuP');
    let hoses = getHoseCodesFromDiastereotopicID(molecule);
    hoses = hoses.map((hose) => escape(hose));
    expect(hoses).toStrictEqual([
      'fHdPAqTGzT%5EDvj@',
      'eFBBHcAqEA%7EdaxSZh',
      'gC%60HADIMTAqAP%5Edc%7DH%60%7CImT',
      'gJPHADILuTe@x%60hOZPlw_iDGaMj%60',
      'gJPHADILuTe@X%60hOtbCpfuP',
    ]);
  });

  it('CC(Cl)CC maxSphere:2', () => {
    const molecule = OCL.Molecule.fromIDCode('gJPHADILuTe@X`hOtbCpfuP');
    let hoses = getHoseCodesFromDiastereotopicID(molecule, {
      maxSphereSize: 2,
    });
    hoses = hoses.map((hose) => escape(hose));

    expect(hoses).toStrictEqual([
      'fHdPAqTGzT%5EDvj@',
      'eFBBHcAqEA%7EdaxSZh',
      'gC%60HADIMTAqAP%5Edc%7DH%60%7CImT',
    ]);
  });
});
