import { makeRacemic } from '../util/makeRacemic.js';
import { tagAtom } from '../util/tagAtom';

import { TopicMolecule } from './TopicMolecule.js';

export function getCanonizedDiaIDs(diaMol: TopicMolecule) {
  const heterotopicSymmetryRanks = diaMol.heterotopicSymmetryRanks;
  const moleculeWithH = diaMol.moleculeWithH;
  const finalRanks = diaMol.finalRanks;
  const canonizedDiaIDs = new Array(moleculeWithH.getAllAtoms());
  moleculeWithH.ensureHelperArrays(
    diaMol.molecule.getOCL().Molecule.cHelperSymmetryStereoHeterotopicity,
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
      diaMol.molecule.getOCL().Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
    );
    canonizedDiaIDs[finalRanks[i]] = diaID;
  }
  return canonizedDiaIDs;
}
