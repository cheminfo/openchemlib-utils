import { getHoseCodesForPath } from '../hose/getHoseCodesForPath';
import { getAtomsInfo } from '../util/getAtomsInfo';
import { getConnectivityMatrix } from '../util/getConnectivityMatrix';

let fragment;

/**
 *
 * @param {OCL.Molecule} molecule
 * @param {object} [options={}]
 * @param {string} [opions.fromLabel='H']
 * @param {string} [opions.toLabel='H']
 * @param {string} [opions.minLength=1]
 * @param {string} [opions.maxLength=4]

 */
export function getPathsInfo(molecule, options = {}) {
  const {
    fromLabel = 'H',
    toLabel = 'H',
    minLength = 1,
    maxLength = 4,
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
              atomsInfo[from].paths.push(
                getHoseCodesForPath(
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
