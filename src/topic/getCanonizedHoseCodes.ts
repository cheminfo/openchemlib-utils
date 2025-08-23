import { getHoseCodesForAtomsAsStrings } from '../hose/getHoseCodesForAtomsAsStrings.js';
import { tagAtom } from '../util/tagAtom.ts';

import type { TopicMolecule } from './TopicMolecule.ts';

/**
 * Get the canonized hose codes for a topic molecule. It will use the moleculeWithH
 * @param topicMolecule - The topic molecule to get the hose codes for.
 * @returns The canonized hose codes.
 */
export function getCanonizedHoseCodes(
  topicMolecule: TopicMolecule,
): string[][] {
  const options = topicMolecule.options;
  const heterotopicSymmetryRanks = topicMolecule.heterotopicSymmetryRanks;
  const moleculeWithH = topicMolecule.moleculeWithH;
  const finalRanks = topicMolecule.finalRanks;
  const canonizedHoseCodes: string[][] = new Array(moleculeWithH.getAllAtoms());
  moleculeWithH.ensureHelperArrays(
    topicMolecule.molecule.getOCL().Molecule
      .cHelperSymmetryStereoHeterotopicity,
  );
  const cache: Record<string, any> = {};
  for (let i = 0; i < topicMolecule.moleculeWithH.getAllAtoms(); i++) {
    const rank = heterotopicSymmetryRanks[i];
    if (rank && cache[rank]) {
      canonizedHoseCodes[finalRanks[i]] = cache[rank].diaID;
      continue;
    }
    const tempMolecule = topicMolecule.moleculeWithH.getCompactCopy();
    tagAtom(tempMolecule, i);
    const hoses = getHoseCodesForAtomsAsStrings(tempMolecule, options);
    canonizedHoseCodes[finalRanks[i]] = hoses;
  }
  return canonizedHoseCodes;
}
