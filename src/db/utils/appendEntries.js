import get from 'get-value';

/**
 * Append an array of entries to the current database. An entry is an object that by default should contain a 'ocl' property containing idCode and optionally index and coordinates
 * @param {*} moleculesDB
 * @param {object[]} entries
 * @param {object} [options={}]
 * @param {string} [options.idCodePath='ocl.idCode']
 * @param {string} [options.indexPath='ocl.index']
 * @param {string} [options.coordinatesPath='ocl.coordinates']
 * @param {string} [options.mwPath='mw']
 * @param {string} [options.smilesPath]
 * @param {string} [options.molfilePath]
 * @param {function} [options.onStep] call back to execute after each molecule
 * @returns
 */

export default async function appendEntries(
  moleculesDB,
  entries,
  options = {},
) {
  const {
    onStep,
    idCodePath = 'ocl.idCode',
    indexPath = 'ocl.index',
    coordinatesPath = 'ocl.coordinates',
    mwPath = 'mw',
    smilesPath,
    molfilePath,
  } = options;
  const Molecule = moleculesDB.OCL.Molecule;
  for (let i = 0; i < entries.length; i++) {
    let idCode;
    const entry = entries[i];
    let molecule;
    if (smilesPath) {
      molecule = Molecule.fromSmiles(get(entry, smilesPath));
    }
    if (molfilePath && !molecule) {
      molecule = Molecule.fromMolfile(get(entry, molfilePath));
    }

    if (!molecule) {
      idCode = get(entry, idCodePath);
      if (idCode) {
        const coordinates = get(entry, coordinatesPath);
        molecule = Molecule.fromIDCode(idCode, coordinates || false);
      }
    }
    const index = get(entry, indexPath);
    const mw = get(entry, mwPath);
    if (molecule) {
      moleculesDB.pushEntry(molecule, entry, { index, mw });
    }
    if (onStep) {
      await onStep(i + 1, entries.length);
    }
  }
}
