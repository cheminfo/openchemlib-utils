import { getXAtomicNumber } from '../util/getXAtomicNumber.js';
import { makeRacemic } from '../util/makeRacemic.js';
import { tagAtom } from '../util/tagAtom.js';

import { ensureHeterotopicChiralBonds } from './ensureHeterotopicChiralBonds.js';

const MAX_NB_ATOMS = 250;

export class DiastereotopicMolecule {
  constructor(molecule) {
    this.originalMolecule = molecule;
    this.idCode = molecule.getIDCode();
    this.molecule = this.originalMolecule.getCompactCopy();
    this.OCL = molecule.getOCL();
    this.Molecule = this.OCL.Molecule;
    this.molecule.ensureHelperArrays(this.OCL.Molecule.cHelperNeighbours);
    this.cache = {};
  }

  toMolfile() {
    return this.molecule.toMolfile();
  }

  toMolfileWithFinalRanks() {
    return this.moleculeWithFinalRanks.toMolfile();
  }

  finalRankToIndex(finalRank) {
    const finalRanks = this.finalRanks;
    return finalRanks.findIndex((rank) => rank === finalRank);
  }


  /**
   *
   * @param {*} molfile
   */
  updateMolfileWithFinalRanks(molfile) {
    const molecule = this.Molecule.fromMolfile(molfile);
    const idCode = molecule.getIDCode();
    if (idCode !== this.idCode) {
      throw new Error(
        'The molfile does not correspond to the current molecule',
      );
    }
    const xMolecule = getXMolecule(getMoleculeWithH(molecule));
    const finalRanks = getFinalRanks(xMolecule);
    return getMoleculeWithFinalRanks(molecule, finalRanks).toMolfile();
  }

  get moleculeWithH() {
    if (this.cache.moleculeWithH) return this.cache.moleculeWithH;
    this.cache.moleculeWithH = getMoleculeWithH(this.molecule);
    return this.cache.moleculeWithH;
  }

  get xMolecule() {
    if (this.cache.xMolecule) return this.cache.xMolecule;
    this.cache.xMolecule = getXMolecule(this.moleculeWithH);
    return this.cache.xMolecule;
  }

  /**
   * This is related to the current moleculeWithH. The order is NOT canonized
   */
  get diaIDs() {
    if (this.cache.diaIDs) return this.cache.diaIDs;
    this.cache.diaIDs = getDiaIDs(this);
    return this.cache.diaIDs;
  }

  get diaIDsAndH() {
    if (this.cache.diaIDsAndH) return this.cache.diaIDsAndH;
    this.cache.diaIDsAndH = getDiaIDsAndH(this);
    return this.cache.diaIDsAndH;
  }

  /**
   * Returns symmetryRanks for all the atoms including hydrogens. Those ranks
   * deals with topicity and is related to the current moleculeWithH.
   * In order to calculate the ranks we replace all the
   * hydrogens with a X atom.
   */
  get heterotopicSymmetryRanks() {
    if (this.cache.heterotopicSymmetryRanks) return this.cache.heterotopicSymmetryRanks;
    this.cache.heterotopicSymmetryRanks = getHeterotopicSymmetryRanks(this.xMolecule);
    return [...this.cache.heterotopicSymmetryRanks];
  }

  /**
   * Returns finalRanks for all the atoms including hydrogens. Those ranks
   * deals with topicity and is related to the current moleculeWithH.
   * All the atoms have a unique identifier.j
   * In order to calculate the ranks we replace all the
   * hydrogens with a X atom.
   */
  get finalRanks() {
    if (this.cache.finalRanks) return this.cache.finalRanks;
    this.cache.finalRanks = getFinalRanks(this.xMolecule)
    return this.cache.finalRanks;
  }

  get moleculeWithFinalRanks() {
    if (this.cache.moleculeWithFinalRanks) {
      return this.cache.moleculeWithFinalRanks;
    }
    this.cache.moleculeWithFinalRanks = getMoleculeWithFinalRanks(this.molecule, this.finalRanks);
    return this.cache.moleculeWithFinalRanks;
  }

  toMolfileWithH() {
    return this.moleculeWithH.toMolfile();
  }
}

