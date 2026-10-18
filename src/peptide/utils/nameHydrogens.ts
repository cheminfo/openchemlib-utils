import type { Molecule } from 'openchemlib';

import { getProchiralOrder } from './getProchiralOrder.ts';

export interface BranchContext {
  molecule: Molecule;
  /** Constitutional symmetry ranks, see `getConstitutionalRanks`. */
  ranks: number[];
  /** Spatial arrangements, see `getProchiralParities`. */
  parities: Map<number, number>;
}

export interface HydrogenNaming {
  hydrogen: number;
  index: string;
  arbitrary: boolean;
}

/**
 * Number the hydrogens carried by one heavy atom.
 * A single hydrogen gets no number, a methyl (or an ammonium) is numbered
 * `1`, `2`, `3`, and the two hydrogens of a tetrahedral centre are numbered
 * `2` and `3` following the IUPAC prochirality rule — position `1` being
 * conceptually taken by the heavy substituent.
 * @param context - the molecule and its constitutional ranks.
 * @param parent - the heavy atom carrying the hydrogens.
 * @param main - the neighbour of `parent` leading back to the main chain.
 * @returns one entry per hydrogen.
 */
export function nameHydrogens(
  context: BranchContext,
  parent: number,
  main: number,
): HydrogenNaming[] {
  const { molecule, parities } = context;
  const hydrogens: number[] = [];
  const heavy: number[] = [];
  for (let i = 0; i < molecule.getAllConnAtoms(parent); i++) {
    const neighbor = molecule.getConnAtom(parent, i);
    if (molecule.getAtomicNo(neighbor) === 1) {
      hydrogens.push(neighbor);
    } else {
      heavy.push(neighbor);
    }
  }

  if (hydrogens.length === 0) return [];
  if (hydrogens.length === 1) {
    return [{ hydrogen: hydrogens[0], index: '', arbitrary: false }];
  }
  if (hydrogens.length === 2 && molecule.getAllConnAtoms(parent) === 4) {
    const other = heavy.find((atom) => atom !== main);
    const ordered =
      other === undefined
        ? null
        : getProchiralOrder(molecule, parities, parent, [
            main,
            other,
            hydrogens[0],
            hydrogens[1],
          ]);
    const pair = ordered ?? hydrogens;
    return [
      { hydrogen: pair[0], index: '2', arbitrary: ordered === null },
      { hydrogen: pair[1], index: '3', arbitrary: ordered === null },
    ];
  }
  // Methyls rotate freely and the hydrogens of an sp2 nitrogen are numbered
  // after the geometry of the double bond, which a 2D structure does not fix.
  const named: HydrogenNaming[] = [];
  for (let index = 0; index < hydrogens.length; index++) {
    named.push({
      hydrogen: hydrogens[index],
      index: String(index + 1),
      arbitrary: true,
    });
  }
  return named;
}
