import type { Molecule } from 'openchemlib';

import type { AtomRow } from './types.ts';

/** How a hydrogen relates to the other hydrogens borne by the same heavy atom. */
export type Topicity = 'diastereotopic' | 'enantiotopic' | 'homotopic' | 'none';

/**
 * Classifies a hydrogen against the other hydrogens borne by the same heavy atom.
 * A different `diaID` is exactly the library's own `isDiastereotopicHydrogen` test.
 * @param atom - index in `moleculeWithH`
 * @param siblings - indices of the other hydrogens on the same parent
 * @param diaIDs - `topicMolecule.diaIDs`
 * @param enantioIDs - `topicMolecule.enantioIDs`
 * @returns the topicity verdict, `'none'` when there is no sibling or an ID is missing
 */
export function classifyTopicity(
  atom: number,
  siblings: number[],
  diaIDs: string[],
  enantioIDs: string[],
): Topicity {
  if (siblings.length === 0) return 'none';
  const diaID = diaIDs[atom];
  const enantioID = enantioIDs[atom];
  if (!diaID || !enantioID) return 'none';
  for (const sibling of siblings) {
    if (!diaIDs[sibling] || !enantioIDs[sibling]) return 'none';
  }
  for (const sibling of siblings) {
    if (diaIDs[sibling] !== diaID) return 'diastereotopic';
  }
  for (const sibling of siblings) {
    if (enantioIDs[sibling] !== enantioID) return 'enantiotopic';
  }
  return 'homotopic';
}

/**
 * Lists the sibling hydrogens of a hydrogen: the other hydrogens attached to the
 * same heavy atom.
 * @param moleculeWithH - the hydrogen-expanded molecule
 * @param atom - index of a hydrogen in `moleculeWithH`
 * @returns the sibling atom indices, empty when `atom` is not a hydrogen
 */
export function getSiblingHydrogens(
  moleculeWithH: Molecule,
  atom: number,
): number[] {
  const parent = getParentHeavyAtom(moleculeWithH, atom);
  if (parent === undefined) return [];
  const siblings: number[] = [];
  const nbNeighbours = moleculeWithH.getAllConnAtoms(parent);
  for (let i = 0; i < nbNeighbours; i++) {
    const neighbour = moleculeWithH.getConnAtom(parent, i);
    if (neighbour !== atom && moleculeWithH.getAtomicNo(neighbour) === 1) {
      siblings.push(neighbour);
    }
  }
  return siblings;
}

/**
 * Maps a `moleculeWithH` atom index to the index space of the molecule currently
 * rendered. When hydrogens are hidden, an implicit hydrogen maps to its parent
 * heavy atom.
 * @param atom - index in `moleculeWithH`
 * @param rows - the atom rows, used to find the parent of an implicit hydrogen
 * @param atomCountMolecule - `molecule.getAllAtoms()`
 * @param showHydrogens - whether `moleculeWithH` is being rendered
 * @returns the index in the rendered molecule, or `undefined` when unmappable
 */
export function toDisplayAtom(
  atom: number,
  rows: AtomRow[],
  atomCountMolecule: number,
  showHydrogens: boolean,
): number | undefined {
  if (showHydrogens) return atom;
  if (atom < atomCountMolecule) return atom;
  const parent = rows[atom]?.parent;
  if (parent === undefined || parent >= atomCountMolecule) return undefined;
  return parent;
}

/**
 * Inverse of `toDisplayAtom`.
 * `moleculeWithH` is `molecule.getCompactCopy()` plus appended hydrogens, so the two
 * index spaces share their prefix and the mapping back is the identity.
 * @param atom - index in the rendered molecule
 * @returns the same index, in `moleculeWithH` space
 */
export function fromDisplayAtom(atom: number): number {
  return atom;
}

/**
 * Finds the heavy atom a hydrogen is attached to.
 * @param moleculeWithH - the hydrogen-expanded molecule
 * @param atom - index in `moleculeWithH`
 * @returns the parent index, or `undefined` when `atom` is not a bound hydrogen
 */
export function getParentHeavyAtom(
  moleculeWithH: Molecule,
  atom: number,
): number | undefined {
  if (moleculeWithH.getAtomicNo(atom) !== 1) return undefined;
  if (moleculeWithH.getAllConnAtoms(atom) === 0) return undefined;
  return moleculeWithH.getConnAtom(atom, 0);
}
