import type { Molecule } from 'openchemlib';

interface ToMolfileOptions {
  /**
   * Include custom atom labels as A lines
   */
  includeCustomAtomLabelsAsALines?: boolean;
  /**
   * Include custom atom labels as V lines
   */
  includeCustomAtomLabelsAsVLines?: boolean;
}

/**
 * Create a molfile V2000 with the possibility to add A and V lines to set custom atom labels
 * Those fileds only exists in molfiles V2000
 * @param molecule - the molecule to convert
 * @param options - options to include A or V lines
 * @returns the molfile as a string
 */
export function toMolfile(molecule: Molecule, options: ToMolfileOptions = {}) {
  const {
    includeCustomAtomLabelsAsALines = false,
    includeCustomAtomLabelsAsVLines = false,
  } = options;
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
