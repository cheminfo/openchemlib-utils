// run with `node -r esm ./getPathsInfo.js`

import OCL from 'openchemlib';

import { tagAtom, initOCL, getHoseCodesForAtom } from '../src';

initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('CO');

molecule.addImplicitHydrogens();

for (let i = 0; i < molecule.getAllAtoms(); i++) {
  const copy = molecule.getCompactCopy();
  const hoses = getHoseCodesForAtom(copy, i);
  for (let hose of hoses) {
    console.log(escape(hose));
  }
}
