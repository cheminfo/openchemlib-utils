import { getDiastereotopicAtomIDs } from './getDiastereotopicAtomIDs.js';

/**
 *
 * @param {import('openchemlib').Molecule} molecule
 */
export function getDiastereotopicAtomIDsAndH(molecule) {
  const OCL = molecule.getOCL();
  molecule = molecule.getCompactCopy();
  molecule.addImplicitHydrogens();
  molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

  const diaIDs = getDiastereotopicAtomIDs(molecule);
  const newDiaIDs = [];

  for (let i = 0; i < diaIDs.length; i++) {
    const diaID = diaIDs[i];
    const newDiaID = {
      oclID: diaID,
      hydrogenOCLIDs: [],
      nbHydrogens: 0,
    };
    if (molecule.getAtomicNo(i) === 1) {
      const atom = molecule.getConnAtom(i, 0);
      newDiaID.heavyAtom = diaIDs[atom];
    }
    for (let j = 0; j < molecule.getAllConnAtoms(i); j++) {
      const atom = molecule.getConnAtom(i, j);
      if (molecule.getAtomicNo(atom) === 1) {
        newDiaID.nbHydrogens++;
        if (!newDiaID.hydrogenOCLIDs.includes(diaIDs[atom])) {
          newDiaID.hydrogenOCLIDs.push(diaIDs[atom]);
        }
      }
    }

    newDiaIDs.push(newDiaID);
  }

  return newDiaIDs;
}
