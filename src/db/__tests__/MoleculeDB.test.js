import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { MoleculesDB } from '../MoleculesDB';

describe('MoleculesDB', () => {
  describe('appendSDF', () => {
    const sdf = readFileSync(join(__dirname, './data/data.sdf'));
    it('should parse all molecules', async () => {
      let moleculesDB = new MoleculesDB(OCL);
      await moleculesDB.appendSDF(sdf);
      expect(Object.keys(moleculesDB.db)).toHaveLength(10);
      let db = moleculesDB.getDB();
      expect(db).toHaveLength(10);
      expect(db.filter((entry) => entry.properties)).toHaveLength(10);
    });

    it('should call step for each molecule', () => {
      let moleculesDB = new MoleculesDB(OCL);
      let called = 0;
      function onStep(current, total) {
        expect(current).toBe(++called);
        expect(total).toBe(20);
      }
      // eslint-disable-next-line jest/no-test-return-statement
      return moleculesDB.appendSDF(sdf, { onStep: onStep }).then(function () {
        expect(called).toBe(20);
      });
    });

    it('should compute properties', async () => {
      let moleculesDB = new MoleculesDB(OCL, { computeProperties: true });
      await moleculesDB.appendSDF(sdf);
      let firstEntry = moleculesDB.getDB()[0];
      expect(firstEntry).toHaveProperty('properties');
      expect(firstEntry.properties.mf).toBeDefined();
      expect(firstEntry.properties.logP).toBeDefined();
      expect(firstEntry.properties.polarSurfaceArea).toBeDefined();
    });
  });

  describe('appendCSV', () => {
    const csv = readFileSync(join(__dirname, './data/data.csv'));
    it('should parse all molecules', async () => {
      const moleculesDB = new MoleculesDB(OCL);
      await moleculesDB.appendCSV(csv);
      expect(moleculesDB.getDB()).toHaveLength(4);
    });

    it('should call step for each molecule', () => {
      const moleculesDB = new MoleculesDB(OCL);
      let called = 0;
      function onStep(current, total) {
        expect(current).toBe(++called);
        expect(total).toBe(5);
      }
      // eslint-disable-next-line jest/no-test-return-statement
      return moleculesDB.appendCSV(csv, { onStep }).then(() => {
        expect(called).toBe(5);
      });
    });
  });

  describe('search', () => {
    const csv = readFileSync(join(__dirname, './data/data.csv'));
    let moleculesDB;

    beforeAll(async () => {
      moleculesDB = new MoleculesDB(OCL);
      await moleculesDB.appendCSV(csv);
    });

    it('invalid arguments', () => {
      expect(() => {
        moleculesDB.search(null);
      }).toThrow(/toSearch must be a Molecule or string/);
      expect(() => {
        moleculesDB.search('CCC', { mode: 'abc' });
      }).toThrow(/unknown search mode: abc/);
    });

    it('exact with SMILES', () => {
      let result = moleculesDB.search('CC', {
        format: 'smiles',
        mode: 'exact',
      });
      expect(result).toHaveLength(1);
      result = moleculesDB.search('CCC', { format: 'smiles', mode: 'exact' });
      expect(result).toHaveLength(2);
      result = moleculesDB.search('CCC', {
        format: 'smiles',
        mode: 'exact',
        limit: 1,
      });
      expect(result).toHaveLength(1);
      result = moleculesDB.search('CCCO', { format: 'smiles', mode: 'exact' });
      expect(result).toHaveLength(0);
    });

    it('subStructure with SMILES', () => {
      let result = moleculesDB.search('CC', {
        format: 'smiles',
        mode: 'substructure',
      });
      expect(result).toHaveLength(4);
      expect(result[0].data.name).toBe('Ethane');
      result = moleculesDB.search('CCC', { format: 'smiles' });
      expect(result).toHaveLength(3);
      result = moleculesDB.search('CCC', { format: 'smiles', limit: 1 });
      expect(result).toHaveLength(1);
      result = moleculesDB.search('CCCO', { format: 'smiles' });
      expect(result).toHaveLength(0);
      result = moleculesDB.search('', { format: 'smiles' });
      expect(result).toHaveLength(5);
    });

    it('similarity with SMILES', () => {
      let result = moleculesDB.search('CC', {
        format: 'smiles',
        mode: 'similarity',
      });
      expect(result).toHaveLength(5);
      expect(result[0].data.name).toBe('Ethane');
      result = moleculesDB.search('CC', {
        format: 'smiles',
        mode: 'similarity',
        limit: 2,
      });
      expect(result).toHaveLength(2);
    });
  });
});
