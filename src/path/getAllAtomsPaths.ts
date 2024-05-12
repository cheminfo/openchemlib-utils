import { Molecule } from 'openchemlib';

export interface GetAllAtomsPathsOptions {
  /**
   * Maximum path length to consider. All the paths from 0 to maxPathLength will be considered
   * @default 5
   */
  maxPathLength?: number;
}

interface AtomPath {
  path: number[];
  distance: number;
}

/**
 * We need to create an array of atoms
 * that contains an array of pathLength
 * that contains an array of object
 * @param molecule
 * @param options
 * @returns
 */
export function getAllAtomsPaths(
  molecule: Molecule,
  options: GetAllAtomsPathsOptions = {},
) {
  const { maxPathLength = 5 } = options;
  const allAtomsPaths = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const oneAtomPaths: AtomPath[][] = [];
    allAtomsPaths.push(oneAtomPaths);

    let atomPaths: AtomPath[] = [];
    atomPaths.push({ path: [i], distance: 0 });
    oneAtomPaths.push(atomPaths);

    let nextIndexes = [0];
    let nextAtoms = [i];

    for (let sphere = 1; sphere <= maxPathLength; sphere++) {
      atomPaths = [];
      oneAtomPaths.push(atomPaths);
      const currentIndexes = nextIndexes;
      const currentAtoms = nextAtoms;
      nextIndexes = [];
      nextAtoms = [];

      for (let i = 0; i < currentIndexes.length; i++) {
        const atom = currentAtoms[i];
        const index = currentIndexes[i];

        const previousPath = oneAtomPaths[sphere - 1][index].path;
        for (let conn = 0; conn < molecule.getConnAtoms(atom); conn++) {
          const connectedAtom = molecule.getConnAtom(atom, conn);
          if (previousPath.includes(connectedAtom)) continue;
          nextIndexes.push(atomPaths.length);
          nextAtoms.push(connectedAtom);
          atomPaths.push({
            path: [...previousPath, connectedAtom],
            distance: sphere,
          });
        }
      }
    }
  }
  return allAtomsPaths;
}
