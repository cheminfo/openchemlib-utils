import floydWarshall from 'ml-floyd-warshall';
import { Matrix } from 'ml-matrix';

/**
 * Returns a connectivity matrix
 * @param {OCL.Molecule} molecule
 * @param {object} [options={}]
 * @param {boolean} [options.pathLength=false] get the path length between atoms
 * @param {boolean} [options.mass=false] set the nominal mass of the atoms on diagonal
 * @param {boolean} [options.atomicNo=false] set the atomic number of the atom on diagonal
 * @param {boolean} [options.negativeAtomicNo=false] set the atomic number * -1 of the atom on diagonal
 * @param {boolean} [options.sdt=false] set 1, 2 or 3 depending if single, double or triple bond
 * @param {boolean} [options.sdta=false] set 1, 2, 3 or 4 depending if single, double, triple or aromatic  bond
 */
export function getConnectivityMatrix(molecule, options = {}) {
  const OCL = molecule.getOCL();
  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
  let nbAtoms = molecule.getAllAtoms();

  let result = new Array(nbAtoms).fill();
  result = result.map(() => new Array(nbAtoms).fill(0));

  if (!options.pathLength) {
    if (options.atomicNo) {
      for (let i = 0; i < nbAtoms; i++) {
        result[i][i] = molecule.getAtomicNo(i);
      }
    } else if (options.negativeAtomicNo) {
      for (let i = 0; i < nbAtoms; i++) {
        result[i][i] = -molecule.getAtomicNo(i);
      }
    } else if (options.mass) {
      for (let i = 0; i < nbAtoms; i++) {
        result[i][i] = OCL.Molecule.cRoundedMass[molecule.getAtomicNo(i)];
      }
    } else {
      for (let i = 0; i < nbAtoms; i++) {
        result[i][i] = 1;
      }
    }
  }

  if (options.sdt) {
    for (let i = 0; i < nbAtoms; i++) {
      let l = molecule.getAllConnAtoms(i);
      for (let j = 0; j < l; j++) {
        result[i][molecule.getConnAtom(i, j)] = molecule.getConnBondOrder(i, j);
      }
    }
  } else if (options.sdta) {
    for (let i = 0; i < nbAtoms; i++) {
      let l = molecule.getAllConnAtoms(i);
      for (let j = 0; j < l; j++) {
        let bondNumber = molecule.getConnBond(i, j);
        if (molecule.isAromaticBond(bondNumber)) {
          result[i][molecule.getConnAtom(i, j)] = 4;
        } else {
          result[i][molecule.getConnAtom(i, j)] = molecule.getConnBondOrder(
            i,
            j,
          );
        }
      }
    }
  } else {
    for (let i = 0; i < nbAtoms; i++) {
      let l = molecule.getAllConnAtoms(i);
      for (let j = 0; j < l; j++) {
        result[i][molecule.getConnAtom(i, j)] = 1;
      }
    }
  }

  if (options.pathLength) {
    result = floydWarshall(new Matrix(result)).to2DArray();
  }
  return result;
}
