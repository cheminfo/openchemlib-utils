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
      'fHdPAqJGzT%5EDvj@',
      'eFBBHcAqBa%7EdaxSZh',
      'gC%60HADIMTAq@h_iDGaMj%60',
      'gJPHADILuTe@x%60TOtbCpfuP',
      'gJPHADILuTe@x%60TOtbCpfuP',
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
      'fHdPAqJGzT%5EDvj@',
      'eFBBHcAqBa%7EdaxSZh',
      'gC%60HADIMTAq@h_iDGaMj%60',
    ]);
  });
});
