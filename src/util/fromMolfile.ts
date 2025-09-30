import type * as OCLType from 'openchemlib';

import { changeMolfileCustomLabelPosition } from './changeMolfileCustomLabelPosition.ts';

interface FromMolfileOptions {
  /**
   * If set to 'superscript', it will add a ']' at the beginning of the custom label to be
   * compatible with the way to represent superscript in OCL
   * If set to 'normal', it will remove the ']' at the beginning of the custom label if present
   * If not set, it will keep the label as is
   * Default: undefined (keep as is)
   * @default undefined
   */
  customLabelPosition?: 'normal' | 'superscript' | undefined;
}

/**
 * Try to extract A and V field from a molfile and set the custom atom label to their value
 * Those fileds only exists in molfiles V2000
 * By default it will first check for A and if not found will check for V
 * @param OCL - openchemlib library
 * @param molfile
 * @param options
 * @returns - instance of Molecule with custom atom labels set when A or V lines were found
 */
export function fromMolfile(
  OCL: typeof OCLType,
  molfile: string,
  options: FromMolfileOptions = {},
) {
  const { customLabelPosition } = options;

  const molecule = OCL.Molecule.fromMolfile(molfile);

  // check if molefile is V2000
  const lines = molfile.split('\n');
  if (lines.length < 4 || !lines[3].includes('V2000')) {
    return molecule; // nothing to do
  }
  const possibleLines = lines.slice(
    4 + molecule.getAllAtoms() + molecule.getAllBonds(),
  );
  // we should not forget that for A lines the value is on the next line
  for (let i = 0; i < possibleLines.length; i++) {
    const line = possibleLines[i];
    if (line.startsWith('A  ')) {
      const atom = Number(line.slice(3));
      const valueLine = possibleLines[i + 1]?.trim();
      i++;
      if (
        !Number.isNaN(atom) &&
        atom <= molecule.getAllAtoms() &&
        valueLine &&
        !molecule.getAtomCustomLabel(atom - 1)
      ) {
        molecule.setAtomCustomLabel(atom - 1, valueLine);
      }
    }
    if (line.startsWith('V  ')) {
      const parts = line.split(' ').filter(Boolean);
      if (parts.length >= 3) {
        const atom = Number(parts[1]);
        const label = parts.slice(2).join(' ');
        if (
          !Number.isNaN(atom) &&
          atom <= molecule.getAllAtoms() &&
          !molecule.getAtomCustomLabel(atom - 1)
        ) {
          molecule.setAtomCustomLabel(atom - 1, label);
        }
      }
    }
  }
  changeMolfileCustomLabelPosition(molecule, customLabelPosition);
  return molecule;
}
