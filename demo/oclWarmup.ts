import { Molecule } from 'openchemlib';

/**
 * Pays the one-off openchemlib JIT warm-up cost at startup instead of on the
 * user's first keystroke. Every result is discarded.
 */
export function warmUpOCL(): void {
  const molecule = Molecule.fromSmiles('CCO');
  molecule.addImplicitHydrogens();
  molecule.getIDCode();
  molecule.toSVG(10, 10, 'warmup');
}
