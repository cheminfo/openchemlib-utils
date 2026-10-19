import { Molecule } from 'openchemlib';

import { ensureHeterotopicChiralBonds } from '../../src/diastereotopic/ensureHeterotopicChiralBonds.js';

export type InputKind = 'molfile' | 'smiles' | 'idcode';

/** How the text is read: a fixed format, or `auto` to let openchemlib guess. */
export type InputMode = InputKind | 'auto';

/**
 * Build a molecule from user input.
 * @param value - the raw text typed in the playground.
 * @param mode - how to interpret it; `auto` tries a molfile, a SMILES, then an
 * idcode.
 * @returns the parsed molecule, empty when the text is.
 */
export function moleculeFromInput(value: string, mode: InputMode): Molecule {
  const trimmed = value.trim();
  if (trimmed === '') return new Molecule(0, 0);
  return withHeterotopicChiralBonds(parse(trimmed, mode));
}

function parse(trimmed: string, mode: InputMode): Molecule {
  switch (mode) {
    case 'auto': {
      const molecule = Molecule.fromText(trimmed);
      if (!molecule) throw new Error('Not a molfile, a SMILES or an idcode.');
      return molecule;
    }
    case 'molfile':
      return Molecule.fromMolfile(trimmed);
    case 'idcode':
      return Molecule.fromIDCode(trimmed);
    case 'smiles':
      return Molecule.fromSmiles(trimmed);
    default:
      throw new Error(`unknown input kind: ${String(mode)}`);
  }
}

/**
 * A SMILES does not say which methyl of a leucine is `δ1`, so the labelling
 * would be arbitrary. Drawing the wedge openchemlib-utils uses for
 * diastereotopic atoms puts the choice on the screen and fixes the numbering.
 * A structure that carries its own geometry already answers the question, and
 * is left alone.
 * @param molecule - the parsed structure.
 * @returns the same molecule, wedges added.
 */
function withHeterotopicChiralBonds(molecule: Molecule): Molecule {
  if (!molecule.is3D()) ensureHeterotopicChiralBonds(molecule);
  return molecule;
}
