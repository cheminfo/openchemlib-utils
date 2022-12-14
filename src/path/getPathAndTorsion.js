/**
 * Calculates the path between 2 atoms
 * @param {import('openchemlib').Molecule} molecule
 * @param {number} from - index of the first atom
 * @param {number} to - index of the end atom
 * @param {number} maxLength - maximal length of the path
 */
export function getPathAndTorsion(molecule, from, to, maxLength) {
  let originalAtoms = []; // path before renumbering
  molecule.getPath(originalAtoms, from, to, maxLength + 1);
  let torsion;
  if (originalAtoms.length === 4) {
    torsion = molecule.calculateTorsion(originalAtoms);
  }

  return {
    atoms: originalAtoms,
    from,
    to,
    torsion,
    length: originalAtoms.length - 1,
  };
}
