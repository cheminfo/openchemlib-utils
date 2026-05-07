import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';
import { beforeAll, describe, expect, it, test } from 'vitest';

import { MoleculesDB } from '../MoleculesDB';

describe('appendSmilesList', () => {
  const text = 'CCC\nCCCC\nCCCCC';

  it('should parse all molecules', async () => {
    const moleculesDB = new MoleculesDB(OCL);
    await moleculesDB.appendSmilesList(text);

    expect(moleculesDB.getDB()).toHaveLength(3);
  });

  it('should call step for each molecule', async () => {
    const moleculesDB = new MoleculesDB(OCL);
    let called = 0;

    function onStep(current, total) {
      expect(current).toBe(++called);
      expect(total).toBe(3);
    }

    await moleculesDB.appendSmilesList(text, { onStep });

    expect(called).toBe(3);
  });
});

describe('search', () => {
  const csv = readFileSync(join(import.meta.dirname, './data/data.csv'));
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

    expect(result).toHaveLength(5);
    expect(result[0].data.name).toBe('Ethane');

    result = moleculesDB.search('CCC', { format: 'smiles' });

    expect(result).toHaveLength(3);

    result = moleculesDB.search('CCC', { format: 'smiles', limit: 1 });

    expect(result).toHaveLength(1);

    result = moleculesDB.search('CCCO', { format: 'smiles' });

    expect(result).toHaveLength(0);

    result = moleculesDB.search('CC.O', { format: 'smiles' });

    expect(result).toHaveLength(0);

    result = moleculesDB.search('CC.CC', { format: 'smiles' });

    expect(result).toHaveLength(2);

    result = moleculesDB.search('CC.N', { format: 'smiles' });

    expect(result).toHaveLength(1);

    result = moleculesDB.search('', { format: 'smiles' });

    expect(result).toHaveLength(6);
  });

  it('subStructureOR with SMILES', () => {
    const mode = 'substructureOR';
    let result;
    result = moleculesDB.search('CC', {
      format: 'smiles',
      mode,
    });

    expect(result).toHaveLength(5);
    expect(result[0].data.name).toBe('Ethane');

    result = moleculesDB.search('CCC', { format: 'smiles', mode });

    expect(result).toHaveLength(3);

    result = moleculesDB.search('CCC', { format: 'smiles', mode, limit: 1 });

    expect(result).toHaveLength(1);

    result = moleculesDB.search('CCCO', { format: 'smiles', mode });

    expect(result).toHaveLength(0);

    result = moleculesDB.search('CC.O', { format: 'smiles', mode });

    expect(result).toHaveLength(5);

    result = moleculesDB.search('CC.CC', { format: 'smiles', mode });

    expect(result).toHaveLength(5);

    result = moleculesDB.search('CC.N', {
      format: 'smiles',
      mode,
    });

    expect(result).toHaveLength(5);

    result = moleculesDB.search('N.CC', {
      format: 'smiles',
      mode,
    });

    expect(result).toHaveLength(5);

    result = moleculesDB.search('', { format: 'smiles' });

    expect(result).toHaveLength(6);
  });

  it('subStructure with SMARTS', () => {
    const result = moleculesDB.search('CC[O,Cl,N]', {
      format: 'smarts',
      mode: 'substructure',
    });

    expect(result).toHaveLength(1);
  });

  it('similarity with SMILES', () => {
    let result = moleculesDB.search('CC', {
      format: 'smiles',
      mode: 'similarity',
    });

    expect(result).toHaveLength(6);
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
  const csv = readFileSync(join(import.meta.dirname, './data/data.csv'));
  let moleculesDB;

  beforeAll(async () => {
    moleculesDB = new MoleculesDB(OCL);
    await moleculesDB.appendCSV(csv);
  });

  it('subStructure with SMILES async', async () => {
    let result = await moleculesDB.searchAsync('CC', {
      format: 'smiles',
      mode: 'substructure',
    });

    expect(result).toHaveLength(5);
    expect(result[0].data.name).toBe('Ethane');

    result = moleculesDB.search('CCC', { format: 'smiles' });

    expect(result).toHaveLength(3);

    result = moleculesDB.search('CCC', { format: 'smiles', limit: 1 });

    expect(result).toHaveLength(1);

    result = moleculesDB.search('CCCO', { format: 'smiles' });

    expect(result).toHaveLength(0);

    result = moleculesDB.search('', { format: 'smiles' });

    expect(result).toHaveLength(6);
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

test('exactNoStereo with SMILES', async () => {
  const text = 'CC(Cl)Br\nC[C@H](Cl)Br\nC[C@@H](Cl)Br';
  const moleculesDB = new MoleculesDB(OCL);
  await moleculesDB.appendSmilesList(text);

  expect(moleculesDB.getDB()).toHaveLength(3);

  const results1 = moleculesDB.search('CC(Cl)Br', {
    format: 'smiles',
    mode: 'exact',
  });

  expect(results1).toHaveLength(1);

  const results2 = moleculesDB.search('CC(Cl)Br', {
    format: 'smiles',
    mode: 'exactNoStereo',
  });

  expect(results2).toHaveLength(3);

  const results3 = moleculesDB.search('C[C@H](Cl)Br', {
    format: 'smiles',
    mode: 'exactNoStereo',
  });

  expect(results3).toHaveLength(3);
});
