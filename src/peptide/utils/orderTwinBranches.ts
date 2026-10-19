import type { Molecule } from 'openchemlib';

/**
 * Order two constitutionally equivalent substituents of a tetrahedral atom,
 * the one IUPAC numbers `1` first.
 *
 * The two are told apart the way CIP defines it: one of them is made heavier,
 * which turns the centre into a genuine stereo centre, and openchemlib is then
 * asked for its descriptor. The substituent that makes the centre `S` is the
 * one IUPAC numbers `1` — checked against 73 valine and leucine residues of
 * seven Protein Data Bank entries, see `__tests__/data/referenceBranches.ts`.
 *
 * `null` means the structure does not say. A flat drawing carrying a wedge only
 * on the backbone leaves a side-chain centre undefined, and openchemlib reports
 * no descriptor rather than inventing one; the caller must then treat the
 * numbering as arbitrary.
 * @param molecule - the molecule the atoms belong to.
 * @param centre - the atom carrying the two equivalent substituents.
 * @param first - one of the two.
 * @param second - the other.
 * @returns the pair ordered, or `null` when the structure does not determine it.
 */
export function orderTwinBranches(
  molecule: Molecule,
  centre: number,
  first: number,
  second: number,
): [number, number] | null {
  const { Molecule: OCLMolecule } = molecule.getOCL();
  const probe = molecule.getCompactCopy();
  // A heavier isotope outranks its twin without changing anything else.
  probe.setAtomMass(first, probe.getAtomicNo(first) * 2 + 1);
  probe.ensureHelperArrays(OCLMolecule.cHelperCIP);

  const parity = probe.getAtomCIPParity(centre);
  if (
    parity !== OCLMolecule.cAtomCIPParityRorM &&
    parity !== OCLMolecule.cAtomCIPParitySorP
  ) {
    return null;
  }
  return parity === OCLMolecule.cAtomCIPParitySorP
    ? [first, second]
    : [second, first];
}
