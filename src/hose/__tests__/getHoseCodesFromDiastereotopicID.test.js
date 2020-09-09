import OCL from 'openchemlib';

import { initOCL } from '../../OCL';
import { getHoseCodesFromDiastereotopicID } from '../getHoseCodesFromDiastereotopicID';

initOCL(OCL);

describe('getHoseCodeFromDiastereotopicID', () => {
  it('CC(Cl)CC', () => {
    let hoses = getHoseCodesFromDiastereotopicID('gJPHADILuTe@X`hOtbCpfuP');
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
    let hoses = getHoseCodesFromDiastereotopicID('gJPHADILuTe@X`hOtbCpfuP', {
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
