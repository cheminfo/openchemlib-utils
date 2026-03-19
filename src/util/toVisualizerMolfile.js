import { getDiastereotopicAtomIDs } from '../diastereotopic/getDiastereotopicAtomIDs.js';

/**
 * Convert a molecule to a molfile object compatible with the visualizer.
 * @param {import('openchemlib').Molecule} molecule - The molecule to convert.
 * @param {object} [options={}] - Options to control atom highlighting and grouping.
 * @param {boolean} [options.diastereotopic] - If true, group atoms by diastereotopic IDs.
 * @param {boolean} [options.atomMapNo] - If true, group atoms by their atom map number. Atoms with no map number (0) are excluded from highlighting.
 * @param {boolean} [options.customAtomLabel] - If true, group atoms by their custom atom label. Atoms with no custom label are excluded from highlighting.
 * @param {boolean} [options.heavyAtomHydrogen] - If true, copy each hydrogen's highlight label to its parent heavy atom. When used with diastereotopic, implicit hydrogens are added internally to compute their diastereotopic IDs.
 * @param {boolean} [options.collapseHydrogens] - If true, remove explicit hydrogens from the molfile. Implies heavyAtomHydrogen.
 * @returns {{ type: string, value: string, _highlight: Array, _atoms: object }} A molfile object with highlight and atom mapping information.
 */
export function toVisualizerMolfile(molecule, options = {}) {
  const {
    diastereotopic,
    atomMapNo,
    customAtomLabel,
    heavyAtomHydrogen,
    collapseHydrogens,
  } = options;

  const copyH = heavyAtomHydrogen || collapseHydrogens;

  // Work on a copy to avoid mutating the original molecule.
  // When heavyAtomHydrogen is used with diastereotopic, add implicit H
  // so we can compute their diastereotopic IDs.
  let labelMolecule = molecule.getCompactCopy();
  const { Molecule } = labelMolecule.getOCL();
  if (heavyAtomHydrogen && diastereotopic) {
    labelMolecule.addImplicitHydrogens();
  }
  labelMolecule.ensureHelperArrays(Molecule.cHelperNeighbours);

  // Phase 1: Label all atoms based on the chosen mode
  // Build groups: label → [atomIndices]
  const groups = {};

  if (diastereotopic) {
    const diaIDs = getDiastereotopicAtomIDs(labelMolecule);
    for (let i = 0; i < diaIDs.length; i++) {
      const label = diaIDs[i];
      if (!groups[label]) {
        groups[label] = [];
      }
      if (!groups[label].includes(i)) {
        groups[label].push(i);
      }
    }
  } else if (customAtomLabel) {
    for (let i = 0; i < labelMolecule.getAllAtoms(); i++) {
      const label = labelMolecule.getAtomCustomLabel(i);
      if (!label) continue;
      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(i);
    }
  } else if (atomMapNo) {
    for (let i = 0; i < labelMolecule.getAllAtoms(); i++) {
      const mapNo = labelMolecule.getAtomMapNo(i);
      if (mapNo === 0) continue;
      if (!groups[mapNo]) {
        groups[mapNo] = [];
      }
      groups[mapNo].push(i);
    }
  } else {
    for (let i = 0; i < labelMolecule.getAllAtoms(); i++) {
      groups[i] = [i];
    }
  }

  // Phase 2: If heavyAtomHydrogen or collapseHydrogens, copy each hydrogen's
  // label entries to its parent heavy atom
  if (copyH) {
    for (const atomIndices of Object.values(groups)) {
      for (const atomIndex of atomIndices) {
        if (labelMolecule.getAtomicNo(atomIndex) !== 1) continue;
        if (labelMolecule.getAllConnAtoms(atomIndex) === 0) continue;
        const heavyAtom = labelMolecule.getConnAtom(atomIndex, 0);
        if (!atomIndices.includes(heavyAtom)) {
          atomIndices.push(heavyAtom);
        }
      }
    }
  }

  // Phase 3: Remove H atoms from groups and remap indices.
  // This runs when collapseHydrogens is set, or when we internally added H
  // for heavyAtomHydrogen with diastereotopic (to restore the original atom count).
  const shouldCollapse =
    collapseHydrogens || (heavyAtomHydrogen && diastereotopic);
  if (shouldCollapse) {
    const totalAtoms = labelMolecule.getAllAtoms();
    const isHydrogen = new Array(totalAtoms).fill(false);
    const atomsToDelete = [];
    for (let i = 0; i < totalAtoms; i++) {
      if (labelMolecule.getAtomicNo(i) === 1) {
        isHydrogen[i] = true;
        atomsToDelete.push(i);
      }
    }

    // Build index remap: old index → new index for non-H atoms
    const indexRemap = new Map();
    let newIdx = 0;
    for (let i = 0; i < totalAtoms; i++) {
      if (!isHydrogen[i]) {
        indexRemap.set(i, newIdx++);
      }
    }

    // Remap atom indices in groups: remove H, remap heavy atoms
    for (const label of Object.keys(groups)) {
      groups[label] = groups[label]
        .filter((i) => !isHydrogen[i])
        .map((i) => indexRemap.get(i));
      if (groups[label].length === 0) {
        delete groups[label];
      }
    }

    if (collapseHydrogens) {
      labelMolecule.deleteAtoms(atomsToDelete);
    }
  }

  // Build highlight and atoms from groups
  const highlight = [];
  const atoms = {};
  for (const label of Object.keys(groups)) {
    highlight.push(atomMapNo ? Number(label) : label);
    atoms[label] = groups[label];
  }

  // Use the original molecule for the molfile unless we collapsed H
  const outputMolecule = collapseHydrogens ? labelMolecule : molecule;

  return {
    type: 'mol2d',
    value: outputMolecule.toMolfile(),
    _highlight: highlight,
    _atoms: atoms,
  };
}
