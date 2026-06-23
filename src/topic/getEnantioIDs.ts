import { getCompactCopyWithoutCustomLabels } from '../util/getCompactCopyWithoutCustomLabels.ts';
import { makeRacemic } from '../util/makeRacemic.js';
import { tagAtom } from '../util/tagAtom.ts';

import type { TopicMolecule } from './TopicMolecule.ts';

export interface GetEnantioIDsOptions {
  /**
   * When true, calls makeRacemic on the tagged probe before computing the
   * canonical ID, producing IDs identical for both enantiomers (same as
   * `diaIDs`). When false (default), absolute stereochemistry is preserved
   * so enantiomers yield distinct IDs.
   * @default false
   */
  racemic?: boolean;
}

/**
 * Computes a canonical ID for each atom in `moleculeWithH` by tagging it
 * and calling `getCanonizedIDCode`.
 * By default (`racemic: false`) the ID encodes absolute stereochemistry so
 * enantiomers produce distinct IDs — suitable as independent cache keys for
 * pro-R / pro-S assignment.
 * With `racemic: true` the probe is first racemized (same logic as `diaIDs`),
 * yielding IDs that are identical for both enantiomers.
 * @param topicMolecule
 * @param options
 */
export function getEnantioIDs(
  topicMolecule: TopicMolecule,
  options: GetEnantioIDsOptions = {},
): string[] {
  const { racemic = false } = options;
  const moleculeWithH = topicMolecule.moleculeWithH;
  const { Molecule } = moleculeWithH.getOCL();
  const heterotopicSymmetryRanks = topicMolecule.heterotopicSymmetryRanks;
  const ids = new Array<string>(moleculeWithH.getAllAtoms());
  const cache: Record<number, string> = {};
  for (let i = 0; i < moleculeWithH.getAllAtoms(); i++) {
    const rank = heterotopicSymmetryRanks[i];
    if (rank && cache[rank]) {
      ids[i] = cache[rank];
      continue;
    }
    const tempMolecule = getCompactCopyWithoutCustomLabels(moleculeWithH);
    tagAtom(tempMolecule, i);
    if (racemic) makeRacemic(tempMolecule);
    const id = tempMolecule.getCanonizedIDCode(
      Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
    );
    ids[i] = id;
    if (rank) cache[rank] = id;
  }
  return ids;
}
