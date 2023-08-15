import { getHoseCodesForAtomsInternal } from '../hose/getHoseCodesForAtomsInternal.js';
import { tagAtom } from '../util/tagAtom.js';

import { HoseCodesOptions } from './HoseCodesOptions.js';
import { TopicMolecule } from './TopicMolecule.js';

export function getCanonizedHoseCodes(
  diaMol: TopicMolecule,
  options: HoseCodesOptions = {},
) {
  const heterotopicSymmetryRanks = diaMol.heterotopicSymmetryRanks;
  const moleculeWithH = diaMol.moleculeWithH;
  const finalRanks = diaMol.finalRanks;
  const canonizedHoseCodes = new Array(moleculeWithH.getAllAtoms());
  moleculeWithH.ensureHelperArrays(
    //@ts-expect-error TODO
    diaMol.Molecule.cHelperSymmetryStereoHeterotopicity,
  );
  const cache: Record<string, any> = {};
  for (let i = 0; i < diaMol.moleculeWithH.getAllAtoms(); i++) {
    const rank = heterotopicSymmetryRanks[i];
    if (rank && cache[rank]) {
      canonizedHoseCodes[finalRanks[i]] = cache[rank].diaID;
      continue;
    }
    const tempMolecule = diaMol.moleculeWithH.getCompactCopy();
    tagAtom(tempMolecule, i);
    const hoses = getHoseCodesForAtomsInternal(tempMolecule, options);
    canonizedHoseCodes[finalRanks[i]] = hoses;
  }
  return canonizedHoseCodes;
}
