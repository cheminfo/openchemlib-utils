import type { Molecule } from 'openchemlib';

import { changeMolfileCustomLabelPosition } from './changeMolfileCustomLabelPosition.ts';

interface ToMolfileOptions {
  /**
   * Include custom atom labels as A lines
   */
  includeCustomAtomLabelsAsALines?: boolean;
  /**
   * Include custom atom labels as V lines
   */
  includeCustomAtomLabelsAsVLines?: boolean;
  /**
   * If set to 'superscript', it will add a ']' at the beginning of the custom label to be
   * compatible with the way to represent superscript in OCL
   * If set to 'normal', it will remove the ']' at the beginning of the custom label if present
   * If not set, it will keep the label as is
   * Default: undefined (keep as is)
   * @default undefined
   */
  customLabelPosition?: 'normal' | 'superscript' | 'auto' | undefined;
}

/**
 * Create a molfile V2000 with the possibility to add A and V lines to set custom atom labels
 * Those fileds only exists in molfiles V2000
 * @param molecule - the molecule to convert
 * @param options - options to include A or V lines
 * @returns the molfile as a string
 */
export function toMolfile(molecule: Molecule, options: ToMolfileOptions = {}) {
  molecule = molecule.getCompactCopy();

  const {
    includeCustomAtomLabelsAsALines = false,
    includeCustomAtomLabelsAsVLines = false,
    customLabelPosition,
  } = options;

  changeMolfileCustomLabelPosition(molecule, customLabelPosition);
  const molfile = molecule.toMolfile();

  if (!includeCustomAtomLabelsAsALines && !includeCustomAtomLabelsAsVLines) {
    return molfile; // nothing to do
  }

  // need to add A or V lines just before M END
  const lines = molfile.split('\n');
  if (lines.length < 4 || !lines[3].includes('V2000')) {
    return molfile; // nothing to do
  }
  const newLines = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const label = molecule.getAtomCustomLabel(i);
    if (label) {
      // need the atom number prepend with spaces to be 3 characters long
      const paddedAtomNumber = String(i + 1).padStart(3, ' ');
      if (includeCustomAtomLabelsAsALines) {
        newLines.push(`A  ${paddedAtomNumber}`, label);
      }
      if (includeCustomAtomLabelsAsVLines) {
        newLines.push(`V  ${paddedAtomNumber} ${label}`);
      }
    }
  }
  // insert newLines just before M  END
  const mEndIndex = lines.findIndex((line) => line.startsWith('M  END'));
  if (mEndIndex === -1) {
    return molfile; // nothing to do
  }
  lines.splice(mEndIndex, 0, ...newLines);
  return lines.join('\n');
}
