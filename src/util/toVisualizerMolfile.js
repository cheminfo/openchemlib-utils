import { getDiastereotopicAtomIDsAndH } from '../diastereotopic/getDiastereotopicAtomIDsAndH.js';
import { getGroupedDiastereotopicAtomIDs } from '../diastereotopic/getGroupedDiastereotopicAtomIDs.js';

export function toVisualizerMolfile(molecule, options = {}) {
  const { diastereotopic, heavyAtomHydrogen } = options;

  let highlight = [];
  let atoms = {};
  if (diastereotopic) {
    const hydrogenInfo = {};
    const extendedIDs = getDiastereotopicAtomIDsAndH(molecule);
    for (const line of extendedIDs) {
      hydrogenInfo[line.oclID] = line;
    }

    const diaIDs = getGroupedDiastereotopicAtomIDs(molecule);
    for (const diaID of diaIDs) {
      atoms[diaID.oclID] = diaID.atoms;
      highlight.push(diaID.oclID);
      if (
        heavyAtomHydrogen &&
        hydrogenInfo[diaID.oclID] &&
        hydrogenInfo[diaID.oclID].nbHydrogens > 0
      ) {
        for (const id of hydrogenInfo[diaID.oclID].hydrogenOCLIDs) {
          highlight.push(id);
          atoms[id] = diaID.atoms;
        }
      }
    }
  } else {
    const size = molecule.getAllAtoms();
    highlight = new Array(size).fill(0).map((a, index) => index);
    atoms = highlight.map((a) => [a]);
  }

  const molfile = {
    type: 'mol2d',
    value: molecule.toMolfile(),
    _highlight: highlight,
    _atoms: atoms,
  };

  return molfile;
}
