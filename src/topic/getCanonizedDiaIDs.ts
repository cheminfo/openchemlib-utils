import type { TopicMolecule } from './TopicMolecule.ts';
import { getEnantioIDs } from './getEnantioIDs.ts';

/**
 * Computes canonical diastereotopic IDs indexed by `finalRanks` (not by atom
 * position). The rank-indexed layout is required so that the cached array can
 * be reused across `TopicMolecule` instances with the same `idCode` but
 * different atom orderings (see `fromMolecule`).
 * @param topicMolecule
 */
export function getCanonizedDiaIDs(topicMolecule: TopicMolecule): string[] {
  // `racemic: true` collapses the absolute enantioIDs into diaIDs that are
  // identical for both enantiomers (they encode the diastereotopic environment
  // only, not the absolute configuration).
  const atomIDs = getEnantioIDs(topicMolecule, { racemic: true });
  const finalRanks = topicMolecule.finalRanks;
  const canonized = new Array<string>(atomIDs.length);
  for (let i = 0; i < atomIDs.length; i++) {
    canonized[finalRanks[i]] = atomIDs[i];
  }
  return canonized;
}
