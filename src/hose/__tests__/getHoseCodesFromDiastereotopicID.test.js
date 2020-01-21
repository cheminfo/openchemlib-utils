import OCL from 'openchemlib';

import { getHoseCodesFromDiastereotopicID } from '../getHoseCodesFromDiastereotopicID';

describe('getHoseCodeFromDiastereotopicID', () => {
  it('CC(Cl)CC', () => {
    let hoses = getHoseCodesFromDiastereotopicID(
      OCL,
      'gJPHADILuTe@X`hOtbCpfuP',
    );
    hoses = hoses.map((hose) => escape(hose));
    expect(hoses).toStrictEqual([
      'fHdPAqTGzT%5EDvj@',
      'eFBBHcAqEA%7EdaxSZh',
      'gC%60HADIMTAqAP_iDGaMj%60',
      'gJPHADILuTe@x%60hOtbCpfuP',
      'gJPHADILuTe@x%60hOtbCpfuP',
    ]);
  });

  it('CC(Cl)CC maxSphere:2', () => {
    let hoses = getHoseCodesFromDiastereotopicID(
      OCL,
      'gJPHADILuTe@X`hOtbCpfuP',
      { maxSphereSize: 2 },
    );
    hoses = hoses.map((hose) => escape(hose));
    expect(hoses).toStrictEqual([
      'fHdPAqTGzT%5EDvj@',
      'eFBBHcAqEA%7EdaxSZh',
      'gC%60HADIMTAqAP_iDGaMj%60',
    ]);
  });
});
