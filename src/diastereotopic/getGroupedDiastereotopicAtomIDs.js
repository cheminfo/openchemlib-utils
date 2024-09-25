import { getDiastereotopicAtomIDs } from './getDiastereotopicAtomIDs';
import { groupDiastereotopicAtomIDs } from './groupDiastereotopicAtomIDs';

/**
 * This function groups the diasterotopic atomIds of the molecule based on equivalence of atoms. The output object contains
 * a set of chemically equivalent atoms(element.atoms) and the groups of magnetically equivalent atoms (element.magneticGroups)
 * @param {import('openchemlib').Molecule} molecule
 * @param {object} [options={}]
 * @param {string} [options.atomLabel] - Select atoms of the given atomLabel. By default it returns all the explicit atoms in the molecule
 * @returns {Array}
 */

export function getGroupedDiastereotopicAtomIDs(molecule, options = {}) {
  const diaIDs = getDiastereotopicAtomIDs(molecule);
  return groupDiastereotopicAtomIDs(diaIDs, molecule, options);
}
