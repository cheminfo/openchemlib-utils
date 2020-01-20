import OCL from 'openchemlib';

import { getHoseCodesAndDiastereotopicIDs } from '../getHoseCodesAndDiastereotopicIDs';

describe('getHoseCodesAndDiastereotopicIDs', () => {
  it('CC(Cl)CC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    let diaIDs = getHoseCodesAndDiastereotopicIDs(OCL, molecule, {
      maxSphereSize: 2,
    });
    //need to escape the values
    diaIDs.forEach((diaID) => {
      diaID.hoses.forEach((hose) => {
        hose.oclID = escape(hose.oclID);
      });
    });

    expect(diaIDs).toStrictEqual([
      {
        oclID: 'gJPHADIMuTe@XbhOtbIpj`',
        hoses: [
          { level: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { level: 1, oclID: 'eF@Hp%5CQP_iHNET' },
          { level: 2, oclID: 'gC%60HADIMUIPNHjC%7DHb%5CJh' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@XdhOtbQpj`',
        hoses: [
          { level: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { level: 1, oclID: 'gC%60HADIMTAqIP_iDcaU@' },
          { level: 2, oclID: 'gJPHADILuTe@xdhOtbQpj%60' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@X`hOtbCpfuP',
        hoses: [
          { level: 0, oclID: 'fHdPAqTGzT%5EDvj@' },
          { level: 1, oclID: 'eFBBHcAqEA%7EdaxSZh' },
          { level: 2, oclID: 'gC%60HADIMTAqAP_iDGaMj%60' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@XbhOtbIpj`',
        hoses: [
          { level: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { level: 1, oclID: 'eM@HzCbJC%7DIApj%60' },
          { level: 2, oclID: 'gJPHADILuTe@xbhOtbIpj%60' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@XahOtbEpj`',
        hoses: [
          { level: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { level: 1, oclID: 'eF@Hp%5CQP_iHNET' },
          { level: 2, oclID: 'eM@Df%60xb%60%7FRP%5CJh' },
        ],
      },
    ]);
  });
});
