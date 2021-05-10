export default function pushMoleculeInfo(moleculesDB, moleculeInfo, data = {}) {
  if (typeof moleculeInfo !== 'object') {
    throw new Error('pushMoleculeInfo requires an object as first parameter');
  }
  const Molecule = moleculesDB.OCL.Molecule;
  let molecule;
  if (moleculeInfo.molfile) {
    molecule = Molecule.fromMolfile(moleculeInfo.molfile);
  }
  if (moleculeInfo.smiles) molecule = Molecule.fromSmiles(moleculeInfo.smiles);
  if (moleculeInfo.idCode) {
    if (moleculesDB.db[moleculeInfo.idCode]) {
      molecule = moleculesDB.db[moleculeInfo.idCode].molecule;
    } else {
      molecule = Molecule.fromIDCode(
        moleculeInfo.idCode,
        moleculeInfo.coordinates || false,
      );
    }
  }

  if (molecule) {
    moleculesDB.pushEntry(molecule, data, moleculeInfo);
  }
}
