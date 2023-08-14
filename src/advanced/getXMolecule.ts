import type { Molecule } from 'openchemlib';
import { getXAtomicNumber } from '../util/getXAtomicNumber.js';

/**
 * In order to be able to give a unique ID to all the atoms we are replacing the H by X
 * @param moleculeWithH
 * @returns
 */
export function getXMolecule(moleculeWithH: Molecule) {
  const xAtomNumber = getXAtomicNumber(moleculeWithH);
  const xMolecule = moleculeWithH.getCompactCopy();
  for (let i = 0; i < xMolecule.getAllAtoms(); i++) {
    // hydrogens are not taken into account during canonization, we need to change them with an atom with a valence of 1
    if (xMolecule.getAtomicNo(i) === 1) {
      xMolecule.setAtomicNo(i, xAtomNumber);
    }
  }
  return xMolecule;
}
