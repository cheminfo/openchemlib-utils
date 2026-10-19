import type { Molecule } from 'openchemlib';

/**
 * Apply the IUPAC prochirality rule to a pair of equivalent substituents.
 *
 * > if one sights down the X—C axis (with the X atom toward the viewer), the
 * > equivalent atoms, Z and Z′, are designated Z2 and Z3, such that Y, Z2, Z3
 * > follow a clockwise orientation
 *
 * — IUPAC Recommendations 1998, Fig. 1. `X` is the substituent leading to the
 * main chain, *not* the one with the highest CIP priority, so the result is only
 * the pro-R substituent when `main` also outranks `other` in CIP.
 *
 * `getAtomParity` describes the arrangement in terms of the atom indexes, so any
 * ligand ordering follows from a permutation parity and no CIP ranking is needed.
 * @param molecule - the molecule the atoms belong to.
 * @param parities - arrangements read once by `getProchiralParities`.
 * @param center - the tetrahedral atom carrying the two equivalent substituents.
 * @param ligands - the substituent leading to the main chain, then the fourth
 * substituent, then the two equivalent candidates.
 * @returns the candidates ordered, lowest identifier first, or `null` when the
 * configuration cannot be determined.
 */
export function getProchiralOrder(
  molecule: Molecule,
  parities: Map<number, number>,
  center: number,
  ligands: [number, number, number, number],
): [number, number] | null {
  const { Molecule: OCLMolecule } = molecule.getOCL();
  if (molecule.getAllConnAtoms(center) !== 4) return null;

  const neighbors = new Set<number>();
  for (let i = 0; i < 4; i++) neighbors.add(molecule.getConnAtom(center, i));
  for (const ligand of ligands) {
    if (!neighbors.has(ligand)) return null;
  }

  const parity = parities.get(center);
  if (
    parity !== OCLMolecule.cAtomParity1 &&
    parity !== OCLMolecule.cAtomParity2
  ) {
    return null;
  }

  // Parity 1 means: highest index pointing to the back, the three others
  // clockwise by ascending index — the same handedness the rule above asks for.
  const sorted = ligands.toSorted((a, b) => a - b);
  const isClockwise =
    (parity === OCLMolecule.cAtomParity1) ===
    isEvenPermutation(sorted, ligands);
  return isClockwise ? [ligands[2], ligands[3]] : [ligands[3], ligands[2]];
}

function isEvenPermutation(source: number[], target: number[]): boolean {
  const positions = new Array<number>(target.length);
  for (let i = 0; i < target.length; i++) {
    positions[i] = source.indexOf(target[i]);
  }
  let inversions = 0;
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      if (positions[i] > positions[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
}
