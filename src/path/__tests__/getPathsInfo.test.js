import OCL from 'openchemlib';

import { getPathsInfo } from '../getPathsInfo';

describe('getPathsInfo', () => {
  it('propane min:1, max:2', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    let pathsInfo = getPathsInfo(OCL, molecule, {
      fromLabel: 'H',
      toLabel: 'H',
      minLength: 1,
      maxLength: 3,
    });

    console.log(pathsInfo);

    expect(pathsInfo).toMatchSnapshot();
  });
});
