import { makeRacemic } from '../util/makeRacemic';
import { tagAtom } from '../util/tagAtom';

let fragment;

/**
 * Returns the hose code for a specific atom number
 * @param {OCL.Molecule} molecule
 */
export function getHoseCodesForPath(molecule, from, to, maxLength) {
  const OCL = molecule.getOCL();
  const originalFrom = from;
  const originalTo = to;
  molecule = molecule.getCompactCopy();

  let originalAtoms = []; // path before renumbering
  molecule.getPath(originalAtoms, from, to, maxLength + 1);
  let torsion;
  if (originalAtoms.length === 4) {
    torsion = molecule.calculateTorsion(originalAtoms);
  }

  const tag1 = tagAtom(molecule, from);
  const tag2 = tagAtom(molecule, to);

  molecule.addImplicitHydrogens();
  molecule.addMissingChirality();

  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

  from = -1;
  to = -1;
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (tag1 === tag2) {
      if (molecule.getAtomCustomLabel(i) === tag1) {
        if (from === -1) {
          from = i;
        } else {
          to = i;
        }
      }
    } else {
      if (tag1 === molecule.getAtomCustomLabel(i)) {
        from = i;
      }
      if (tag2 === molecule.getAtomCustomLabel(i)) {
        to = i;
      }
    }
  }

  if (!fragment) fragment = new OCL.Molecule(0, 0);

  let atoms = [];
  molecule.getPath(atoms, from, to, maxLength + 1);

  let min = 0;
  let max = 0;
  let atomMask = new Array(molecule.getAllAtoms()).fill(false);
  let atomList = new Array(molecule.getAllAtoms()).fill(-1);
  let hoses = [];

  for (let sphere = 0; sphere <= 2; sphere++) {
    if (max === 0) {
      for (let atom of atoms) {
        atomMask[atom] = true;
        atomList[max++] = atom;
      }
    } else {
      let newMax = max;
      for (let i = min; i < max; i++) {
        let atom = atomList[i];
        for (let j = 0; j < molecule.getAllConnAtoms(atom); j++) {
          let connAtom = molecule.getConnAtom(atom, j);
          if (!atomMask[connAtom]) {
            atomMask[connAtom] = true;
            atomList[newMax++] = connAtom;
          }
        }
      }
      min = max;
      max = newMax;
    }
    let atomMap = [];

    molecule.copyMoleculeByAtoms(fragment, atomMask, true, atomMap);
    makeRacemic(fragment);
    let oclID = fragment.getCanonizedIDCode(
      OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
    );

    hoses.push({
      sphere,
      oclID,
    });
  }

  return {
    atoms: originalAtoms,
    from: originalFrom,
    to: originalTo,
    torsion,
    hoses,
    length: originalAtoms.length - 1,
  };
}
