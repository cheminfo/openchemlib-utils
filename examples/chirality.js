// run with ts-node-transpile-only 

import OCL from 'openchemlib';

import { initOCL } from '../src';

initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('CC(N)O');

molecule.addImplicitHydrogens();
molecule.setBondType(6, 17);

console.log(escape(molecule.getIDCode()));

molecule.setAtomicNo(8, 153);

for (let i = 0; i < molecule.getAllAtoms(); i++) {
  console.log(molecule.getAtomLabel(i));
}

for (let i = 0; i < molecule.getAllBonds(); i++) {
  console.log(
    i,
    molecule.getBondType(i),
    molecule.getBondAtom(0, i),
    molecule.getBondAtom(1, i),
  );
}

let fragment = new OCL.Molecule(0, 0);
let atomMask = [
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true, // copy hydrogen with chirality
];
molecule.copyMoleculeByAtoms(fragment, atomMask, true, null);

for (let i = 0; i < fragment.getAllAtoms(); i++) {
  console.log(fragment.getAtomLabel(i));
}

for (let i = 0; i < fragment.getAllBonds(); i++) {
  console.log(
    i,
    fragment.getBondType(i),
    fragment.getBondAtom(0, i),
    fragment.getBondAtom(1, i),
  );
}

console.log(
  molecule.getCanonizedIDCode(OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS),
);
