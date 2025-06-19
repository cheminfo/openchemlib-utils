import { Molecule } from 'openchemlib';

const molecule = Molecule.fromIDCode('gJPHADILuTe@X`hOtbCpfuP');
hoseFromCl(molecule);

function hoseFromCl(molecule) {
  molecule = molecule.getCompactCopy();
  const minSphereSize = 0;
  const maxSphereSize = 2;
  const fragments = [];
  const OCL = molecule.getOCL();
  // keep track of the atoms when creating the fragment
  const mappings = [];
  let min = 0;
  let max = 0;
  const atomMask = new Array(molecule.getAllAtoms());
  const atomList = new Uint8Array(molecule.getAllAtoms());

  const rootAtoms = [0]; // Cl

  for (let sphere = 0; sphere <= maxSphereSize; sphere++) {
    if (max === 0) {
      for (const rootAtom of rootAtoms) {
        atomList[max] = rootAtom;
        atomMask[rootAtom] = true;
        max++;
      }
    } else {
      let newMax = max;
      for (let i = min; i < max; i++) {
        const atom = atomList[i];
        for (let j = 0; j < molecule.getAllConnAtoms(atom); j++) {
          const connAtom = molecule.getConnAtom(atom, j);
          if (!atomMask[connAtom]) {
            atomMask[connAtom] = true;
            atomList[newMax++] = connAtom;
          }
        }
      }
      min = max;
      max = newMax;
    }

    if (sphere >= minSphereSize) {
      const fragment = new OCL.Molecule(0, 0);
      molecule.copyMoleculeByAtoms(fragment, atomMask, true, mappings);
      // we using atomMapNo field in order to keep track of the original atom number even if we remove hydrogens

      for (let i = 0; i < fragment.getAllAtoms(); i++) {
        fragment.setAtomMapNo(i, mappings.indexOf(i) + 1);
      }
      fragment.removeExplicitHydrogens();

      // we encode atom characteristics in the query features
      addQueryFeaturesAndRemoveMapNo(fragment, molecule);
      fragments.push(fragment);
      console.log(fragment.getIDCode());
    }
  }
  return fragments;
}

/**
 * If the atom is not an halogen, X or an hydrogen
 * we add query features to the atom
 * This includes aromaticity, ring size, number of hydrogens
 * @param {import('openchemlib').Molecule} fragment
 * @param {import('openchemlib').Molecule} molecule
 */
function addQueryFeaturesAndRemoveMapNo(fragment, molecule) {
  const Molecule = molecule.getOCL().Molecule;
  for (let i = 0; i < fragment.getAllAtoms(); i++) {
    const mapping = fragment.getAtomMapNo(i) - 1;
    fragment.setAtomMapNo(i, 0);
    if ([1, 9, 17, 35, 53].includes(fragment.getAtomicNo(i))) {
      continue;
    }

    const nbHydrogens = molecule.getAllHydrogens(mapping);
    if (nbHydrogens === 0) {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot0Hydrogen, false);
    } else {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot0Hydrogen, true);
    }
    if (nbHydrogens === 1) {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot1Hydrogen, false);
    } else {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot1Hydrogen, true);
    }
    if (nbHydrogens === 2) {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot2Hydrogen, false);
    } else {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot2Hydrogen, true);
    }
    if (nbHydrogens === 3) {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot3Hydrogen, false);
    } else {
      fragment.setAtomQueryFeature(i, Molecule.cAtomQFNot3Hydrogen, true);
    }
  }
}
