import type { Molecule } from 'openchemlib';

import type {
  PeptideAtomLabel,
  PeptideNaming,
} from '../../src/peptide/PeptideTypes.ts';
import { labelPeptide } from '../../src/peptide/labelPeptide.ts';

export interface DemoLabelOptions {
  /** The alphabet the identifiers are spelled in. */
  naming: PeptideNaming;
  /** `superscript` writes `]1β2`, `name` writes the full identifier `Hβ2`. */
  labelStyle: 'superscript' | 'name';
  /** Drop the hydrogens from the drawing and the table, keeping the skeleton readable. */
  hideHydrogens: boolean;
  /** Index of an atom of the residue to number `1`, for cyclic peptides. */
  firstResidue?: number;
}

export interface DemoResult {
  /** The molecule to draw: with explicit hydrogens, or the heavy atoms only. */
  molecule: Molecule;
  /** The labelled atoms shown in the table, in the order of the drawn molecule. */
  atoms: PeptideAtomLabel[];
  /**
   * Index in the drawn molecule of every atom of `atoms`, so that highlighting
   * keeps working once the hydrogens have been dropped.
   */
  drawnAtom: Map<number, number>;
  residueCount: number;
  /** Three-letter code of each residue, `*` when only its carbon skeleton matched. */
  codes: string[];
  warnings: string[];
}

/**
 * Label a molecule for the playground and collect what the engine reported.
 * @param molecule - the parsed input molecule.
 * @param options - display options.
 * @returns the labelled molecule and one entry per labelled atom.
 */
export function labelForDemo(
  molecule: Molecule,
  options: DemoLabelOptions,
): DemoResult {
  const { naming, labelStyle, hideHydrogens, firstResidue } = options;
  const warnings: string[] = [];

  const result = labelPeptide(molecule, {
    naming,
    firstResidue,
    format:
      labelStyle === 'name'
        ? (label) => label.name
        : (label) => `]${label.residueNumber}${label.descriptor}`,
    logger: { warn: (message: string) => warnings.push(message) } as never,
  });

  const labelled = result.molecule;
  const codes: string[] = [];
  for (const residue of result.residues) {
    codes.push(`${residue.code}${residue.modified ? '*' : ''}`);
  }
  const summary = {
    residueCount: result.residues.length,
    codes,
    warnings,
  };

  if (!hideHydrogens) {
    const identity = new Map<number, number>();
    for (const atom of result.atoms) {
      identity.set(atom.atom, atom.atom);
    }
    return {
      molecule: labelled,
      atoms: result.atoms,
      drawnAtom: identity,
      ...summary,
    };
  }

  // `deleteAtoms` keeps the relative order of the surviving atoms and their
  // custom labels, so the nth heavy atom of the copy is the nth heavy atom here.
  const hydrogens: number[] = [];
  const drawnAtom = new Map<number, number>();
  for (let atom = 0; atom < labelled.getAllAtoms(); atom++) {
    if (labelled.getAtomicNo(atom) === 1) {
      hydrogens.push(atom);
    } else {
      drawnAtom.set(atom, drawnAtom.size);
    }
  }
  const heavyOnly = labelled.getCompactCopy();
  heavyOnly.deleteAtoms(hydrogens);

  const drawnAtoms: typeof result.atoms = [];
  for (const atom of result.atoms) {
    if (drawnAtom.has(atom.atom)) drawnAtoms.push(atom);
  }

  return {
    molecule: heavyOnly,
    atoms: drawnAtoms,
    drawnAtom,
    ...summary,
  };
}
