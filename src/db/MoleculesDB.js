import appendCSV from './utils/appendCSV';
import appendColor from './utils/appendColor';
import appendSDF from './utils/appendSDF';
import appendSmilesList from './utils/appendSmilesList';
import pushEntry from './utils/pushEntry';
import pushMoleculeInfo from './utils/pushMoleculeInfo';
import search from './utils/search';
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
   * @param {OCL} [OCL] The openchemlib library
   * @param {object} [options={}]
   * @param {boolean} [options.computeProperties=false]
   */
  constructor(OCL, options = {}) {
    const { computeProperties = false } = options;
    this.OCL = OCL;
    this.db = {};
    this.statistics = null;
    this.computeProperties = computeProperties;
    this.searcher = new OCL.SSSearcherWithIndex();
  }

  /**
   * append to the current database a CSV file
   * @param {string|ArrayBuffer} csv - text file containing the comma separated value file
   * @param {object} [options={}]
   * @param {boolean} [options.header=true]
   * @param {boolean} [options.dynamicTyping=true]
   * @param {boolean} [options.skipEmptyLines=true]
   * @param {function} [options.onStep] call back to execute after each molecule
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
   * @param {object} [options={}]
   * @param {function} [options.onStep] call back to execute after each molecule
   * @returns {DB}
   */

  appendSDF(sdf, options) {
    return appendSDF(this, sdf, {
      computeProperties: this.computeProperties,
      ...options,
    });
  }

  /**
   * Append a SDF to the current database
   * @param {string|ArrayBuffer} smiles - text file containing a list of smiles
   * @param {object} [options={}]
   * @param {function} [options.onStep] call back to execute after each molecule
   * @returns {DB}
   */

  appendSmilesList(text, options) {
    return appendSmilesList(this, text, {
      computeProperties: this.computeProperties,
      ...options,
    });
  }

  /**
   * Add a molecule to the current database
   * @param {OCL.Molecule} molecule
   * @param {object} [data={}]
   * @param {object} [moleculeInfo={}] may contain precalculated index and mw
   */

  pushEntry(molecule, data, moleculeInfo) {
    pushEntry(this, molecule, data, moleculeInfo);
  }

  /**
   * Add an entry in the database
   * @param {object} moleculeInfo - a molecule as a JSON that may contain the following properties: molfile, smiles, idCode, mf, index
   * @param {object} [data={}]
   */

  pushMoleculeInfo(moleculeInfo, data) {
    return pushMoleculeInfo(this, moleculeInfo, data);
  }

  /**
   * Search in a MoleculesDB
   * Inside the database all the same molecules are group together
   * @param {string|OCL.Molecule} [query] smiles, molfile, oclCode or instance of Molecule to look for
   * @param {object} [options={}]
   * @param {string} [options.format='idCode'] - query is in the format 'smiles', 'oclid' or 'molfile'
   * @param {string} [options.mode='substructure'] - search by 'substructure', 'exact' or 'similarity'
   * @param {boolean} [options.flattenResult=true] - The database group the data for the same product. This allows to flatten the result
   * @param {boolean} [options.keepMolecule=false] - keep the OCL.Molecule object in the result
   * @param {number} [options.limit=Number.MAX_SAFE_INTEGER] - maximal number of result
   * @return {Array} array of object of the type {(molecule), idCode, data, properties}
   */
  search(query, options) {
    return search(this, query, options);
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
   */
  appendColor(options) {
    appendColor(this, options);
  }
}
