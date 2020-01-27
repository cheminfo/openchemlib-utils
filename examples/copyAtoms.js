// run with `node -r esm ./getPathsInfo.js`

import OCL from 'openchemlib';

import { initOCL } from '../src';

initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('C');
molecule.addImplicitHydrogens();

console.log(molecule.getAllAtoms()); // returns 5

const copy = new OCL.Molecule(0, 0);
copy.setFragment(false);
const atomMap = [];
molecule.copyMoleculeByAtoms(
  copy,
  [true, true, true, false, false],
  true,
  atomMap,
);

console.log(copy.getAllAtoms()); // returns 1

console.log(atomMap); // returns [ 0, 1, 2, -1, -1 ]

console.log(copy.getAtomicNo(1)); // returns -1
