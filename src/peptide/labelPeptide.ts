import type { LightLogger } from 'cheminfo-types';
import type { Molecule } from 'openchemlib';

import { TopicMolecule } from '../topic/TopicMolecule.ts';

import type {
  PeptideAtomLabel,
  PeptideAtomName,
  PeptideNaming,
} from './PeptideTypes.ts';
import type { MatchedResidue } from './matchResidues.ts';
import { matchResidues } from './matchResidues.ts';
import { orderResidues } from './orderResidues.ts';
import { getConstitutionalRanks } from './utils/getConstitutionalRanks.ts';
import { getProchiralParities } from './utils/getProchiralParities.ts';
import { nameHydrogens } from './utils/nameHydrogens.ts';
import { orderTwinBranches } from './utils/orderTwinBranches.ts';
import { spellDescriptor } from './utils/spellDescriptor.ts';

export type {
  PeptideAtomLabel,
  PeptideAtomName,
  PeptideNaming,
} from './PeptideTypes.ts';
export type { MatchedResidue } from './matchResidues.ts';

export interface LabelPeptideOptions {
  /**
   * How the identifiers are spelled: the IUPAC `Cβ`, their Roman counterparts
   * `CB`, or the PDB atom names, which also write the backbone `C`, `O`, `OXT`,
   * `HXT` and `H` rather than `C′`, `O′`, `O″`, `H″` and `HN`.
   * @default 'greek'
   */
  naming?: PeptideNaming;

  /**
   * Build the custom label from the identifier of an atom. The default drops the
   * element symbol — openchemlib still draws it — and prefixes the result with
   * `]` so that it is rendered as a superscript at the top left of the atom.
   * @default (label) => `]${label.residueNumber}${label.descriptor}`
   */
  format?: (label: PeptideAtomLabel) => string;

  /**
   * Index of any atom of the residue that must be numbered `1`, used for cyclic peptides.
   */
  firstResidue?: number;

  /**
   * Above this number of atoms `TopicMolecule` stops computing the pro-R /
   * pro-S descriptors reported in `proChirality`. The `2`/`3` numbering itself
   * is geometric and is not affected.
   * @default 250
   */
  maxNbAtoms?: number;

  /**
   * The logger used to report what could not be labelled.
   * @default console
   */
  logger?: LightLogger;
}

export interface LabelPeptideResult {
  /**
   * A copy of the input molecule with explicit hydrogens carrying the labels.
   * The input molecule is left untouched.
   */
  molecule: Molecule;
  /** One entry per labelled atom, residue by residue. */
  atoms: PeptideAtomLabel[];
  /** The residues that were found, from the N-terminus. */
  residues: MatchedResidue[];
  /**
   * Atoms of `molecule` that carry no identifier: everything outside a peptide
   * chain, and the groups grafted on one — an N-methyl, an acyl or amide cap —
   * which IUPAC does not name.
   */
  unassignedAtoms: number[];
}

const DEFAULT_FORMAT = (label: PeptideAtomLabel) =>
  `]${label.residueNumber}${label.descriptor}`;

/**
 * Write the IUPAC identifier of every atom of a peptide as an openchemlib
 * custom label.
 *
 * Each residue is recognised by matching a labelled fragment, so the identifier
 * of a heavy atom is read off the fragment rather than derived. Hydrogens are
 * named from the heavy atom they hang on, and the `2`/`3` of a prochiral pair
 * follows the main-chain precedence rule of the IUPAC Recommendations 1998 —
 * which is *not* the same as numbering the pro-R hydrogen `2`.
 * @param molecule - the peptide, with or without explicit hydrogens.
 * @param options - labelling options.
 * @returns the labelled copy and the identifier of every atom.
 */
