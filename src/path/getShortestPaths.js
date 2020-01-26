import OCL from 'openchemlib';

import { initOCL } from '../OCL';

const Graph = require('node-dijkstra');

initOCL(OCL);

/**
 * Get the shortest path between each pair of atoms in the molecule
 * @param {OCL.Molecule} molecule
 * @returns {Array} A matrix containing on each cell (i,j) the shortest path from atom i to atom j
 */
export function getShortestPaths(molecule) {
  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

  let nbAtoms = molecule.getAllAtoms();
  let graph = new Map();
  for (let i = 0; i < nbAtoms; i++) {
    graph.set(i, new Map());
    let l = molecule.getAllConnAtoms(i);
    for (let j = 0; j < l; j++) {
      graph.get(i).set(molecule.getConnAtom(i, j), 1);
    }
  }

  const route = new Graph(graph);

  let allShortestPaths = new Array(nbAtoms);
  for (let i = 0; i < nbAtoms; i++) {
    allShortestPaths[i] = new Array(nbAtoms);
  }

  for (let i = 0; i < nbAtoms; i++) {
    allShortestPaths[i][i] = [i];
    for (let j = i + 1; j < nbAtoms; j++) {
      let path = route.path(i, j);
      if (path) {
        allShortestPaths[i][j] = path.slice();
        allShortestPaths[j][i] = path.reverse();
      } else {
        allShortestPaths[i][j] = null;
        allShortestPaths[j][i] = null;
      }
    }
  }

  return allShortestPaths;
}
