import atomSorter from 'atom-sorter';

/**
 * Calculate the molecular formula in 'chemcalc' notation taking into account fragments, isotopes and charges
 * {OCL.Molecule} [molecule] an instance of OCL.Molecule
 * @returns {object}
 */

export function getMF(molecule) {
  let entries = molecule.getFragments();
  let result = {};
  let parts = [];
  let allAtoms = [];

  entries.forEach((entry) => {
    let mf = getFragmentMF(entry, allAtoms);
    parts.push(mf);
  });

  let counts = {};
  for (let part of parts) {
    if (!counts[part]) counts[part] = 0;
    counts[part]++;
  }
  parts = [];
  for (let key of Object.keys(counts).sort()) {
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
  let atoms = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    let atom = {};
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
  let mfs = {};
  for (let atom of atoms) {
    let label = atom.label;
    charge += atom.charge;
    if (atom.mass) {
      label = `[${atom.mass}${label}]`;
    }
    let mfAtom = mfs[label];
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
  let keys = Object.keys(mfs).sort(atomSorter);
  for (let key of keys) {
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
