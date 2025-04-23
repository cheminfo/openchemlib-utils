import appendCSV from './utils/appendCSV.js';
import appendColor from './utils/appendColor.js';
import appendEntries from './utils/appendEntries.js';
import appendSDF from './utils/appendSDF.js';
import appendSmilesList from './utils/appendSmilesList.js';
import pushEntry from './utils/pushEntry.js';
import pushMoleculeInfo from './utils/pushMoleculeInfo.js';
import { search, searchAsync } from './utils/search.js';

/*
 * @typedef {object} InternalStatistics
 * @property {number} counter - number of entries
 * @property {'number'|'boolean'|'string'|'object'|'mixed'} kind - kind of value
 */

/**
 * this.db is an object with properties 'oclID' that has as value
 * an object that contains the following properties:
 * molecule: an OCL molecule instance
 * index: OCL index used for substructure searching
 * properties: all the calculates properties
 * data: array containing free data associated with this molecule
 */
export class MoleculesDB {
  /**
   * Creates an instance of MoleculesDB.
   * @param {typeof import('openchemlib')} OCL - openchemlib library
   * @param {object} [options={}] - Options.
   * @param {boolean} [options.computeProperties=false]
   * @param {boolean} [options.keepEmptyMolecules=false]
   */
  constructor(OCL, options = {}) {
    const { computeProperties = false, keepEmptyMolecules = false } = options;
    this.OCL = OCL;
    this.db = {};
    /**
     * @type {Map<string, InternalStatistics>}
     */
    this.dataStatistics = new Map();
    /**
     * @type {Map<string, InternalStatistics>}
     */
    this.calculatedStatistics = new Map();
    this.computeProperties = computeProperties;
    this.keepEmptyMolecules = keepEmptyMolecules;
    this.searcher = new OCL.SSSearcherWithIndex();
  }

  get nbMolecules() {
    return Object.keys(this.db).length;
  }
  get nbData() {
    let number = 0;
    for (const entry of Object.values(this.db)) {
      number += entry.data.length;
    }
    return number;
  }

  get statistics() {
    const nbData = this.nbData;
    const nbMolecules = this.nbMolecules;
    const statistics = {
      data: [],
      calculated: [],
    };
    for (const [key, value] of this.dataStatistics.entries()) {
      const statistic = {
        label: key,
        counter: value.counter,
        kind: value.kind,
        always: value.counter === nbData,
        isNumber: false,
      };
      statistics.data.push(statistic);
      // if kind is numeric, add minValue and maxValue. Need to go through all the values
      if (value.kind === 'number') {
        statistic.isNumeric = true;
        statistic.minValue = Number.POSITIVE_INFINITY;
        statistic.maxValue = Number.NEGATIVE_INFINITY;
        for (const entry of Object.values(this.db)) {
          for (const data of entry.data) {
            if (data[key] < statistic.minValue) {
              statistic.minValue = data[key];
            }
            if (data[key] > statistic.maxValue) {
              statistic.maxValue = data[key];
            }
          }
        }
      }
    }
    for (const [key, value] of this.calculatedStatistics.entries()) {
      const statistic = {
        label: key,
        counter: value.counter,
        kind: value.kind,
        always: value.counter === nbMolecules,
        isNumeric: false,
      };
      statistics.calculated.push(statistic);
      // if kind is numeric, add minValue and maxValue. Need to go through all the values
      if (value.kind === 'number') {
        statistic.isNumeric = true;
        statistic.minValue = Number.POSITIVE_INFINITY;
        statistic.maxValue = Number.NEGATIVE_INFINITY;
        for (const entry of Object.values(this.db)) {
          if (entry.properties[key] < statistic.minValue) {
            statistic.minValue = entry.properties[key];
          }
          if (entry.properties[key] > statistic.maxValue) {
            statistic.maxValue = entry.properties[key];
          }
        }
      }
    }

    return statistics;
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
   * @returns {Promise<void>}
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
   * @param {object} [options={}] - options.
   * @param {boolean} [options.header=true] - if the first line of the file is a header
   * @param {boolean} [options.dynamicTyping=true] - dynamically type the data (convert values to number of boolean if possible)
   * @param {boolean} [options.skipEmptyLines=true] - skip empty lines
   * @param {Function} [options.onStep] - call back to execute after each molecule
   * @returns {Promise<void>}
   */
  appendCSV(csv, options) {
    return appendCSV(this, csv, options);
  }

  /**
   * Append a SDF to the current database
   * @param {string|ArrayBuffer} sdf - text file containing the sdf
   * @param {object} [options={}] - options
   * @param {Function} [options.onStep] - callback to execute after each molecule
   * @param {boolean} [options.dynamicTyping=true] - Dynamically type the data
   * @param {boolean} [options.mixedEOL=false] - Set to true if you know there is a mixture between \r\n and \n
   * @param {string} [options.eol] - Specify the end of line character. Default will be the one found in the file
   * @returns {Promise<void>}
   */
  appendSDF(sdf, options) {
    return appendSDF(this, sdf, options);
  }

  /**
   * Append a list of SMILES to the current database.
   * @param {string|ArrayBuffer} smiles - text file containing a list of smiles
   * @param {object} [options={}] - Options
   * @param {Function} [options.onStep] - call back to execute after each molecule
   * @returns {Promise<void>}
   */
  appendSmilesList(smiles, options) {
    return appendSmilesList(this, smiles, options);
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
