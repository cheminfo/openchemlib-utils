import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { MoleculesDB } from '../MoleculesDB';

describe('appendEntries', () => {
  const entries = JSON.parse(
    readFileSync(join(import.meta.dirname, './data/compounds.json'), 'utf8'),
  ).data;
  it('should parse all molecules and skip empty', async () => {
    const moleculesDB = new MoleculesDB(OCL);

    let called = 0;

    function onStep(current, total) {
      expect(current).toBe(++called);
      expect(total).toBe(15);
    }

    await moleculesDB.appendEntries(entries);
    expect(moleculesDB.getDB()).toHaveLength(0);
    await moleculesDB.appendEntries(entries, {
      idCodePath: 'data.ocl.idCode',
      indexPath: 'data.ocl.index',
      coordinatesPath: 'data.ocl.coordinates',
      mwPath: 'data.mw',
      onStep,
    });
    expect(moleculesDB.getDB()).toHaveLength(10);
    expect(called).toBe(15);
  });

  it('should parse all molecules, consider empty', async () => {
    const moleculesDB = new MoleculesDB(OCL, {
      keepEmptyMolecules: true,
    });

    let called = 0;

    function onStep(current, total) {
      expect(current).toBe(++called);
      expect(total).toBe(15);
    }

    await moleculesDB.appendEntries(entries, {
      idCodePath: 'data.ocl.idCode',
      indexPath: 'data.ocl.index',
      coordinatesPath: 'data.ocl.coordinates',
      mwPath: 'data.mw',
      onStep,
    });
    expect(moleculesDB.getDB()).toHaveLength(15);
    expect(called).toBe(15);

    const results = await moleculesDB.search('', { format: 'smiles' });
    expect(results).toHaveLength(15);
    const results2 = await moleculesDB.search('C', { format: 'smiles' });
    expect(results2).toHaveLength(10);
  });
});
