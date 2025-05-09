import { getHoseCodesForPath } from '../hose/getHoseCodesForPath.js';
import { getAtomsInfo } from '../util/getAtomsInfo.js';
import { getConnectivityMatrix } from '../util/getConnectivityMatrix.js';

import { getPathAndTorsion } from './getPathAndTorsion.js';

let fragment;

/**
 *
 * @param {import('openchemlib').Molecule} molecule
 * @param {object} [options={}]
 * @param {string} [options.fromLabel='H']
 * @param {string} [options.toLabel='H']
 * @param {number} [options.minLength=1]
 * @param {number} [options.maxLength=4]
 * @param {boolean} [options.withHOSES=false]
 */
export function getPathsInfo(molecule, options = {}) {
  const {
    fromLabel = 'H',
    toLabel = 'H',
    minLength = 1,
    maxLength = 4,
    withHOSES = false,
  } = options;

  const OCL = molecule.getOCL();

  if (!fragment) {
    fragment = new OCL.Molecule(0, 0);
  }

  const fromAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(fromLabel);
  const toAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(toLabel);

  // we need to find all the atoms 'fromLabel' and 'toLabel'
  const atomsInfo = getAtomsInfo(molecule);

  const pathLengthMatrix = getConnectivityMatrix(molecule, {
    pathLength: true,
  });

  for (let from = 0; from < molecule.getAllAtoms(); from++) {
    atomsInfo[from].paths = [];
    for (let to = 0; to < molecule.getAllAtoms(); to++) {
      if (
        from !== to &&
        molecule.getAtomicNo(from) === fromAtomicNumber &&
        molecule.getAtomicNo(to) === toAtomicNumber
      ) {
        const pathLength = pathLengthMatrix[from][to];
        if (pathLength >= minLength && pathLength <= maxLength) {
          if (withHOSES) {
            atomsInfo[from].paths.push(
              getHoseCodesForPath(molecule, from, to, pathLength),
            );
          } else {
            atomsInfo[from].paths.push(
              getPathAndTorsion(molecule, from, to, pathLength),
            );
          }
        }
      }
    }
  }

  return atomsInfo;
}
