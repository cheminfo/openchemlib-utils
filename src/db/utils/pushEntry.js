export default function pushEntry(
  moleculesDB,
  molecule,
  data = {},
  moleculeInfo = {},
) {
  // the following line could be the source of problems if the idCode version
  // changes

  let moleculeIDCode = moleculeInfo.idCode
    ? moleculeInfo.idCode
    : molecule.getIDCode();
  let entry = moleculesDB.db[moleculeIDCode];
  if (!entry) {
    // a new molecule
    entry = { molecule, properties: {}, data: [], idCode: moleculeIDCode };
    moleculesDB.db[moleculeIDCode] = entry;

    // ensure helper arrays needed for substructure search
    molecule.ensureHelperArrays(moleculesDB.OCL.Molecule.cHelperRings);
    if (!moleculeInfo.index) {
      entry.index = molecule.getIndex();
    } else {
      entry.index = moleculeInfo.index;
    }

    let molecularFormula;
    if (!moleculeInfo.mw) {
      molecularFormula = molecule.getMolecularFormula();
      entry.properties.mw = molecularFormula.relativeWeight;
    } else {
      entry.properties.mw = moleculeInfo.mw;
    }

    if (moleculesDB.computeProperties) {
      if (!molecularFormula) {
        molecularFormula = molecule.getMolecularFormula();
      }
      const properties = new moleculesDB.OCL.MoleculeProperties(molecule);
      entry.properties.em = molecularFormula.absoluteWeight;
      entry.properties.mf = molecularFormula.formula;
      entry.properties.acceptorCount = properties.acceptorCount;
      entry.properties.donorCount = properties.donorCount;
      entry.properties.logP = properties.logP;
      entry.properties.logS = properties.logS;
      entry.properties.polarSurfaceArea = properties.polarSurfaceArea;
      entry.properties.rotatableBondCount = properties.rotatableBondCount;
      entry.properties.stereoCenterCount = properties.stereoCenterCount;
    }
  }
  entry.data.push(data);
}
