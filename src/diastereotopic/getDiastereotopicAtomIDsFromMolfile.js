import { getDiastereotopicAtomIDsAndH } from './getDiastereotopicAtomIDsAndH.js';

/**
 * Parse a molfile and returns an object containing the molecule, the map and the diaIDs
 * The map allows to reload properties assigned to the atom molfile
 * Pelase take care than numbering of atoms starts at 0 !
 * @param {object} OCL - openchemlib library
 * @param {string} molfile
 * @returns
 */
export function getDiastereotopicAtomIDsFromMolfile(OCL, molfile) {
  const { map, molecule } = OCL.Molecule.fromMolfileWithAtomMap(molfile);

  const diaIDsArray = getDiastereotopicAtomIDsAndH(molecule);
  const diaIDs = {};

  for (let i = 0; i < map.length; i++) {
    diaIDs[map[i]] = { source: map[i], destination: i, ...diaIDsArray[i] };
  }

  return { map: diaIDs, molecule, diaIDs: diaIDsArray };
}
