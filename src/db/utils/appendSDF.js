import { ensureString } from 'ensure-string';
import { parse } from 'sdf-parser';

export default async function appendSDF(moleculesDB, sdf, options = {}) {
  const { onStep, dynamicTyping, mixedEOL, eol } = options;

  sdf = ensureString(sdf);
  if (typeof sdf !== 'string') {
    throw new TypeError('sdf must be a string');
  }
  const parsed = parse(sdf, { dynamicTyping, mixedEOL, eol });
  moleculesDB.statistics = parsed.statistics;
  for (let i = 0; i < parsed.molecules.length; i++) {
    const molecule = parsed.molecules[i];
    moleculesDB.pushEntry(
      moleculesDB.OCL.Molecule.fromMolfile(molecule.molfile),
      molecule,
    );
    if (onStep) {
      // eslint-disable-next-line no-await-in-loop
      await onStep(i + 1, parsed.molecules.length);
    }
  }
}
