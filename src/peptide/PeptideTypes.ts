/**
 * How an identifier is spelled.
 *
 * - `greek` — the IUPAC identifiers: `Cβ`, `Hγ12`, `C′`.
 * - `roman` — the same with the Greek letters transliterated, recommended by
 *   IUPAC when they are unavailable: `CB`, `HG12`, `C'`.
 * - `pdb` — the PDB atom names: the Roman counterparts, with the backbone left
 *   unprimed as `C`, `O`, `OXT`, `HXT` and `H`.
 */
export type PeptideNaming = 'greek' | 'roman' | 'pdb';

export interface PeptideAtomName {
  /** The identifier without its element symbol, for instance `β2`, `γ1` or `′`. */
  descriptor: string;
  /** The full IUPAC identifier, for instance `Hβ2`. */
  name: string;
  /**
   * True when the number could not be derived from the structure, only from a
   * canonical order — the `1`/`2`/`3` of a freely rotating methyl, or a
   * prochiral pair whose configuration is unknown.
   */
  arbitrary: boolean;
}

export interface PeptideAtomLabel extends PeptideAtomName {
  atom: number;
  element: string;
  residueNumber: number;
  /** The string written as the OCL custom label. */
  label: string;
  /** CIP pro-chirality of a prochiral hydrogen, when known. */
  proChirality?: 'R' | 'S';
}
