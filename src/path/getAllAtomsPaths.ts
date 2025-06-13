import type { Molecule } from 'openchemlib';

export interface GetAllAtomsPathsOptions {
  /**
   * Maximum path length to consider. All the paths from 0 to maxPathLength will be considered
   * @default 5
   */
  maxPathLength?: number;
}

export interface AtomPath {
  path: number[];
  pathLength: number;
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
    atomPaths.push({ path: [i], pathLength: 0 });
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
        const atom = currentAtoms[i] as number;
        const index = currentIndexes[i] as number;

        const previousPath = oneAtomPaths[sphere - 1]?.[index]?.path;
        if (!previousPath) {
          throw new Error(
            `Unexpected missing previousPath for sphere ${sphere - 1} and index ${index}`,
          );
        }
        for (let conn = 0; conn < molecule.getAllConnAtoms(atom); conn++) {
          const connectedAtom = molecule.getConnAtom(atom, conn);
          if (previousPath.includes(connectedAtom)) continue;
          nextIndexes.push(atomPaths.length);
          nextAtoms.push(connectedAtom);
          atomPaths.push({
            path: [...previousPath, connectedAtom],
            pathLength: sphere,
          });
        }
      }
    }
  }
  return allAtomsPaths;
}
