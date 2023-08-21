// ts-node-transpile-only handleHydrogenMap.js

import OCL from 'openchemlib';

const molecule = OCL.Molecule.fromSmiles('CO');

molecule.addImplicitHydrogens();

molecule.setAtomicNo(5, 9);

console.log(molecule.getHandleHydrogenMap());

molecule.setAtomicNo(4, 9);

console.log(molecule.getHandleHydrogenMap());

molecule.ensureHelperArrays(255);

console.log(molecule.getHandleHydrogenMap());
