/**
 * Calculate the molecular formula in 'chemcalc' notation taking into account fragments, isotopes and charges
 * @param {OCL.Molecule} [molecule] an instance of OCL.Molecule
 * @returns {object}
 */

export function getAtoms(molecule) {
  const entries = molecule.getFragments();
  const atoms = {};
  const result = { atoms, parts: [] };

  entries.forEach((entry) => {
    const part = {};
    result.parts.push(part);
    appendAtomPart(entry, atoms, part);
  });
  return result;
}

function appendAtomPart(molecule, atoms, part) {
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
