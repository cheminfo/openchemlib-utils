import type { Molecule } from 'openchemlib';
import { SSSearcher } from 'openchemlib';

export interface ApplyFragmentLabelsOptions {
  /**
   * Algorithm to use for substructure searching and matching the fragment to the molecule.
   * overlapping: create list not containing multiple matches sharing exactly the same atoms
   * firstMatch: create matchList with just one match
   * separated: create list of all non-overlapping matches / not optimized for maximum match count
   * rigorous: create list of all possible matches neglecting any symmetries
   * unique: create list of all distinguishable matches considering symmetries
   * @default 'overlapping'
   */
  algorithm?:
    | 'firstMatch'
    | 'separated'
    | 'overlapping'
    | 'rigorous'
    | 'unique';
  prefix?: string;
  suffix?: string;
}

/**
 * Applies fragment labels from a fragment molecule to a target molecule. This method is in
 * place and modifies the target molecule directly.
 * @param molecule - The target molecule to which fragment labels will be applied.
 * @param fragment - The fragment molecule containing the labels to apply.
 * @param options
 * @returns The number of matches found
 */
export function applyFragmentLabels(
  molecule: Molecule,
  fragment: Molecule,
  options: ApplyFragmentLabelsOptions = {},
): number {
  const { algorithm = 'overlapping', prefix = '', suffix = '' } = options;
  const sssearcher = new SSSearcher();
  sssearcher.setMolecule(molecule);
  sssearcher.setFragment(fragment);
  const found = sssearcher.findFragmentInMolecule({ countMode: algorithm });
  const matches = sssearcher.getMatchList();
  for (const match of matches) {
    for (
      let fragmentAtomIndex = 0;
      fragmentAtomIndex < match.length;
      fragmentAtomIndex++
    ) {
      const moleculeAtomIndex = match[fragmentAtomIndex];
      const label = fragment.getAtomCustomLabel(fragmentAtomIndex);
      if (label) {
        molecule.setAtomCustomLabel(moleculeAtomIndex, prefix + label + suffix);
      }
    }
  }
  return found;
}
