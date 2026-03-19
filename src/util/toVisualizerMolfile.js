import { getDiastereotopicAtomIDsAndH } from '../diastereotopic/getDiastereotopicAtomIDsAndH.js';
import { getGroupedDiastereotopicAtomIDs } from '../diastereotopic/getGroupedDiastereotopicAtomIDs.js';

/**
 * Convert a molecule to a molfile object compatible with the visualizer.
 * @param {import('openchemlib').Molecule} molecule - The molecule to convert.
 * @param {object} [options={}] - Options to control atom highlighting and grouping.
 * @param {boolean} [options.diastereotopic] - If true, group atoms by diastereotopic IDs.
 * @param {boolean} [options.heavyAtomHydrogen] - If true, include hydrogen diastereotopic IDs linked to their parent heavy atom. Only used when `diastereotopic` is true.
 * @param {boolean} [options.atomMapNo] - If true, group atoms by their atom map number. Atoms with no map number (0) are excluded from highlighting.
 * @param {boolean} [options.customAtomLabel] - If true, group atoms by their custom atom label. Atoms with no custom label are excluded from highlighting.
 * @returns {{ type: string, value: string, _highlight: Array, _atoms: object }} A molfile object with highlight and atom mapping information.
 */
export function toVisualizerMolfile(molecule, options = {}) {
  const { diastereotopic, heavyAtomHydrogen, atomMapNo, customAtomLabel } =
    options;

  let highlight = [];
  let atoms = {};
  if (customAtomLabel) {
    const groups = {};
    const size = molecule.getAllAtoms();
    for (let i = 0; i < size; i++) {
      const label = molecule.getAtomCustomLabel(i);
      if (!label) continue;
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(i);
    }
    for (const label of Object.keys(groups)) {
      highlight.push(label);
      atoms[label] = groups[label];
    }
  } else if (atomMapNo) {
    const groups = {};
    const size = molecule.getAllAtoms();
    for (let i = 0; i < size; i++) {
      const mapNo = molecule.getAtomMapNo(i);
      if (mapNo === 0) continue;
      if (!groups[mapNo]) {
        groups[mapNo] = [];
      }
      groups[mapNo].push(i);
    }
    for (const mapNo of Object.keys(groups)) {
      highlight.push(Number(mapNo));
      atoms[mapNo] = groups[mapNo];
    }
  } else if (diastereotopic) {
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
