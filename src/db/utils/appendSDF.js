import { ensureString } from 'ensure-string';
import sdfParser from 'sdf-parser';

export default async function appendSDF(moleculesDB, sdf, options = {}) {
  const { onStep } = options;
  sdf = ensureString(sdf);
  if (typeof sdf !== 'string') {
    throw new TypeError('sdf must be a string');
  }
  const parsed = sdfParser(sdf);
  moleculesDB.statistics = parsed.statistics;
  for (let i = 0; i < parsed.molecules.length; i++) {
    const molecule = parsed.molecules[i];
    moleculesDB.pushEntry(
      moleculesDB.OCL.Molecule.fromMolfile(molecule.molfile),
      molecule,
    );
    if (onStep) {
      await onStep(i + 1, parsed.molecules.length);
    }
  }
}
