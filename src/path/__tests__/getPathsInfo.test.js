import OCL from 'openchemlib';

import { getPathsInfo } from '../getPathsInfo';
import { initOCL } from '../../OCL';

initOCL(OCL);
describe('getPathsInfo', () => {
  it('propane min:1, max:2', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    let pathsInfo = getPathsInfo(molecule, {
      fromLabel: 'H',
      toLabel: 'H',
      minLength: 1,
      maxLength: 3,
    });

    expect(pathsInfo).toMatchSnapshot();
  });
});
