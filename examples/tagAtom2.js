// run with ts-node-transpile-only 

import OCL from 'openchemlib';

import { tagAtom, initOCL } from '../src';

initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('C');

molecule.addImplicitHydrogens();

tagAtom(molecule, 2);
tagAtom(molecule, 3);
console.log(
  molecule.getCanonizedIDCode(OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS),
);
