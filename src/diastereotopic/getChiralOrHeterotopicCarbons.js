import { getXAtomicNumber } from '../util/getXAtomicNumber.js';

/**
 * Returns the atoms that are chiral or pseudo chiral.
 * There could be some issues if the original molecule lacks chiral bonds.
 * The function will add them and this could lead to some issues in the case of pseudochiral atoms.
 * @param {import('openchemlib').Molecule} molecule
 * @returns {number[]}
 */
export function getChiralOrHeterotopicCarbons(molecule) {
  const { Molecule } = molecule.getOCL();
  const xAtomicNumber = getXAtomicNumber(molecule);

  const internalMolecule = molecule.getCompactCopy();

  // hydrogens may be diastereotopic, we need to add them
  internalMolecule.addImplicitHydrogens();

  for (let i = 0; i < internalMolecule.getAllAtoms(); i++) {
    // hydrogens are not taken into account during canonization, we need to change them with an atom with a valence of 1
    if (internalMolecule.getAtomicNo(i) === 1) {
      internalMolecule.setAtomicNo(i, xAtomicNumber);
    }
  }

  addPossibleChiralBonds(internalMolecule);
  internalMolecule.ensureHelperArrays(
    Molecule.cHelperSymmetryStereoHeterotopicity,
  );

  const atoms = [];

  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    if (internalMolecule.getAtomicNo(i) === xAtomicNumber) {
      continue;
    }
    if (molecule.getAtomicNo(i) !== internalMolecule.getAtomicNo(i)) {
      throw new Error(
        'getChiralOrHeterotopicCarbons: mismatching atomic numbers',
      );
    }
    if (internalMolecule.getAtomicNo(i) !== 6) {
      continue;
    }

    const neighbourSymmetries = getNeighbourSymmetries(internalMolecule, i);

    if (neighbourSymmetries.length === 4) {
      atoms.push(i);
    }
  }

  return atoms;
}

function addPossibleChiralBonds(molecule) {
  const { Molecule } = molecule.getOCL();
  molecule.ensureHelperArrays(Molecule.cHelperSymmetryStereoHeterotopicity);

  for (let i = 0; i < molecule.getAtoms(); i++) {
    if (molecule.getAtomicNo(i) !== 6) continue;
    if (molecule.getStereoBond(i) >= 0) continue;
    const neighbourSymmetries = getNeighbourSymmetries(molecule, i);
    if (neighbourSymmetries.length <= 2) continue;

    const stereoBond = molecule.getAtomPreferredStereoBond(i);
    if (stereoBond !== -1) {
      molecule.setBondType(stereoBond, Molecule.cBondTypeUp);
      if (molecule.getBondAtom(1, stereoBond) === i) {
        const connAtom = molecule.getBondAtom(0, stereoBond);
        molecule.setBondAtom(0, stereoBond, i);
        molecule.setBondAtom(1, stereoBond, connAtom);
      }
      // To me it seems that we have to add all stereo centers into AND group 0. TLS 9.Nov.2015
      molecule.setAtomESR(i, Molecule.cESRTypeAnd, 0);
    }
  }
}

function getNeighbourSymmetries(molecule, iAtom) {
  const neighbourSymmetries = [];
  for (let j = 0; j < molecule.getAllConnAtoms(iAtom); j++) {
    const connAtom = molecule.getConnAtom(iAtom, j);
    const symmetryRank = molecule.getSymmetryRank(connAtom);
    if (!neighbourSymmetries.includes(symmetryRank)) {
      neighbourSymmetries.push(molecule.getSymmetryRank(connAtom));
    }
  }
  return neighbourSymmetries;
}
