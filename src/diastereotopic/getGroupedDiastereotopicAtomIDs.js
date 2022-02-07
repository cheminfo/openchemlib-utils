import { getDiastereotopicAtomIDs } from './getDiastereotopicAtomIDs';
/**
 * This function groups the diasterotopic atomIds of the molecule based on equivalence of atoms. The output object contains
 * a set of chemically equivalent atoms(element.atoms) and the groups of magnetically equivalent atoms (element.magneticGroups)
 * @param {OCL.Molecule} molecule
 * @param {object} [options={}]
 * @param {string} [options.atomLabel] Select atoms of the given atomLabel. By default it returns all the explicit atoms in the molecule
 * @returns {Array}
 */

export function getGroupedDiastereotopicAtomIDs(molecule, options = {}) {
  const { atomLabel } = options;
  let diaIDs = getDiastereotopicAtomIDs(molecule, options);
  let diaIDsObject = {};
  for (let i = 0; i < diaIDs.length; i++) {
    if (!atomLabel || molecule.getAtomLabel(i) === atomLabel) {
      let diaID = diaIDs[i];
      if (!diaIDsObject[diaID]) {
        diaIDsObject[diaID] = {
          counter: 0,
          atoms: [],
          oclID: diaID,
          atomLabel: molecule.getAtomLabel(i),
        };
      }
      diaIDsObject[diaID].counter++;
      diaIDsObject[diaID].atoms.push(i);
    }
  }

  return Object.values(diaIDsObject);
}
