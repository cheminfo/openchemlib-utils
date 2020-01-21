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
          { sphere: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { sphere: 1, oclID: 'eF@Hp%5CQP_iHNET' },
          { sphere: 2, oclID: 'gC%60HADIMUIPNHjC%7DHb%5CJh' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@XdhOtbQpj`',
        hoses: [
          { sphere: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { sphere: 1, oclID: 'gC%60HADIMTAqIP_iDcaU@' },
          { sphere: 2, oclID: 'gJPHADILuTe@xdhOtbQpj%60' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@X`hOtbCpfuP',
        hoses: [
          { sphere: 0, oclID: 'fHdPAqTGzT%5EDvj@' },
          { sphere: 1, oclID: 'eFBBHcAqEA%7EdaxSZh' },
          { sphere: 2, oclID: 'gC%60HADIMTAqAP_iDGaMj%60' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@XbhOtbIpj`',
        hoses: [
          { sphere: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { sphere: 1, oclID: 'eM@HzCbJC%7DIApj%60' },
          { sphere: 2, oclID: 'gJPHADILuTe@xbhOtbIpj%60' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@XahOtbEpj`',
        hoses: [
          { sphere: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { sphere: 1, oclID: 'eF@Hp%5CQP_iHNET' },
          { sphere: 2, oclID: 'eM@Df%60xb%60%7FRP%5CJh' },
        ],
      },
    ]);
  });
});
