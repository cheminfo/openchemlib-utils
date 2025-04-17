import { getHoseCodesForAtomsInternal } from '../hose/getHoseCodesForAtomsInternal.js';
import { tagAtom } from '../util/tagAtom.js';

import type { TopicMolecule } from './TopicMolecule.js';

export function getCanonizedHoseCodes(topicMolecule: TopicMolecule) {
  const options = topicMolecule.options;
  const heterotopicSymmetryRanks = topicMolecule.heterotopicSymmetryRanks;
  const moleculeWithH = topicMolecule.moleculeWithH;
  const finalRanks = topicMolecule.finalRanks;
  const canonizedHoseCodes = new Array(moleculeWithH.getAllAtoms());
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
    const hoses = getHoseCodesForAtomsInternal(tempMolecule, options);
    canonizedHoseCodes[finalRanks[i]] = hoses;
  }
  return canonizedHoseCodes;
}
