/*import {getOCL} from '../OCL';
import { initOCL } from '../OCL';
const OCL = getOCL();
initOCL(OCL);
*/

import OCL from 'openchemlib';

import { initOCL } from '../OCL';

const Graph = require('node-dijkstra');

initOCL(OCL);

/**
 * Get the shortest path between each pair of atoms in the molecule
 * @param {*} molecule
 * @returns {Array} A matrix containing on each cell (i,j) the shortest path from atom i to atom j
 */
export function getShortestPaths(molecule) {
  // These parameters could be used if we want to filter the paths
  /* const {
    fromLabel = 'H',
    toLabel = 'H',
    minLength = 1,
    maxLength = 4,
  } = options; */

  // let fromAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(fromLabel);
  // let toAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(toLabel);

  // We need to find all the atoms 'fromLabel' and 'toLabel'
  // let atomsInfo = getAtomsInfo(molecule);
  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

  let nbAtoms = molecule.getAllAtoms();
  let graph = {};
  for (let i = 0; i < nbAtoms; i++) {
    graph[i] = {};
    let l = molecule.getAllConnAtoms(i);
    for (let j = 0; j < l; j++) {
      graph[i][molecule.getConnAtom(i, j)] = 1;
    }
  }
  // console.log(graph)
  const route = new Graph(graph);

  let allShortestPaths = new Array(nbAtoms);
  for (let i = 0; i < nbAtoms; i++) {
    allShortestPaths[i] = new Array(nbAtoms);
  }

  for (let i = 0; i < nbAtoms; i++) {
    allShortestPaths[i][i] = i;
    for (let j = i + 1; j < nbAtoms; j++) {
      let path = route.path(`${i}`, `${j}`);
      allShortestPaths[i][j] = path.slice();
      allShortestPaths[j][i] = path.reverse();
    }
  }

  return allShortestPaths;
}
/*
let molecule = OCL.Molecule.fromSmiles('CC');
molecule.addImplicitHydrogens();
console.log(getShortestPaths(molecule));
*/
