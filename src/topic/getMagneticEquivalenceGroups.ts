import type { HoseCodesForAtomsOptions } from '../hose/HoseCodesForAtomsOptions.js';
import { getHoseCodesForAtomsAsStrings } from '../hose/getHoseCodesForAtomsAsStrings.js';

import type { TopicMolecule } from './TopicMolecule.js';

export interface MagneticEquivalenceGroup {
  /**
   * Diastereotopic ID shared by all the atoms of the group
   */
  diaID: string;
  /**
   * Atom label (C, H, N, etc.) of the atoms of the group
   */
  atomLabel: string;
  /**
   * Atom numbers in the moleculeWithH, ascending
   */
  atoms: number[];
}

export type MagneticEquivalenceOptions = HoseCodesForAtomsOptions & {
  /**
   * Largest number of bonds between two atoms that is still considered as a coupling.
   * Two atoms further apart than this are assumed not to couple at all.
   * @default topicMolecule.options.maxPathLength
   */
  maxPathLength?: number;
};

/**
 * Split the atoms into sets of magnetically equivalent atoms.
 *
 * Magnetic equivalence is stricter than the diastereotopic (chemical)
 * equivalence encoded in the diaIDs. Two atoms are magnetically equivalent when
 * they share a diaID, so that they have the same chemical shift, and in addition
 * relate in exactly the same way to every other atom of the molecule, so that
 * they have the same coupling constant to each of them. The three hydrogens of a
 * methyl pass that test, and so do the two hydrogens of a freely rotating CH2.
 * The four aromatic hydrogens of p-xylene do not: they share one diaID but one
 * pair is ortho while another is meta, which is exactly what makes such a
 * spectrum second order.
 *
 * The relation between two atoms is described by the canonized hose codes of the
 * paths that join them, the same descriptor the coupling prediction is keyed on,
 * so two atoms end up in the same group only when nothing in the connectivity,
 * the configuration, or the ring geometry can tell their partners apart.
 * @param topicMolecule - the molecule to analyse.
 * @param options - hose code options, plus the largest coupling path length.
 * @returns one group per set of magnetically equivalent atoms, singletons
 * included, sorted by their first atom.
 */
export function getMagneticEquivalenceGroups(
  topicMolecule: TopicMolecule,
  options: MagneticEquivalenceOptions = {},
): MagneticEquivalenceGroup[] {
  const {
    maxPathLength = topicMolecule.options.maxPathLength,
    ...hoseOptions
  } = options;

  if (maxPathLength > topicMolecule.options.maxPathLength) {
    throw new Error(
      `maxPathLength cannot be larger than the one defined in topicMolecule: ${topicMolecule.options.maxPathLength}`,
    );
  }

  const molecule = topicMolecule.moleculeWithH;
  const diaIDs = topicMolecule.diaIDs;
  if (diaIDs.length === 0) return [];

  const atomsByDiaID = new Map<string, number[]>();
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) {
    const atoms = atomsByDiaID.get(diaIDs[atom]);
    if (atoms) {
      atoms.push(atom);
    } else {
      atomsByDiaID.set(diaIDs[atom], [atom]);
    }
  }

  const groups: MagneticEquivalenceGroup[] = [];
  for (const [diaID, atoms] of atomsByDiaID) {
    const subgroups =
      atoms.length === 1
        ? [atoms]
        : splitByCouplingSignature(
            atoms,
            getCouplingSignatures(
              topicMolecule,
              atoms,
              maxPathLength,
              hoseOptions,
            ),
          );
    for (const subgroup of subgroups) {
      groups.push({
        diaID,
        atomLabel: molecule.getAtomLabel(subgroup[0]),
        atoms: subgroup,
      });
    }
  }

  groups.sort((first, second) => first.atoms[0] - second.atoms[0]);
  return groups;
}

/**
 * Describe how each atom relates to every atom it may couple with.
 * @param topicMolecule - the molecule to analyse.
 * @param atoms - the atoms to describe.
 * @param maxPathLength - largest path length that still counts as a coupling.
 * @param hoseOptions - options forwarded to the hose code generation.
 * @returns for each atom, the descriptor of its relation to every partner atom.
 */
function getCouplingSignatures(
  topicMolecule: TopicMolecule,
  atoms: number[],
  maxPathLength: number,
  hoseOptions: HoseCodesForAtomsOptions,
): Map<number, Map<number, string>> {
  const molecule = topicMolecule.moleculeWithH;
  const signatures = new Map<number, Map<number, string>>();

  for (const atom of atoms) {
    const descriptors = new Map<number, string[]>();
    const atomPaths = topicMolecule.atomsPaths[atom];
    for (let pathLength = 1; pathLength <= maxPathLength; pathLength++) {
      for (const atomPath of atomPaths[pathLength]) {
        const partner = atomPath.path.at(-1) as number;
        const hoses = getHoseCodesForAtomsAsStrings(molecule, {
          ...hoseOptions,
          rootAtoms: atomPath.path,
          tagAtoms: [atom, partner],
        });
        const descriptor = `${pathLength}:${hoses.join('|')}`;
        const existing = descriptors.get(partner);
        if (existing) {
          existing.push(descriptor);
        } else {
          descriptors.set(partner, [descriptor]);
        }
      }
    }
    const signature = new Map<number, string>();
    for (const [partner, values] of descriptors) {
      signature.set(partner, values.toSorted().join('/'));
    }
    signatures.set(atom, signature);
  }

  return signatures;
}

/**
 * Group the atoms that relate identically to all the other atoms.
 * @param atoms - the atoms sharing one diaID.
 * @param signatures - the descriptors returned by getCouplingSignatures.
 * @returns the subgroups of magnetically equivalent atoms.
 */
function splitByCouplingSignature(
  atoms: number[],
  signatures: Map<number, Map<number, string>>,
): number[][] {
  const subgroups: number[][] = [];
  for (const atom of atoms) {
    const subgroup = subgroups.find((candidate) =>
      hasSameCouplings(
        signatures.get(candidate[0]) as Map<number, string>,
        signatures.get(atom) as Map<number, string>,
        candidate[0],
        atom,
      ),
    );
    if (subgroup) {
      subgroup.push(atom);
    } else {
      subgroups.push([atom]);
    }
  }
  return subgroups;
}

/**
 * Whether two atoms relate in the same way to every atom other than themselves.
 * Their mutual relation is skipped because a coupling is symmetric and can
 * therefore never tell them apart.
 * @param first - descriptors of the first atom.
 * @param second - descriptors of the second atom.
 * @param firstAtom - the first atom.
 * @param secondAtom - the second atom.
 * @returns true when the two atoms are magnetically equivalent.
 */
function hasSameCouplings(
  first: Map<number, string>,
  second: Map<number, string>,
  firstAtom: number,
  secondAtom: number,
): boolean {
  for (const [partner, descriptor] of first) {
    if (partner === secondAtom) continue;
    if (second.get(partner) !== descriptor) return false;
  }
  for (const [partner, descriptor] of second) {
    if (partner === firstAtom) continue;
    if (first.get(partner) !== descriptor) return false;
  }
  return true;
}
