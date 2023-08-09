import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';
import { getConnectivityMatrix } from '../util/getConnectivityMatrix.js';
import { getSymmetryRanks } from '../util/getSymmetryRanks.js';
import { makeRacemic } from '../util/makeRacemic.js';
import { tagAtom } from '../util/tagAtom.js';

import { getHoseCodesForAtomsInternal } from './getHoseCodesForAtomsInternal.js';

/**
 * Returns an object containing a molfile, molfile with hydrogens, hoses codes and optionally the diaIDs
 * and the diaIDs
 * The map allows to reload properties assigned to the atom molfile
 * Please take care than numbering of atoms starts at 0 !
 * @param {import('openchemlib').Molecule} molecule
 * @param {object} [options={}]
 * @param {string[]} [options.atomLabels]
 * @param {boolean} [options.calculateDiastereotopicIDs=true]
 * @param {number} [options.minSphereSize=0]
 * @param {number} [options.maxSphereSize=4]
 * @returns
 */
export function getHoseCodesAndInfo(molecule, options = {}) {
  const {
    minSphereSize,
    maxSphereSize,
    calculateDiastereotopicIDs = true,
  } = options;
  const { Molecule } = molecule.getOCL();
  molecule = molecule.getCompactCopy();
  // this will force reordering of the hydrogens to the end, just to have the same order as in the molfile
  molecule.ensureHelperArrays(Molecule.cHelperNeighbours);
  const newMolfile = molecule.toMolfile();
  molecule.addImplicitHydrogens();
  ensureHeterotopicChiralBonds(molecule);
  molecule.ensureHelperArrays(Molecule.cHelperSymmetryStereoHeterotopicity);
  const newMolfileWithH = molecule.toMolfile();

  const symmetryRanks = getSymmetryRanks(molecule);
  const cache = {};
  const hoses = [];
  const diaIDs = [];

  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const rank = symmetryRanks[i];
    if (rank && cache[rank]) {
      diaIDs.push(cache[rank].diaID);
      hoses.push(cache[rank].hose);
      continue;
    }
    const tempMolecule = molecule.getCompactCopy();
    tagAtom(tempMolecule, i);

    let diaID;
    if (calculateDiastereotopicIDs) {
      makeRacemic(tempMolecule);
      diaID = tempMolecule.getCanonizedIDCode(
        Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
      );
      diaIDs.push(diaID);
    }

    const hose = getHoseCodesForAtomsInternal(tempMolecule, {
      minSphereSize,
      maxSphereSize,
    });
    hoses.push(hose);
    cache[rank] = { diaID, hose };
  }

  const distanceMatrix = getConnectivityMatrix(molecule, { pathLength: true });

  return {
    molfile: newMolfile,
    molfileWithH: newMolfileWithH,
    hoses,
    diaIDs: calculateDiastereotopicIDs ? diaIDs : undefined,
    moleculeWithHydrogens: molecule,
    distanceMatrix,
  };
}
