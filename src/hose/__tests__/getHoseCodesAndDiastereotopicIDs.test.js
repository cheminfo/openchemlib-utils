import OCL from 'openchemlib';

import { getHoseCodesAndDiastereotopicIDs } from '../getHoseCodesAndDiastereotopicIDs';
import { initOCL } from '../../OCL';

initOCL(OCL);

describe('getHoseCodesAndDiastereotopicIDs', () => {
  it('CC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC');
    let diaIDs = getHoseCodesAndDiastereotopicIDs(molecule, {
      maxSphereSize: 2,
    });
    let hoses = [];
    diaIDs.forEach((diaID) => {
      diaID.hoses.forEach((hose) => {
        hoses.push(escape(hose.oclID));
      });
    });
    expect(hoses).toEqual([
      'fH@NJ%60%7FRapj%60',
      'eF@Hp%5CQP%5EcotdGBj@',
      'eF@HpLQP_iHNET',
      'fH@NJ%60%7FRapj%60',
      'eF@Hp%5CQP%5EcotdGBj@',
      'eF@HpLQP_iHNET',
    ]);
  });

  it('CC(Cl)CC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    let diaIDs = getHoseCodesAndDiastereotopicIDs(molecule, {
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
          { sphere: 1, oclID: 'eF@Hp%5CQP%5EcotdGBj@' },
          { sphere: 2, oclID: 'gC%60HADIMUIPNHjCrdKotbIpj%60' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@XdhOtbQpj`',
        hoses: [
          { sphere: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { sphere: 1, oclID: 'gC%60HADIMTAqIP%5Edc%7DHd%5CJh' },
          { sphere: 2, oclID: 'gJPHADILuTe@xdhOZPlw_iDcaU@' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@X`hOtbCpfuP',
        hoses: [
          { sphere: 0, oclID: 'fHdPAqTGzT%5EDvj@' },
          { sphere: 1, oclID: 'eFBBHcAqEA%7EdaxSZh' },
          { sphere: 2, oclID: 'gC%60HADIMTAqAP%5Edc%7DH%60%7CImT' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@XbhOtbIpj`',
        hoses: [
          { sphere: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { sphere: 1, oclID: 'eM@HzCbJCtY%7Ed%60xUP' },
          { sphere: 2, oclID: 'gJPHADILuTe@xbhOZPlO_iDSaU@' },
        ],
      },
      {
        oclID: 'gJPHADILuTe@XahOtbEpj`',
        hoses: [
          { sphere: 0, oclID: 'fH@NJ%60%7FRapj%60' },
          { sphere: 1, oclID: 'eF@Hp%5CQP%5EcotdGBj@' },
          { sphere: 2, oclID: 'eM@Df%60xb%60%7CgV_iHNET' },
        ],
      },
    ]);
  });
});
