import OCL from 'openchemlib';

import { initOCL } from '../../OCL';
import { getDiastereotopicAtomIDs } from '../getDiastereotopicAtomIDs';

initOCL(OCL);
describe('getDiastereotopicAtomIDs', () => {
  it('CC(Cl)CC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    let ids = getDiastereotopicAtomIDs(molecule);
    expect(ids).toStrictEqual([
      'gJPHADIMuTe@XbhOtbIpj`',
      'gJPHADILuTe@XdhOtbQpj`',
      'gJPHADILuTe@X`hOtbCpfuP',
      'gJPHADILuTe@XbhOtbIpj`',
      'gJPHADILuTe@XahOtbEpj`',
    ]);
  });
});
