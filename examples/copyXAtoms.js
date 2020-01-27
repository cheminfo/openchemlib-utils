import OCL from 'openchemlib';

import { initOCL } from '../src';

initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('C');
molecule.addImplicitHydrogens();
molecule.setAtomicNo(2, 153); // we set a 'X' as atom

molecule.ensureHelperArrays(65535);

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

console.log(copy.getAtomicNo(1)); // returns 153
console.log(copy.getAtomicNo(2)); // returns -1
