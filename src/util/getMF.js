import { atomSorter } from 'atom-sorter';

/**
 * Calculate the molecular formula in 'chemcalc' notation taking into account fragments, isotopes and charges
 * @param {import('openchemlib').Molecule} molecule an instance of OCL.Molecule
 * @returns {object}
 */

export function getMF(molecule) {
  const entries = molecule.getFragments();
  const result = {};
  let parts = [];
  const allAtoms = [];

  entries.forEach((entry) => {
    const mf = getFragmentMF(entry, allAtoms);
    parts.push(mf);
  });

  const counts = {};
  for (const part of parts) {
    if (!counts[part]) counts[part] = 0;
    counts[part]++;
  }
  parts = [];
  for (const key of Object.keys(counts).sort()) {
    if (counts[key] > 1) {
      parts.push(counts[key] + key);
    } else {
      parts.push(key);
    }
  }

  result.parts = parts;
  result.mf = toMFString(allAtoms);
  return result;
}

function getFragmentMF(molecule, allAtoms) {
  const atoms = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const atom = {};
    atom.charge = molecule.getAtomCharge(i);
    atom.label = molecule.getAtomLabel(i);
    atom.mass = molecule.getAtomMass(i);
    atom.implicitHydrogens = molecule.getImplicitHydrogens(i);
    atoms.push(atom);
    allAtoms.push(atom);
  }
  return toMFString(atoms);
}

function toMFString(atoms) {
  let charge = 0;
  const mfs = {};
  for (const atom of atoms) {
    let label = atom.label;
    charge += atom.charge;
    if (atom.mass) {
      label = `[${atom.mass}${label}]`;
    }
    const mfAtom = mfs[label];
    if (!mfAtom) {
      mfs[label] = 0;
    }
    mfs[label] += 1;
    if (atom.implicitHydrogens) {
      if (!mfs.H) mfs.H = 0;
      mfs.H += atom.implicitHydrogens;
    }
  }

  let mf = '';
  const keys = Object.keys(mfs).sort(atomSorter);
  for (const key of keys) {
    mf += key;
    if (mfs[key] > 1) mf += mfs[key];
  }

  if (charge > 0) {
    mf += `(+${charge > 1 ? charge : ''})`;
  } else if (charge < 0) {
    mf += `(${charge < -1 ? charge : '-'})`;
  }
  return mf;
}
