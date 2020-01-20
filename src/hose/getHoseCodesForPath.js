import { tagAtom } from '../util/tagAtom';

let fragment;

/**
 * Returns the hose code for a specific atom number
 * @param {OCL} OCL
 * @param {OCL.Molecule} originalMolecule
 * @param {number} rootAtom
 * @param {object} [options={}]
 * @param {boolean} [options.isTagged] Specify is the atom is already tagged
 */
export function getHoseCodesForPath(OCL, molecule, from, to, pathLength) {
  molecule = molecule.getCompactCopy();

  if (!fragment) fragment = new OCL.Molecule(0, 0);

  tagAtom(OCL, molecule, from);
  tagAtom(OCL, molecule, to);

  let atoms = [];
  molecule.getPath(atoms, from, to, pathLength + 1);
  let torsion;
  if (atoms.length === 4) {
    torsion = molecule.calculateTorsion(atoms);
  }

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
        for (let j = 0; j < molecule.getConnAtoms(atom); j++) {
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
    molecule.copyMoleculeByAtoms(fragment, atomMask, true, null);
    hoses.push({
      sphere,
      oclID: fragment.getCanonizedIDCode(
        OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
      ),
    });
  }

  return {
    atoms,
    from,
    to,
    torsion,
    hoses,
    length: pathLength,
  };
}
