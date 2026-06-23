import type { Molecule } from 'openchemlib';

/**
 * Returns the custom labels that are shared by more than one atom.
 * Atoms without a custom label are ignored, so a molecule with no custom labels,
 * or with only unique ones, yields an empty array.
 * @param molecule - The molecule whose atom custom labels should be checked.
 * @returns The deduplicated list of non-unique custom labels, in first-seen
 * order. Empty when every custom label is unique.
 */
export function getNonUniqueCustomLabels(molecule: Molecule): string[] {
  const counts = new Map<string, number>();
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const customLabel = molecule.getAtomCustomLabel(i)?.replace(/^\]/, '');
    if (!customLabel) continue;
    counts.set(customLabel, (counts.get(customLabel) ?? 0) + 1);
  }

  const nonUniqueCustomLabels = [];
  for (const [customLabel, count] of counts) {
    if (count > 1) nonUniqueCustomLabels.push(customLabel);
  }
  return nonUniqueCustomLabels;
}
