import type { HoseCodesForAtomsOptions } from '../hose/HoseCodesForAtomsOptions.ts';
import { getHoseCodesForAtomsAsStrings } from '../hose/getHoseCodesForAtomsAsStrings.ts';

import type { TopicMolecule } from './TopicMolecule.ts';

export interface HosesForPath {
  fromDiaID: string;
  paths: Array<{
    toDiaID: string;
    pathLength: number;
    path: number[];
    hoses: string[];
  }>;
}

export type HoseCodesForPathOptions = HoseCodesForAtomsOptions & {
  /**
   * The atomic number of the path starting atom
   */
  fromAtomicNo?: number;
  /**
   * The atomic number of the path ending atom
   */
  toAtomicNo?: number;
  /**
   * The minimum path length
   * @default 0
   */
  minPathLength?: number;
  /**
   * The maximum path length
   * @default topicMolecule.options.maxPathLength
   */
  maxPathLength?: number;
};

/**
 * For each atom we will return an array of objects
 * @param topicMolecule
 * @param options
 * @returns
 */
export function getCanonizedHoseCodesForPath(
  topicMolecule: TopicMolecule,
  options: HoseCodesForPathOptions = {},
): HosesForPath[] {
  const {
    minPathLength = 0,
    maxPathLength = topicMolecule.options.maxPathLength,
    toAtomicNo,
    fromAtomicNo,
  } = options;

  if (maxPathLength > topicMolecule.options.maxPathLength) {
    throw new Error(
      `maxPathLength cannot be larger than the one defined in topicMolecule: ${topicMolecule.options.maxPathLength}`,
    );
  }

  const atomsPaths = topicMolecule.atomsPaths;
  const molecule = topicMolecule.moleculeWithH;
  const results: HosesForPath[] = new Array(molecule.getAllAtoms());

  for (let fromAtom = 0; fromAtom < molecule.getAllAtoms(); fromAtom++) {
    results[fromAtom] = {
      fromDiaID: topicMolecule.diaIDs[fromAtom],
      paths: [],
    };
    if (fromAtomicNo && molecule.getAtomicNo(fromAtom) !== fromAtomicNo) {
      continue;
    }
    for (
      let pathLength = minPathLength;
      pathLength < maxPathLength;
      pathLength++
    ) {
      const pathOfSpecificLength = atomsPaths[fromAtom][pathLength];
      for (const path of pathOfSpecificLength) {
        const toAtom = path.path.at(-1) as number;
        if (toAtomicNo && molecule.getAtomicNo(toAtom) !== toAtomicNo) {
          continue;
        }
        results[fromAtom].paths.push({
          toDiaID: topicMolecule.diaIDs[toAtom],
          pathLength: path.pathLength,
          path: path.path,
          hoses: getHoseCodesForAtomsAsStrings(topicMolecule.moleculeWithH, {
            rootAtoms: path.path,
            tagAtoms: [fromAtom, toAtom],
          }),
        });
      }
    }
  }

  return results;
}
