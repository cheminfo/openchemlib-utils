import type * as OCLNamespace from 'openchemlib';

import type { LabelledResidue } from './residues.ts';
import { LABELLED_RESIDUES } from './residues.ts';

type Molecule = OCLNamespace.Molecule;

export interface MatchedResidue {
  /** Three-letter code of the fragment that matched. */
  code: string;
  /** The identifier of every heavy atom the fragment named, by atom. */
  names: Map<number, string>;
  /** True when only the carbon skeleton matched, so the residue is modified. */
  modified: boolean;
  /** Backbone atoms, `-1` when the fragment did not name them. */
  nitrogen: number;
  alpha: number;
  carbonyl: number;
}

const FRAGMENTS = new WeakMap<object, Molecule[][]>();

/**
 * Find every amino-acid residue of the molecule and read the identifier of its
 * heavy atoms off the fragment that matched.
 *
 * Fragments are tried from the largest residue to the smallest so that
 * tryptophan claims its atoms before glycine can, and a match overlapping a
 * residue already found is dropped. Whatever is left after that pass is tried
 * again against the carbon skeletons, which still fit a modified residue.
 * @param molecule - the molecule to analyse, hydrogens included.
 * @returns one entry per residue, in no particular order.
 */
export function matchResidues(molecule: Molecule): MatchedResidue[] {
  const OCL = molecule.getOCL() as typeof OCLNamespace;
  const [exact, skeletons] = getFragments(OCL);
  const claimed = new Set<number>();
  const found: MatchedResidue[] = [];

  for (const [index, fragment] of exact.entries()) {
    collect(
      OCL,
      molecule,
      fragment,
      LABELLED_RESIDUES[index],
      false,
      claimed,
      found,
    );
  }
  for (const [index, fragment] of skeletons.entries()) {
    collect(
      OCL,
      molecule,
      fragment,
      LABELLED_RESIDUES[index],
      true,
      claimed,
      found,
    );
  }
  return found;
}

/**
 * Add every match of one fragment that does not overlap a residue already found.
 * @param OCL - the openchemlib instance.
 * @param molecule - the molecule being analysed.
 * @param fragment - the labelled query fragment.
 * @param residue - the residue the fragment stands for.
 * @param modified - the fragment is a carbon skeleton.
 * @param claimed - atoms already given to a residue, extended in place.
 * @param found - the residues found so far, extended in place.
 */
function collect(
  OCL: typeof OCLNamespace,
  molecule: Molecule,
  fragment: Molecule,
  residue: LabelledResidue | undefined,
  modified: boolean,
  claimed: Set<number>,
  found: MatchedResidue[],
) {
  if (residue === undefined) return;
  const searcher = new OCL.SSSearcher();
  searcher.setMol(fragment, molecule);
  searcher.findFragmentInMolecule({ countMode: 'unique' });

  for (const match of searcher.getMatchList()) {
    if (isClaimed(match, claimed)) continue;
    const names = new Map<number, string>();
    for (let position = 0; position < match.length; position++) {
      const atom = match[position];
      if (atom < 0) continue;
      const label = fragment.getAtomCustomLabel(position);
      if (label) names.set(atom, label.slice(1));
    }
    if (names.size === 0) continue;
    const backbone = getBackbone(molecule, names);
    // A carbon skeleton is only a chain of carbons — `Gly` reduces to two of
    // them — so it is a residue only once the backbone around it is there.
    if (modified && !isResidue(molecule, backbone)) continue;
    for (const atom of names.keys()) claimed.add(atom);
    found.push({ code: residue.code, names, modified, ...backbone });
  }
}

/**
 * The backbone atoms of a match, from the identifiers the fragment carried.
 * A carbon skeleton names no nitrogen, so it is recovered from `Cα`.
 * @param molecule - the molecule being analysed.
 * @param names - the identifier of every atom the fragment named.
 * @returns the backbone nitrogen, `Cα` and `C′`.
 */
function getBackbone(molecule: Molecule, names: Map<number, string>) {
  let nitrogen = -1;
  let alpha = -1;
  let carbonyl = -1;
  for (const [atom, name] of names) {
    if (name === 'α') alpha = atom;
    if (name === '′') carbonyl = atom;
    // The backbone nitrogen and the carbonyl oxygen are named by their element
    // alone, so their descriptor is empty; a side-chain heteroatom never is.
    if (name === '' && molecule.getAtomicNo(atom) === 7) nitrogen = atom;
  }
  if (nitrogen === -1 && alpha !== -1) {
    for (let i = 0; i < molecule.getAllConnAtoms(alpha); i++) {
      const neighbor = molecule.getConnAtom(alpha, i);
      if (molecule.getAtomicNo(neighbor) === 7 && !names.has(neighbor)) {
        nitrogen = neighbor;
        names.set(neighbor, 'N');
      }
    }
  }
  return { nitrogen, alpha, carbonyl };
}

