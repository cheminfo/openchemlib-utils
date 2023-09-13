
/**
 *
 * @param {*} processedMolecules
 * @param {import('openchemlib').Molecule|string} molecule
 * @param {*} options
 * @returns
 */

export function checkIfExistsOrAddInfo(processedMolecules, molecule, options) {
  const { moleculeInfoCallback, asReagent, asProduct } = options;
  const idCode = typeof molecule === 'string' ? idCode : molecule.getIDCode();
  if (processedMolecules.has(idCode)) {
    const entry = processedMolecules.get(idCode);
    let exists = false;
    if (asReagent) {
      if (entry.asReagent) {
        exists = true;
      } else {
        entry.asReagent = true;
      }
    }
    if (asProduct) {
      if (entry.asProduct) {
        exists = true;
      } else {
        entry.asProduct = true;
      }
    }
    return { exists, info: entry };
  } else {
    let info = {
      idCode,
      molfile: molecule.toMolfile(),
      asReagent,
      asProduct,
      info: {}
    };
    if (moleculeInfoCallback) {
      info.info = moleculeInfoCallback(molecule);
    }
    processedMolecules.set(idCode, info);
    return { exists: false, info };
  }

}
