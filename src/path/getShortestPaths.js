/**
 * Get the shortest path between each pair of atoms in the molecule
 * @param {OCL.Molecule} molecule
 * @param {object} [options={}]
 * @param {string} [opions.fromLabel='H']
 * @param {string} [opions.toLabel='H']
 * @param {string} [opions.maxLength=4]
 * @returns {Array<Array>} A matrix containing on each cell (i,j) the shortest path from atom i to atom j
 */
export function getShortestPaths(molecule, options = {}) {
  const OCL = molecule.getOCL();
  const { fromLabel = '', toLabel = '', maxLength = 3 } = options;

  let fromAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(fromLabel);
  let toAtomicNumber = OCL.Molecule.getAtomicNoFromLabel(toLabel);

  const nbAtoms = molecule.getAllAtoms();
  let allShortestPaths = new Array(nbAtoms);
  for (let i = 0; i < nbAtoms; i++) {
    allShortestPaths[i] = new Array(nbAtoms);
  }

  for (let from = 0; from < nbAtoms; from++) {
    allShortestPaths[from][from] = [from];
    for (let to = from + 1; to < nbAtoms; to++) {
      if (
        (fromAtomicNumber === 0 ||
          molecule.getAtomicNo(from) === fromAtomicNumber) &&
        (toAtomicNumber === 0 || molecule.getAtomicNo(to) === toAtomicNumber)
      ) {
        let path = [];
        molecule.getPath(path, from, to, maxLength);
        if (path.length) {
          allShortestPaths[from][to] = path.slice();
          allShortestPaths[to][from] = path.reverse();
        } else {
          allShortestPaths[from][to] = null;
          allShortestPaths[to][from] = null;
        }
      } else {
        allShortestPaths[from][to] = null;
        allShortestPaths[to][from] = null;
      }
    }
  }

  return allShortestPaths;
}
