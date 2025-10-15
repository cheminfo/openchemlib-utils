import type { Molecule } from 'openchemlib';
import { SSSearcher } from 'openchemlib';

/**
 * Applies fragment labels from a fragment molecule to a target molecule. This method is in
 * place and modifies the target molecule directly.
 * @param molecule - The target molecule to which fragment labels will be applied.
 * @param fragment - The fragment molecule containing the labels to apply.
 * @returns The number of matches found
 */
export function applyFragmentLabels(
  molecule: Molecule,
  fragment: Molecule,
): number {
  // need to find the matching atoms
  const sssearcher = new SSSearcher();
  sssearcher.setMolecule(molecule);
  sssearcher.setFragment(fragment);
  sssearcher.findFragmentInMolecule({ countMode: 'separated' });
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
        molecule.setAtomCustomLabel(moleculeAtomIndex, label);
      }
    }
  }
}
