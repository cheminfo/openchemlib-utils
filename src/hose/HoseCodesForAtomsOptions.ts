import type { Molecule } from 'openchemlib';

/**
 * Options for generating HOSE codes.
 */
export interface HoseCodesForAtomsOptions {
  /**
   * Array of the custom labels that are considered as root atoms.
   * By default all atoms having a customLabel
   */
  allowedCustomLabels?: string[];

  /**
   * Smallest hose code sphere
   * @default 0
   */
  minSphereSize?: number;

  /**
   * Largest hose code sphere
   * @default 4
   */
  maxSphereSize?: number;

  /**
   * Kind of hose code, default usual sphere
   * @default FULL_HOSE_CODE
   */
  kind?: number;

  /**
   * Array of atom from which we should start to create the HOSE.
   * By default we will used the taggedAtoms
   * @default []
   */
  rootAtoms?: number[];

  /**
   * Array of atom indices to tag as root atoms
   * @default []
   */
  tagAtoms?: number[];

  /**
   * Function to tag an atom as root atom. By default it is defined internal
   */
  tagAtomFct?: (molecule: Molecule, atomIndex: number) => void;
}
