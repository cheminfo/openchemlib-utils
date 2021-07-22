import { getDiastereotopicAtomIDsAndH } from '../diastereotopic/getDiastereotopicAtomIDsAndH';
import { getGroupedDiastereotopicAtomIDs } from '../diastereotopic/getGroupedDiastereotopicAtomIDs';

export function toVisualizerMolfile(molecule, options = {}) {
  const { diastereotopic, heavyAtomHydrogen } = options;

  let highlight = [];
  let atoms = {};
  if (diastereotopic) {
    let hydrogenInfo = {};
    let extendedIDs = getDiastereotopicAtomIDsAndH(molecule);
    for (let line of extendedIDs) {
      hydrogenInfo[line.oclID] = line;
    }

    let diaIDs = getGroupedDiastereotopicAtomIDs(molecule);
    for (const diaID of diaIDs) {
      atoms[diaID.oclID] = diaID.atoms;
      highlight.push(diaID.oclID);
      if (heavyAtomHydrogen) {
        if (
          hydrogenInfo[diaID.oclID] &&
          hydrogenInfo[diaID.oclID].nbHydrogens > 0
        ) {
          for (let id of hydrogenInfo[diaID.oclID].hydrogenOCLIDs) {
            highlight.push(id);
            atoms[id] = diaID.atoms;
          }
        }
      }
    }
  } else {
    let size = molecule.getAllAtoms();
    highlight = new Array(size).fill(0).map((a, index) => index);
    atoms = highlight.map((a) => [a]);
  }

  let molfile = {
    type: 'mol2d',
    value: molecule.toMolfile(),
    _highlight: highlight,
    _atoms: atoms,
  };

  return molfile;
}
