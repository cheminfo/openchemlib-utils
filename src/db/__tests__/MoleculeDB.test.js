import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { MoleculesDB } from '../MoleculesDB';

describe('MoleculesDB', () => {
  describe('appendSmilesList', () => {
    const text = 'CCC\nCCCC\nCCCCC';
    it('should parse all molecules', async () => {
      const moleculesDB = new MoleculesDB(OCL);
      await moleculesDB.appendSmilesList(text);
      expect(moleculesDB.getDB()).toHaveLength(3);
    });

    it('should call step for each molecule', () => {
      const moleculesDB = new MoleculesDB(OCL);
      let called = 0;

      function onStep(current, total) {
        expect(current).toBe(++called);
        expect(total).toBe(3);
      }

      return moleculesDB.appendSmilesList(text, { onStep }).then(() => {
        expect(called).toBe(3);
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

  describe('search async', () => {
    const csv = readFileSync(join(__dirname, './data/data.csv'));
    let moleculesDB;

    beforeAll(async () => {
      moleculesDB = new MoleculesDB(OCL);
      await moleculesDB.appendCSV(csv);
    });

    it('subStructure with SMILES', async () => {
      let result = await moleculesDB.searchAsync('CC', {
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

    it('subStructure with controller', async () => {
      const controller = new AbortController();

      const promise = moleculesDB.searchAsync('CC', {
        format: 'smiles',
        mode: 'substructure',
        controller,
        interval: 0,
      });

      controller.abort();

      await expect(promise).rejects.toHaveProperty('name', 'AbortError');
    });
  });
});