/**
 * The fallback query for a modified residue: the backbone plus the side-chain
 * carbons reachable from `Cα` through carbons only.
 *
 * Keeping the connectivity is the point. Dropping every heteroatom instead
 * would cut the imidazole of histidine, the guanidine of arginine and the
 * amide of glutamine into disconnected pieces, which is not a substructure of
 * anything.
 * @param OCL - the openchemlib instance.
 * @param fragment - the exact residue fragment.
 * @returns the reduced fragment, labels kept.
 */
function getSkeleton(OCL: typeof OCLNamespace, fragment: Molecule): Molecule {
  const skeleton = fragment.getCompactCopy();
  skeleton.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

  let alpha = -1;
  for (let atom = 0; atom < skeleton.getAllAtoms(); atom++) {
    if (skeleton.getAtomCustomLabel(atom) === ']α') alpha = atom;
  }
  if (alpha === -1) return skeleton;

  // the backbone is always kept, so the match can still be recognised
  const keep = new Set<number>([alpha]);
  for (let i = 0; i < skeleton.getAllConnAtoms(alpha); i++) {
    const neighbor = skeleton.getConnAtom(alpha, i);
    const label = skeleton.getAtomCustomLabel(neighbor);
    if (label === ']' || label === ']′') keep.add(neighbor);
  }
  for (const atom of keep) {
    if (skeleton.getAtomCustomLabel(atom) !== ']′') continue;
    for (let i = 0; i < skeleton.getAllConnAtoms(atom); i++) {
      const neighbor = skeleton.getConnAtom(atom, i);
      if (skeleton.getAtomicNo(neighbor) === 8) keep.add(neighbor);
    }
  }

  // then the side-chain carbons, walking through carbons only
  let current = [alpha];
  while (current.length > 0) {
    const next: number[] = [];
    for (const atom of current) {
      for (let i = 0; i < skeleton.getAllConnAtoms(atom); i++) {
        const neighbor = skeleton.getConnAtom(atom, i);
        if (keep.has(neighbor) || skeleton.getAtomicNo(neighbor) !== 6) {
          continue;
        }
        keep.add(neighbor);
        next.push(neighbor);
      }
    }
    current = next;
  }

  const remove: number[] = [];
  for (let atom = 0; atom < skeleton.getAllAtoms(); atom++) {
    if (!keep.has(atom)) {
      remove.push(atom);
    }
  }
  skeleton.deleteAtoms(remove);
  skeleton.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
  skeleton.setFragment(true);
  return skeleton;
}

/**
 * Whether a carbon skeleton sits in an amino-acid backbone: a nitrogen on `Cα`
 * and a carbonyl oxygen on `C′`.
 * @param molecule - the molecule being analysed.
 * @param backbone - the backbone atoms recovered from the match.
 * @param backbone.nitrogen
 * @param backbone.alpha
 * @param backbone.carbonyl
 * @returns true when the match is a residue.
 */
function isResidue(
  molecule: Molecule,
  backbone: { nitrogen: number; alpha: number; carbonyl: number },
): boolean {
  const { nitrogen, carbonyl } = backbone;
  if (nitrogen === -1 || carbonyl === -1) return false;
  for (let i = 0; i < molecule.getAllConnAtoms(carbonyl); i++) {
    if (
      molecule.getAtomicNo(molecule.getConnAtom(carbonyl, i)) === 8 &&
      molecule.getConnBondOrder(carbonyl, i) === 2
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Whether any atom of a match already belongs to a residue.
 * @param match - the matched atoms, `-1` where the fragment atom is unmapped.
 * @param claimed - the atoms already taken.
 * @returns true as soon as one atom is claimed.
 */
function isClaimed(match: number[], claimed: Set<number>): boolean {
  for (const atom of match) {
    if (atom >= 0 && claimed.has(atom)) return true;
  }
  return false;
}

/**
 * The query fragments, decoded once per openchemlib instance.
 * @param OCL - the openchemlib instance.
 * @returns the exact fragments and the carbon skeletons, largest residue first.
 */
function getFragments(OCL: typeof OCLNamespace): Molecule[][] {
  const cached = FRAGMENTS.get(OCL);
  if (cached) return cached;
  const exact: Molecule[] = [];
  const skeletons: Molecule[] = [];
  for (const residue of LABELLED_RESIDUES) {
    const fragment = OCL.Molecule.fromIDCode(residue.idCode);
    fragment.setFragment(true);
    exact.push(fragment);
    skeletons.push(getSkeleton(OCL, fragment));
  }
  const fragments = [exact, skeletons];
  FRAGMENTS.set(OCL, fragments);
  return fragments;
}
