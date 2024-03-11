/**
 * Calculate the molecular formula in 'chemcalc' notation taking into account fragments, isotopes and charges
 * @param {OCL.Molecule} [molecule] an instance of OCL.Molecule
 * @returns {}
 */

import { Molecule } from 'openchemlib';

type AtomQuantity = Record<string, number>;
interface AtomsAndParts {
  atoms: AtomQuantity;
  parts: AtomQuantity[];
}

export function getAtoms(molecule: Molecule): AtomsAndParts {
  const entries = molecule.getFragments();
  const atoms: AtomQuantity = {};
  const result: AtomsAndParts = { atoms, parts: [] };

  entries.forEach((entry) => {
    const part: AtomQuantity = {};
    result.parts.push(part);
    appendAtomPart(entry, atoms, part);
  });
  return result;
}

function appendAtomPart(
  molecule: Molecule,
  atoms: AtomQuantity,
  part: AtomQuantity,
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
