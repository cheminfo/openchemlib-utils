import OCL from 'openchemlib';

import { getPathsInfo, initOCL } from '../src/index.js';

initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('CCO');
molecule.addImplicitHydrogens();
const atoms = getPathsInfo(molecule, {
  fromLabel: 'H',
  toLabel: 'H',
  minLength: 2,
  maxLength: 4,
});

for (let atom of atoms) {
  console.log(escape(atom.oclID));
  for (let path of atom.paths) {
    for (let hose of path.hoses) {
      console.log(`    ${escape(hose.oclID)}`);
    }
  }
}
