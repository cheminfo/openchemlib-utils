import type { Molecule } from 'openchemlib';
import { CanonizerUtil } from 'openchemlib';

import { TopicMolecule } from '../../src/topic/TopicMolecule.ts';
import { getUnsaturation } from '../../src/util/getUnsaturation.ts';

/** The values the global checks of `getNMRHints` compare between the two structures. */
export interface MoleculeFacts {
  mf: string;
  /** double bond equivalent, `undefined` when the formula has an unsupported element */
  dbe: number | undefined;
  idCode: string;
  noStereoIdCode: string;
  tautomerIdCode: string;
  /** distinct diastereotopic IDs, what the symmetry check counts */
  diaIDCount: number;
}

/**
 * Computes, for one structure, the values `getNMRHints` compares.
 * @param molecule - the structure; it is never modified
 * @returns the formula, DBE, idCode variants and symmetry count
 */
export function getMoleculeFacts(molecule: Molecule): MoleculeFacts {
  const mf = molecule.getMolecularFormula().formula;
  return {
    mf,
    dbe: getUnsaturation(mf),
    idCode: molecule.getIDCode(),
    noStereoIdCode: CanonizerUtil.getIDCode(molecule, CanonizerUtil.NOSTEREO),
    tautomerIdCode: CanonizerUtil.getIDCode(molecule, CanonizerUtil.TAUTOMER),
    diaIDCount: Object.keys(new TopicMolecule(molecule).getDiaIDsObject())
      .length,
  };
}
