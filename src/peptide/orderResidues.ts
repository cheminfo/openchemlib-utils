import type { Molecule } from 'openchemlib';

import type { MatchedResidue } from './matchResidues.ts';

/**
 * Order the residues from the N-terminus.
 *
 * The fragments name the backbone, so the chain needs no extra perception: a
 * peptide bond is a bond between the `C′` of one residue and the `N` of
 * another, and the residue that is nobody's successor opens the chain. A
 * head-to-tail cycle has no such residue, and then the numbering starts at the
 * residue holding `firstResidue`, or at the lowest `Cα`.
 * @param molecule - the molecule the residues belong to.
 * @param residues - the residues, in any order.
 * @param firstResidue - index of any atom of the residue to number `1`.
 * @returns the residues, from the N-terminus.
 */
export function orderResidues(
  molecule: Molecule,
  residues: MatchedResidue[],
  firstResidue?: number,
): MatchedResidue[] {
  if (residues.length === 0) return [];

  const byNitrogen = new Map<number, number>();
  for (let index = 0; index < residues.length; index++) {
    const { nitrogen } = residues[index];
    if (nitrogen !== -1) byNitrogen.set(nitrogen, index);
  }

  const successors = new Array<number>(residues.length).fill(-1);
  for (let index = 0; index < residues.length; index++) {
    const { carbonyl } = residues[index];
    if (carbonyl === -1) continue;
    for (let i = 0; i < molecule.getAllConnAtoms(carbonyl); i++) {
      const neighbor = molecule.getConnAtom(carbonyl, i);
      const target = byNitrogen.get(neighbor);
      if (target !== undefined && molecule.getAtomicNo(neighbor) === 7) {
        successors[index] = target;
        break;
      }
    }
  }

  const hasPredecessor = new Array<boolean>(residues.length).fill(false);
  for (const successor of successors) {
    if (successor !== -1) hasPredecessor[successor] = true;
  }

  const ordered: MatchedResidue[] = [];
  const visited = new Array<boolean>(residues.length).fill(false);
  for (const start of getStarts(residues, hasPredecessor, firstResidue)) {
    for (let index = start; index !== -1 && !visited[index];) {
      visited[index] = true;
      ordered.push(residues[index]);
      index = successors[index];
    }
  }
  return ordered;
}

/**
 * Where a walk may start, best first: the N-termini, then whatever is left of a
 * cycle.
 * @param residues - the residues, in any order.
 * @param hasPredecessor - whether each residue is some residue's successor.
 * @param firstResidue - index of any atom of the residue to number `1`.
 * @returns candidate starting indexes.
 */
function getStarts(
  residues: MatchedResidue[],
  hasPredecessor: boolean[],
  firstResidue?: number,
): number[] {
  let chosen = -1;
  if (firstResidue !== undefined) {
    for (let index = 0; index < residues.length; index++) {
      if (residues[index].names.has(firstResidue)) {
        chosen = index;
        break;
      }
    }
  }
  const termini: number[] = [];
  for (let index = 0; index < residues.length; index++) {
    if (!hasPredecessor[index]) termini.push(index);
  }
  if (termini.length === 0) {
    // A head-to-tail cycle: no residue opens it, so the caller decides.
    let lowest = 0;
    for (let index = 1; index < residues.length; index++) {
      if (residues[index].alpha < residues[lowest].alpha) lowest = index;
    }
    termini.push(chosen === -1 ? lowest : chosen);
  } else if (chosen !== -1 && !termini.includes(chosen)) {
    termini.unshift(chosen);
  }
  const starts = [...termini];
  const seen = new Set(termini);
  for (let index = 0; index < residues.length; index++) {
    if (!seen.has(index)) starts.push(index);
  }
  return starts;
}
