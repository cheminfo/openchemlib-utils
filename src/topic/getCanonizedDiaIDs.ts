import type { LightLogger } from 'cheminfo-types';

import { makeRacemic } from '../util/makeRacemic.js';
import { tagAtom } from '../util/tagAtom.js';

import type { TopicMolecule } from './TopicMolecule.js';

export interface GetCanonizedDiaIDsOptions {
  maxNbAtoms: number;
  logger: LightLogger;
}

export function getCanonizedDiaIDs(
  diaMol: TopicMolecule,
  options: GetCanonizedDiaIDsOptions,
) {
  const { logger, maxNbAtoms } = options;
  const moleculeWithH = diaMol.moleculeWithH;
  if (moleculeWithH.getAllAtoms() > maxNbAtoms) {
    logger.warn(
      `too many atoms to evaluate heterotopic chiral bonds: ${moleculeWithH.getAllAtoms()} > ${maxNbAtoms}`,
    );
    return [];
  }
  const heterotopicSymmetryRanks = diaMol.heterotopicSymmetryRanks;
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
