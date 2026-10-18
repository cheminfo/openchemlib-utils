import type { Molecule } from 'openchemlib';

import { getCompactCopyWithoutCustomLabels } from '../../util/getCompactCopyWithoutCustomLabels.ts';
import { tagAtom } from '../../util/tagAtom.ts';

/**
 * Read the spatial arrangement of every tetrahedral atom of the molecule, the
 * prochiral ones included.
 *
 * openchemlib only computes a parity for atoms it considers stereo centres, so
 * a `CH2` has none until one of its two hydrogens is made distinguishable. All
 * the centres are tagged in a **single** probe rather than one probe per centre:
 * the parity of a centre comes from its own coordinates and stereo bond, which
 * a tag somewhere else in the molecule does not change.
 * @param molecule - a molecule with explicit hydrogens and heterotopic chiral bonds.
 * @param ranks - constitutional ranks, used to find the equivalent substituents.
 * @returns the `cAtomParity1` / `cAtomParity2` value of every tetrahedral atom.
 */
export function getProchiralParities(
  molecule: Molecule,
  ranks: number[],
): Map<number, number> {
  const { Molecule: OCLMolecule } = molecule.getOCL();
  const probe = getCompactCopyWithoutCustomLabels(molecule);
  probe.ensureHelperArrays(OCLMolecule.cHelperParities);

  const centers: number[] = [];
  for (let atom = 0; atom < probe.getAllAtoms(); atom++) {
    if (probe.getAllConnAtoms(atom) !== 4) continue;
    if (probe.getAtomParity(atom) !== OCLMolecule.cAtomParityNone) continue;
    centers.push(atom);
  }

  for (const center of centers) {
    tagAtom(probe, getTaggableNeighbor(probe, center, ranks));
  }
  probe.ensureHelperArrays(OCLMolecule.cHelperParities);

  const parities = new Map<number, number>();
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) {
    if (molecule.getAllConnAtoms(atom) !== 4) continue;
    parities.set(atom, probe.getAtomParity(atom));
  }
  return parities;
}

function getTaggableNeighbor(
  molecule: Molecule,
  center: number,
  ranks: number[],
): number {
  const neighbors: number[] = [];
  for (let i = 0; i < 4; i++) neighbors.push(molecule.getConnAtom(center, i));

  // The tag has to break the symmetry of the pair that needs ordering, so it
  // goes on one of two equivalent substituents — a hydrogen of a CH2, or a
  // methyl of valine, whose partner is heavy and would otherwise stay tied.
  for (const [index, first] of neighbors.entries()) {
    for (const second of neighbors.slice(index + 1)) {
      if (ranks[first] === ranks[second]) return first;
    }
  }
  return neighbors[0];
}
