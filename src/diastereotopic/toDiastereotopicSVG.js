import { getDiastereotopicAtomIDsAndH } from './getDiastereotopicAtomIDsAndH.js';

/**
 * Returns a SVG
 * @param {*} molecule
 * @param {*} [options={}]
 */
export function toDiastereotopicSVG(molecule, options = {}) {
  const {
    width = 300,
    height = 200,
    prefix = 'ocl',
    heavyAtomHydrogen = false,
  } = options;
  let svg = options.svg;
  let diaIDs = [];

  const hydrogenInfo = {};
  for (const line of getDiastereotopicAtomIDsAndH(molecule)) {
    hydrogenInfo[line.oclID] = line;
  }

  if (heavyAtomHydrogen) {
    for (let i = 0; i < molecule.getAtoms(); i++) {
      diaIDs.push([]);
    }
    const groupedDiaIDs = molecule.getGroupedDiastereotopicAtomIDs();
    for (const diaID of groupedDiaIDs) {
      if (
        hydrogenInfo[diaID.oclID] &&
        hydrogenInfo[diaID.oclID].nbHydrogens > 0
      ) {
        for (const atom of diaID.atoms) {
          for (const id of hydrogenInfo[diaID.oclID].hydrogenOCLIDs) {
            if (!diaIDs[atom * 1].includes(id)) diaIDs[atom].push(id);
          }
        }
      }
    }
  } else {
    diaIDs = molecule.getDiastereotopicAtomIDs().map((a) => [a]);
  }

  if (!svg) svg = molecule.toSVG(width, height, prefix);

  svg = svg.replaceAll(/Atom:\d+"/g, (value) => {
    const atom = value.replaceAll(/\D/g, '');
    return `${value} data-diaid="${diaIDs[atom].join(',')}"`;
  });

  return svg;
}
