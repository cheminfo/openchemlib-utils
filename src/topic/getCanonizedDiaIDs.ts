import { makeRacemic } from '../util/makeRacemic.js';
import { tagAtom } from '../util/tagAtom.js';

import { TopicMolecule } from './TopicMolecule.js';

export function getCanonizedDiaIDs(diaMol: TopicMolecule) {
  const heterotopicSymmetryRanks = diaMol.heterotopicSymmetryRanks;
  const moleculeWithH = diaMol.moleculeWithH;
  const finalRanks = diaMol.finalRanks;
  const canonizedDiaIDs = new Array(moleculeWithH.getAllAtoms());
  moleculeWithH.ensureHelperArrays(
    //@ts-expect-error TODO
    diaMol.Molecule.cHelperSymmetryStereoHeterotopicity,
  );
  const cache: Record<string, any> = {};
  for (let i = 0; i < diaMol.moleculeWithH.getAllAtoms(); i++) {
    const rank = heterotopicSymmetryRanks[i];
    if (rank && cache[rank]) {
      canonizedDiaIDs[finalRanks[i]] = cache[rank].diaID;
      continue;
    }
    const tempMolecule = diaMol.moleculeWithH.getCompactCopy();
    tagAtom(tempMolecule, i);
    makeRacemic(tempMolecule);
    const diaID = tempMolecule.getCanonizedIDCode(
      //@ts-expect-error TODO
      diaMol.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
    );
    canonizedDiaIDs[finalRanks[i]] = diaID;
  }
  return canonizedDiaIDs;
}
