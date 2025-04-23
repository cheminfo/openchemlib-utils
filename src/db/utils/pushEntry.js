import { v4 } from '@lukeed/uuid';

/**
 *
 * @param {MoleculesDB} moleculesDB
 * @param {import('openchemlib').Molecule} molecule
 * @param {object} data
 * @param {object} [moleculeInfo]
 * @param {string} [moleculeInfo.idCode]
 * @param {number[]} [moleculeInfo.index]
 */

export default function pushEntry(
  moleculesDB,
  molecule,
  data = {},
  moleculeInfo = {},
) {
  // the following line could be the source of problems if the idCode version
  // changes

  const moleculeIDCode = getMoleculeIDCode(molecule, moleculeInfo);
  const id = moleculeIDCode || v4();

  let entry = moleculesDB.db[id];

  if (!entry) {
    // a new molecule

    // ensure helper arrays needed for substructure search
    molecule.ensureHelperArrays(moleculesDB.OCL.Molecule.cHelperRings);
    let index;
    if (!moleculeInfo.index) {
      index = molecule.getIndex();
    } else {
      index = moleculeInfo.index;
    }

    const molecularFormula = molecule.getMolecularFormula();

    entry = {
      molecule,
      properties: {
        mw: molecularFormula.relativeWeight,
        em: molecularFormula.absoluteWeight,
        mf: molecularFormula.formula,
      },
      data: [],
      idCode: moleculeIDCode,
      index,
    };
    moleculesDB.db[id] = entry;

    if (moleculesDB.computeProperties) {
      const properties = new moleculesDB.OCL.MoleculeProperties(molecule);
      entry.properties = {
        ...entry.properties,
        acceptorCount: properties.acceptorCount,
        donorCount: properties.donorCount,
        logP: properties.logP,
        logS: properties.logS,
        polarSurfaceArea: properties.polarSurfaceArea,
        rotatableBondCount: properties.rotatableBondCount,
        stereoCenterCount: properties.stereoCenterCount,
      };
    }
    updateStatistics(moleculesDB.calculatedStatistics, entry.properties);
  }
  entry.data.push(data);
  updateStatistics(moleculesDB.dataStatistics, data);
}

function updateStatistics(statistics, data) {
  for (const key in data) {
    const value = data[key];
    if (!statistics.has(key)) {
      statistics.set(key, {
        counter: 0,
        kind: typeof value,
      });
    }
    const stat = statistics.get(key);
    stat.counter++;
    if (stat.kind !== typeof value) {
      stat.kind = 'mixed';
    }
  }
}

function getMoleculeIDCode(molecule, moleculeInfo) {
  let idCode = moleculeInfo.idCode;
  if (!idCode) {
    idCode = molecule.getIDCode();
  }
  if (idCode === 'd@') return ''; // empty molecule
  return idCode;
}
