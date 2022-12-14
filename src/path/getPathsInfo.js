import { getHoseCodesForPath } from '../hose/getHoseCodesForPath';
import { getAtomsInfo } from '../util/getAtomsInfo';
import { getConnectivityMatrix } from '../util/getConnectivityMatrix';

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

  let fromAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(fromLabel);
  let toAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(toLabel);

  // we need to find all the atoms 'fromLabel' and 'toLabel'
  let atomsInfo = getAtomsInfo(molecule);

  let pathLengthMatrix = getConnectivityMatrix(molecule, {
    pathLength: true,
  });

  for (let from = 0; from < molecule.getAllAtoms(); from++) {
    atomsInfo[from].paths = [];
    for (let to = 0; to < molecule.getAllAtoms(); to++) {
      if (from !== to) {
        if (molecule.getAtomicNo(from) === fromAtomicNumber) {
          if (molecule.getAtomicNo(to) === toAtomicNumber) {
            let pathLength = pathLengthMatrix[from][to];
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
    }
  }

  return atomsInfo;
}
