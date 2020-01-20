import floydWarshall from 'ml-floyd-warshall';
import { Matrix } from 'ml-matrix';

export function getConnectivityMatrix(OCL, molecule, options = {}) {
  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
  let nbAtoms = molecule.getAllAtoms();

  let result = new Array(nbAtoms).fill();
  result = result.map(() => new Array(nbAtoms).fill(0));

  if (!options.pathLength) {
    if (options.atomicNo) {
      for (let i = 0; i < nbAtoms; i++) {
        result[i][i] = molecule.getAtomicNo(i);
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
