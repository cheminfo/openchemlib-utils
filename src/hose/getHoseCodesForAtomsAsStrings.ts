import type { Molecule } from 'openchemlib';

import type { HoseCodesForAtomsOptions } from './HoseCodesForAtomsOptions.js';
import { getHoseCodesForAtomsAsFragments } from './getHoseCodesForAtomsAsFragments.js';

/**
 * Returns an array of strings (idCodes) specified molecule. Each string corresponds to a
 * hose code. By default it will calculate the hose codes for sphere 0 to 4 and will reuse
 * the existing tagged atoms.
 * @param molecule - The OCL molecule to process.
 * @param options - Options for generating hose codes.
 * @returns An array of hose code strings.
 */
export function getHoseCodesForAtomsAsStrings(
  molecule: Molecule,
  options: HoseCodesForAtomsOptions = {},
): string[] {
  const fragments = getHoseCodesForAtomsAsFragments(molecule, options);
  const OCL = molecule.getOCL();
  const hoses = [];
  for (const fragment of fragments) {
    hoses.push(
      fragment.getCanonizedIDCode(
        OCL.Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
      ),
    );
  }
  return hoses;
}