export function labelPeptide(
  molecule: Molecule,
  options: LabelPeptideOptions = {},
): LabelPeptideResult {
  const {
    naming = 'greek',
    format = DEFAULT_FORMAT,
    firstResidue,
    maxNbAtoms,
    logger = console,
  } = options;

  // `TopicMolecule` spreads its options over the defaults, so an explicit
  // `undefined` would wipe them out.
  const topicMolecule = new TopicMolecule(molecule, {
    logger,
    ...(maxNbAtoms === undefined ? {} : { maxNbAtoms }),
  });
  const labelled = topicMolecule.moleculeWithH;
  labelled.removeAtomCustomLabels();

  const residues = orderResidues(
    labelled,
    matchResidues(labelled),
    firstResidue,
  );
  if (residues.length === 0) {
    logger.warn?.('labelPeptide: no peptide backbone found');
    return {
      molecule: labelled,
      atoms: [],
      residues: [],
      unassignedAtoms: getAllAtoms(labelled),
    };
  }

  const ranks = getConstitutionalRanks(labelled);
  const context = {
    molecule: labelled,
    source: molecule,
    ranks,
    parities: getProchiralParities(labelled, ranks),
  };
  const prochiralities = topicMolecule.prochiralities;

  const atoms: PeptideAtomLabel[] = [];
  const named = new Set<number>();
  for (const [index, residue] of residues.entries()) {
    const isLast = index === residues.length - 1 && !isCyclic(residues);
    for (const [atom, residueName] of nameResidue(
      labelled,
      residue,
      context,
      isLast,
    )) {
      named.add(atom);
      atoms.push(
        toLabel(
          labelled,
          atom,
          spellDescriptor(
            labelled.getAtomLabel(atom),
            residueName.descriptor,
            naming,
          ),
          residueName.arbitrary,
          index + 1,
          prochiralities[atom],
        ),
      );
    }
  }
  atoms.sort((a, b) => a.residueNumber - b.residueNumber || a.atom - b.atom);

  for (const label of atoms) {
    label.label = format(label);
    labelled.setAtomCustomLabel(label.atom, label.label);
  }

  const allAtoms = getAllAtoms(labelled);
  const unassignedAtoms: number[] = [];
  for (const atom of allAtoms) {
    if (!named.has(atom)) unassignedAtoms.push(atom);
  }
  if (unassignedAtoms.length > 0) {
    logger.warn?.(
      `labelPeptide: ${unassignedAtoms.length} atoms carry no IUPAC identifier`,
    );
  }
  return { molecule: labelled, atoms, residues, unassignedAtoms };
}

interface ResidueName {
  descriptor: string;
  arbitrary: boolean;
}

interface Context {
  molecule: Molecule;
  /**
   * The molecule as it was handed in. Explicit hydrogens are added without
   * coordinates, which destroys the geometry openchemlib reads a stereo centre
   * from, so anything stereochemical is asked of this one. Heavy atoms keep
   * their index, so the two are interchangeable for them.
   */
  source: Molecule;
  ranks: number[];
  parities: Map<number, number>;
}

/**
 * The identifier of every atom of one residue, hydrogens included.
 * @param molecule - the molecule with explicit hydrogens.
 * @param residue - the residue as the fragment matched it.
 * @param context - the molecule, its ranks and its parities.
 * @param isLast - the residue closes the chain and carries the terminal oxygens.
 * @returns the descriptor of each atom.
 */
function nameResidue(
  molecule: Molecule,
  residue: MatchedResidue,
  context: Context,
  isLast: boolean,
): Map<number, ResidueName> {
  const names = new Map<number, ResidueName>();
  for (const [atom, descriptor] of residue.names) {
    names.set(atom, { descriptor, arbitrary: false });
  }
  const mainOf = getMainChainNeighbours(molecule, residue);

  orderDiastereotopicBranches(context, names, mainOf);
  if (isLast) nameTerminal(molecule, residue, names);

  for (const [parent, name] of names) {
    if (molecule.getAtomicNo(parent) === 1) continue;
    const main = mainOf.get(parent);
    if (main === undefined) continue;
    for (const hydrogen of nameHydrogens(context, parent, main)) {
      names.set(hydrogen.hydrogen, {
        descriptor: name.descriptor + hydrogen.index,
        arbitrary: hydrogen.arbitrary,
      });
    }
  }
  nameNitrogenHydrogens(molecule, residue, names);
  return names;
}

