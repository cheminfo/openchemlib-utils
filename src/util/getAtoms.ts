/**
 * Calculate the molecular formula in 'chemcalc' notation taking into account fragments, isotopes and charges
 * @param {OCL.Molecule} [molecule] an instance of OCL.Molecule
 * @returns {}
 */

import { Molecule } from 'openchemlib';

type NbAtomsByElement = Record<string, number>;
interface Atoms {
  atoms: NbAtomsByElement;
  parts: NbAtomsByElement[];
}

export function getAtoms(molecule: Molecule): Atoms {
  const entries = molecule.getFragments();
  const atoms: Record<string, number> = {};
  const result: Atoms = { atoms, parts: [] };

  entries.forEach((entry) => {
    const part: NbAtomsByElement = {};
    result.parts.push(part);
    appendAtomPart(entry, atoms, part);
  });
  return result;
}

function appendAtomPart(
  molecule: Molecule,
  atoms: NbAtomsByElement,
  part: NbAtomsByElement,
) {
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const label = molecule.getAtomLabel(i);
    if (!atoms[label]) {
      atoms[label] = 0;
    }
    atoms[label] += 1;
    if (!part[label]) {
      part[label] = 0;
    }
    part[label] += 1;
    const implicitHydrogens = molecule.getImplicitHydrogens(i);
    if (implicitHydrogens) {
      if (!atoms.H) {
        atoms.H = 0;
      }
      atoms.H += implicitHydrogens;
      if (!part.H) {
        part.H = 0;
      }
      part.H += implicitHydrogens;
    }
  }
}
