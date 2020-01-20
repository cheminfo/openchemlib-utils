import { getConnectivityMatrix } from '../util/getConnectivityMatrix';
import { tagAtom } from '../util/tagAtom';
import { getAtomsInfo } from '../util/getAtomsInfo';

let fragment;

export function getPathsInfo(OCL, molecule, options = {}) {
  const {
    fromLabel = 'H',
    toLabel = 'H',
    minLength = 1,
    maxLength = 4,
  } = options;

  fragment = new OCL.Molecule(0, 0);

  let fromAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(fromLabel);
  let toAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(toLabel);

  // we need to find all the atoms 'fromLabel' and 'toLabel'
  let atomsInfo = getAtomsInfo(OCL, molecule);

  let pathLengthMatrix = getConnectivityMatrix(OCL, molecule, {
    pathLength: true,
  });

  for (let from = 0; from < molecule.getAllAtoms(); from++) {
    atomsInfo[from].couplings = [];
    for (let to = 0; to < molecule.getAllAtoms(); to++) {
      if (from !== to) {
        if (molecule.getAtomicNo(from) === fromAtomicNumber) {
          if (molecule.getAtomicNo(to) === toAtomicNumber) {
            let pathLength = pathLengthMatrix[from][to];
            if (pathLength >= minLength && pathLength <= maxLength) {
              atomsInfo[from].couplings.push(
                getCoupling(
                  molecule,
                  from,
                  to,
                  pathLength,
                  atomsInfo[to].oclID,
                ),
              );
            }
          }
        }
      }
    }
  }

  return atomsInfo;
}

function getCoupling(molecule, from, to, pathLength, diaIDto) {
  molecule = molecule.getCompactCopy();
  tagAtom(OCL, molecule, from);
  tagAtom(OCL, molecule, to);

  let atoms = [];
  molecule.getPath(atoms, from, to, pathLength);
  let torsion;
  if (atoms.length === 4) {
    torsion = molecule.calculateTorsion(atoms);
  }

  let min = 0;
  let max = 0;
  let atomMask = new Array(molecule.getAllAtoms()).fill(false);
  let atomList = new Array(molecule.getAllAtoms()).fill(-1);
  let pathCodes = [];

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
    pathCodes.push(
      fragment.getCanonizedIDCode(
        OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
      ),
    );
  }

  return {
    atoms,
    to,
    torsion,
    pathCodes,
    diaIDto,
    length: pathLength,
  };
}