/**
 * Put the two branches of a diastereotopic pair the right way round.
 *
 * A fragment names the two methyls of valine `γ1` and `γ2`, but they are
 * indistinguishable as a graph, so the match assigns them arbitrarily — the
 * same way round for L-valine and for D-valine. Which is which follows from the
 * geometry, by the same rule that numbers a pair of prochiral hydrogens.
 * @param molecule - the molecule with explicit hydrogens.
 * @param context - the molecule, its ranks and its parities.
 * @param names - the identifiers being collected, corrected in place.
 * @param mainOf - the neighbour towards the main chain, per atom.
 */
function orderDiastereotopicBranches(
  context: Context,
  names: Map<number, ResidueName>,
  mainOf: Map<number, number>,
) {
  const { ranks, source } = context;
  const pairs = new Map<string, number[]>();
  for (const [atom, name] of names) {
    if (!/[12]$/.test(name.descriptor)) continue;
    const parent = mainOf.get(atom);
    if (parent === undefined) continue;
    const key = `${parent}:${name.descriptor.slice(0, -1)}`;
    pairs.set(key, [...(pairs.get(key) ?? []), atom]);
  }

  for (const atoms of pairs.values()) {
    const [first, second] = atoms;
    if (atoms.length !== 2 || first === undefined || second === undefined) {
      continue;
    }
    if (ranks[first] !== ranks[second]) continue;
    const parent = mainOf.get(first) as number;
    const resolved = orderTwinBranches(source, parent, first, second);
    const one = names.get(first) as ResidueName;
    const two = names.get(second) as ResidueName;
    if (resolved === null) {
      // A phenyl ring flips freely, so its `δ1`/`δ2` cannot be fixed by a
      // structure: keep the order and say it is arbitrary.
      names.set(first, { ...one, arbitrary: true });
      names.set(second, { ...two, arbitrary: true });
      continue;
    }
    const [low, high] = resolved;
    const lowest = one.descriptor.endsWith('1') ? one : two;
    const highest = one.descriptor.endsWith('1') ? two : one;
    names.set(low, { ...lowest, arbitrary: false });
    names.set(high, { ...highest, arbitrary: false });
  }
}

/**
 * For every named heavy atom, the neighbour that leads back to `Cα` — the
 * substituent IUPAC gives precedence to. Found by walking out from `Cα`, so no
 * letter has to be interpreted.
 * @param molecule - the molecule with explicit hydrogens.
 * @param residue - the residue as the fragment matched it.
 * @returns the neighbour towards the main chain, per atom.
 */
function getMainChainNeighbours(
  molecule: Molecule,
  residue: MatchedResidue,
): Map<number, number> {
  const main = new Map<number, number>();
  if (residue.alpha === -1) return main;
  if (residue.nitrogen !== -1) main.set(residue.alpha, residue.nitrogen);

  const visited = new Set([residue.alpha]);
  let current = [residue.alpha];
  while (current.length > 0) {
    const next: number[] = [];
    for (const atom of current) {
      for (let i = 0; i < molecule.getAllConnAtoms(atom); i++) {
        const neighbor = molecule.getConnAtom(atom, i);
        if (visited.has(neighbor) || !residue.names.has(neighbor)) continue;
        if (neighbor === residue.nitrogen) continue;
        visited.add(neighbor);
        main.set(neighbor, atom);
        next.push(neighbor);
      }
    }
    current = next;
  }
  return main;
}

/**
 * The `O′` and `O″` of a C-terminal residue, and the hydrogen of the acid.
 * @param molecule - the molecule with explicit hydrogens.
 * @param residue - the residue that closes the chain.
 * @param names - the identifiers being collected, extended in place.
 */