function getMoleculeWithFinalRanks(molecule, finalRanks) {
  const moleculeWithFinalRanks = molecule.getCompactCopy();
  // force hydrogens to be at the end of the file
  moleculeWithFinalRanks.ensureHelperArrays(molecule.getOCL().Molecule.cHelperNeighbours);
  for (let i = 0; i < moleculeWithFinalRanks.getAllAtoms(); i++) {
    moleculeWithFinalRanks.setAtomMapNo(i, finalRanks[i], false);
  }
  return moleculeWithFinalRanks
}


function getDiaIDsAndH(diaMol) {
  const diaIDs = diaMol.diaIDs;
  const newDiaIDs = [];
  const molecule = diaMol.moleculeWithH;

  for (let i = 0; i < diaIDs.length; i++) {
    const diaID = diaIDs[i];
    const newDiaID = {
      oclID: diaID,
      hydrogens: [],
      heavyAtom: undefined,
    };
    if (molecule.getAtomicNo(i) === 1) {
      const atom = molecule.getConnAtom(i, 0);
      newDiaID.heavyAtom = diaIDs[atom];
    }
    for (let j = 0; j < molecule.getAllConnAtoms(i); j++) {
      const atom = molecule.getConnAtom(i, j);
      if (molecule.getAtomicNo(atom) === 1) {
        if (!newDiaID.hydrogens.includes(diaIDs[atom])) {
          newDiaID.hydrogens.push(diaIDs[atom]);
        }
      }
    }
    newDiaIDs.push(newDiaID);
  }
  return newDiaIDs;
}

function getMoleculeWithH(molecule) {
  const moleculeWithH = molecule.getCompactCopy();
  moleculeWithH.addImplicitHydrogens();
  if (moleculeWithH.getAllAtoms() > MAX_NB_ATOMS) {
    throw new Error(
      `Too many atoms to add hydrogens: ${moleculeWithH.getAllAtoms()} > ${MAX_NB_ATOMS}`,
    );
  }
  ensureHeterotopicChiralBonds(moleculeWithH);
  return moleculeWithH;
}



function getDiaIDs(diaMol) {
  const heterotopicSymmetryRanks = diaMol.heterotopicSymmetryRanks;
  const moleculeWithH = diaMol.moleculeWithH;
  const diaIDs = [];
  moleculeWithH.ensureHelperArrays(
    diaMol.Molecule.cHelperSymmetryStereoHeterotopicity,
  );
  const cache = {};
  for (let i = 0; i < diaMol.moleculeWithH.getAllAtoms(); i++) {
    const rank = heterotopicSymmetryRanks[i];
    if (rank && cache[rank]) {
      diaIDs.push(cache[rank].diaID);
      continue;
    }
    const tempMolecule = diaMol.moleculeWithH.getCompactCopy();
    tagAtom(tempMolecule, i);
    makeRacemic(tempMolecule);
    let diaID = tempMolecule.getCanonizedIDCode(
      diaMol.OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
    );
    diaIDs.push(diaID);
  }
  return diaIDs;
}

function getXMolecule(moleculeWithH) {
  const xAtomNumber = getXAtomicNumber(moleculeWithH);
  const xMolecule = moleculeWithH.getCompactCopy();
  for (let i = 0; i < xMolecule.getAllAtoms(); i++) {
    // hydrogens are not taken into account during canonization, we need to change them with an atom with a valence of 1
    if (xMolecule.getAtomicNo(i) === 1) {
      xMolecule.setAtomicNo(i, xAtomNumber);
    }
  }
  return xMolecule
}

function getHeterotopicSymmetryRanks(xMolecule) {
  xMolecule.ensureHelperArrays(
    xMolecule.getOCL().Molecule.cHelperSymmetryStereoHeterotopicity,
  );
  const symmetryRanks = [];
  for (let i = 0; i < xMolecule.getAllAtoms(); i++) {
    symmetryRanks.push(xMolecule.getSymmetryRank(i));
  }
  return symmetryRanks;
}

function getFinalRanks(xMolecule) {
  xMolecule.ensureHelperArrays(
    xMolecule.getOCL().Molecule.cHelperSymmetryStereoHeterotopicity,
  );
  return [...xMolecule.getFinalRanks()];
}


