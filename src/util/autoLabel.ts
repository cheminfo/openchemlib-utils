import type { Molecule } from 'openchemlib';

import { applyFragmentLabels } from './applyFragmentLabels.ts';
import { autoLabelDatabase } from './autoLabelDatabase.js';

/**
 * In place modification of the molecule to add auto labels to its atoms based on
 * a database of common substructures.
 * @param molecule
 */
export function autoLabel(molecule: Molecule) {
  const { Molecule } = molecule.getOCL();

  for (const entry of autoLabelDatabase) {
    const fragment = Molecule.fromIDCode(entry.idCode);
    const result = applyFragmentLabels(molecule, fragment, {
      algorithm: 'separated',
    });
    if (result > 0) return;
  }
}