function nameTerminal(
  molecule: Molecule,
  residue: MatchedResidue,
  names: Map<number, ResidueName>,
) {
  if (residue.carbonyl === -1) return;
  const extra: number[] = [];
  for (let i = 0; i < molecule.getAllConnAtoms(residue.carbonyl); i++) {
    const neighbor = molecule.getConnAtom(residue.carbonyl, i);
    if (molecule.getAtomicNo(neighbor) === 8 && !names.has(neighbor)) {
      extra.push(neighbor);
    }
  }
  if (extra.length !== 1) return;

  for (const [atom, name] of names) {
    if (name.descriptor === '' && molecule.getAtomicNo(atom) === 8) {
      names.set(atom, { descriptor: '′', arbitrary: false });
    }
  }
  const [terminal] = extra;
  names.set(terminal, { descriptor: '″', arbitrary: false });
  for (let i = 0; i < molecule.getAllConnAtoms(terminal); i++) {
    const neighbor = molecule.getConnAtom(terminal, i);
    if (molecule.getAtomicNo(neighbor) === 1) {
      names.set(neighbor, { descriptor: '″', arbitrary: false });
    }
  }
}

/**
 * The hydrogens carried by the backbone nitrogen: `HN` on an amide, `H1`, `H2`
 * and — when protonated — `H3` on a free or alkylated amine.
 * @param molecule - the molecule with explicit hydrogens.
 * @param residue - the residue being named.
 * @param names - the identifiers being collected, extended in place.
 */
function nameNitrogenHydrogens(
  molecule: Molecule,
  residue: MatchedResidue,
  names: Map<number, ResidueName>,
) {
  if (residue.nitrogen === -1) return;
  const hydrogens: number[] = [];
  let isAmide = false;
  for (let i = 0; i < molecule.getAllConnAtoms(residue.nitrogen); i++) {
    const neighbor = molecule.getConnAtom(residue.nitrogen, i);
    if (molecule.getAtomicNo(neighbor) === 1) {
      hydrogens.push(neighbor);
    } else if (neighbor !== residue.alpha && isCarbonyl(molecule, neighbor)) {
      isAmide = true;
    }
  }

  if (isAmide && hydrogens.length === 1) {
    names.set(hydrogens[0], { descriptor: 'N', arbitrary: false });
    return;
  }
  for (const [index, hydrogen] of hydrogens.entries()) {
    names.set(hydrogen, {
      descriptor: String(index + 1),
      arbitrary: hydrogens.length > 1,
    });
  }
}

/**
 * Whether the atom is a carbonyl carbon.
 * @param molecule - the molecule with explicit hydrogens.
 * @param atom - the atom to test.
 * @returns true when it carries a double-bonded oxygen.
 */
function isCarbonyl(molecule: Molecule, atom: number): boolean {
  if (molecule.getAtomicNo(atom) !== 6) return false;
  for (let i = 0; i < molecule.getAllConnAtoms(atom); i++) {
    if (
      molecule.getAtomicNo(molecule.getConnAtom(atom, i)) === 8 &&
      molecule.getConnBondOrder(atom, i) === 2
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Whether the chain closes on itself.
 * @param residues - the residues in chain order.
 * @returns true for a head-to-tail cycle.
 */
function isCyclic(residues: MatchedResidue[]): boolean {
  return residues.length > 0 && residues[0]?.nitrogen === -1;
}

function toLabel(
  molecule: Molecule,
  atom: number,
  descriptor: string,
  arbitrary: boolean,
  residueNumber: number,
  proChirality: 'r' | 's' | undefined,
): PeptideAtomLabel {
  const name: PeptideAtomName = {
    descriptor,
    name: molecule.getAtomLabel(atom) + descriptor,
    arbitrary,
  };
  return {
    ...name,
    atom,
    element: molecule.getAtomLabel(atom),
    residueNumber,
    label: '',
    proChirality:
      proChirality === undefined
        ? undefined
        : (proChirality.toUpperCase() as 'R' | 'S'),
  };
}

function getAllAtoms(molecule: Molecule): number[] {
  const atoms: number[] = [];
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) atoms.push(atom);
  return atoms;
}
