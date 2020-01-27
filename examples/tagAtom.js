// run with `node -r esm ./getPathsInfo.js`

import OCL from 'openchemlib';

import { tagAtom, initOCL } from '../src';

initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('CO');

molecule.addImplicitHydrogens();

for (let i = 0; i < molecule.getAllAtoms(); i++) {
  for (let j = 0; j < molecule.getAllAtoms(); j++) {
    const copy = molecule.getCompactCopy();
    tagAtom(copy, i);
    tagAtom(copy, j);
    console.log(
      copy.getCanonizedIDCode(OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS),
    );
  }
}
