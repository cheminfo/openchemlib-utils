import appendCSV from './utils/appendCSV.js';
import appendColor from './utils/appendColor.js';
import appendEntries from './utils/appendEntries.js';
import appendSDF from './utils/appendSDF.js';
import appendSmilesList from './utils/appendSmilesList.js';
import pushEntry from './utils/pushEntry.js';
import pushMoleculeInfo from './utils/pushMoleculeInfo.js';
import { search, searchAsync } from './utils/search.js';

/*
    this.db is an object with properties 'oclID' that has as value
    an object that contains the following properties:
    * molecule: an OCL molecule instance
    * index: OCL index used for substructure searching
    * properties: all the calculates properties
    * data: array containing free data associated with this molecule
  */
export class MoleculesDB {
  /**
   *
   * @param {typeof import('openchemlib')} OCL - openchemlib library
   * @param {object} [options={}] - Options.
   * @param {boolean} [options.computeProperties=false]
   * @param {boolean} [options.keepEmptyMolecules=false]
   */
  constructor(OCL, options = {}) {
    const { computeProperties = false, keepEmptyMolecules = false } = options;
    this.OCL = OCL;
    this.db = {};
    this.statistics = null;
    this.computeProperties = computeProperties;
    this.keepEmptyMolecules = keepEmptyMolecules;
    this.searcher = new OCL.SSSearcherWithIndex();
  }

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
   * @param {Function} [options.onStep] - call back to execute after each molecule
   */
  appendEntries(entries, options) {
    return appendEntries(this, entries, {
      computeProperties: this.computeProperties,
      ...options,
    });
  }

  /**
   * append to the current database a CSV file
   * @param {string|ArrayBuffer} csv - text file containing the comma separated value file
   * @param {object} [options={}]
   * @param {boolean} [options.header=true]
   * @param {boolean} [options.dynamicTyping=true]
   * @param {boolean} [options.skipEmptyLines=true]
   * @param {Function} [options.onStep] - call back to execute after each molecule
   */
  appendCSV(csv, options) {
    return appendCSV(this, csv, {
      computeProperties: this.computeProperties,
      ...options,
    });
  }

  /**
   * Append a SDF to the current database
   * @param {string|ArrayBuffer} sdf - text file containing the sdf
   * @param {object} [options={}] - Options.
   * @param {Function} [options.onStep] - callback to execute after each molecule
   * @param {boolean} [options.dynamicTyping=true] - Dynamically type the data
   * @param {boolean} [options.mixedEOL=false] - Set to true if you know there is a mixture between \r\n and \n
   * @param {string} [options.eol] - Specify the end of line character. Default will be the one found in the file
   * @returns {Promise<void>}
   */
  appendSDF(sdf, options) {
    return appendSDF(this, sdf, {
      computeProperties: this.computeProperties,
      ...options,
    });
  }

  /**
   * Append a list of SMILES to the current database.
   * @param {string|ArrayBuffer} smiles - text file containing a list of smiles
   * @param {object} [options={}] - Options
   * @param {Function} [options.onStep] - call back to execute after each molecule
   * @returns {Promise<void>}
   */
  appendSmilesList(smiles, options) {
    return appendSmilesList(this, smiles, {
      computeProperties: this.computeProperties,
      ...options,
    });
  }

  /**
   * Add a molecule to the current database.
   * @param {import('openchemlib').Molecule} molecule - The molecule to append.
   * @param {object} [data={}] - Options.
   * @param {object} [moleculeInfo={}] - May contain precalculated index and mw.
   */

  pushEntry(molecule, data, moleculeInfo) {
    pushEntry(this, molecule, data, moleculeInfo);
  }

  /**
   * Add an entry in the database.
   * @param {object} moleculeInfo - a molecule as a JSON that may contain the following properties: molfile, smiles, idCode, mf, index
   * @param {object} [data={}]
   */
  pushMoleculeInfo(moleculeInfo, data) {
    return pushMoleculeInfo(this, moleculeInfo, data);
  }

  /**
   * Search in a MoleculesDB
   * Inside the database all the same molecules are group together
   * @param {string|import('openchemlib').Molecule} [query] - smiles, molfile, idlCode or instance of Molecule to look for
   * @param {object} [options={}] - Options
   * @param {'smiles'|'idCode'|'smarts'|'molfile'} [options.format='idCode'] - query format
   * @param {string} [options.mode='substructure'] - search by 'substructure', 'exact' or 'similarity'
   * @param {boolean} [options.flattenResult=true] - The database group the data for the same product. This allows to flatten the result
   * @param {boolean} [options.keepMolecule=false] - keep the OCL.Molecule object in the result
   * @param {number} [options.limit=Number.MAX_SAFE_INTEGER] - maximal number of result
   * @returns {Array} array of object of the type {(molecule), idCode, data, properties}
   */
  search(query, options) {
    return search(this, query, options);
  }

  /**
   * Search in a MoleculesDB
   * Inside the database all the same molecules are group together
   * @param {string|import('openchemlib').Molecule} [query] - smiles, molfile, idCode or instance of Molecule to look for
   * @param {object} [options={}] - Options.
   * @param {'smiles'|'idCode'|'smarts'|'molfile'} [options.format='idCode'] - query format
   * @param {string} [options.mode='substructure'] - search by 'substructure', 'exact' or 'similarity'
   * @param {boolean} [options.flattenResult=true] - The database group the data for the same product. This allows to flatten the result
   * @param {boolean} [options.keepMolecule=false] - keep the OCL.Molecule object in the result
   * @param {number} [options.limit=Number.MAX_SAFE_INTEGER] - maximal number of result
   * @param {number} [options.interval=100] - interval in ms to call the onStep callback
   * @param {Function} [options.onStep] - callback to execute after each interval
   * @param {AbortController} [options.controler] - callback to execute to check if the search should be aborted
   * @returns {Promise<Array>} array of object of the type {(molecule), idCode, data, properties}
   */
  searchAsync(query, options) {
    return searchAsync(this, query, options);
  }

  /**
   * Returns an array with the current database
   * @returns
   */
  getDB() {
    return Object.keys(this.db).map((key) => this.db[key]);
  }

  /**
   * Append the property `data.color` to each entry based on a data or property label
   * {object} [options={}]
   * {string} [options.dataLabel] name of the property from `data` to use
   * {string} [options.propertyLabel] name of the property from `properties` to use
   * {number} [options.colorLabel='color'] name of the property to add in data that will contain the color
   * {number} [options.minValue]
   * {number} [options.maxValue]
   * {number} [options.minHue=0]
   * {number} [options.maxHue=360]
   * {number} [options.saturation=65] percent of color saturation
   * {number} [options.lightness=65] percent of color lightness
   * @param options
   */
  appendColor(options) {
    appendColor(this, options);
  }
}
