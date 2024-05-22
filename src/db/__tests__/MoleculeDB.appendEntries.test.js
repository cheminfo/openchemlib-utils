import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { MoleculesDB } from '../MoleculesDB';

describe('appendEntries', () => {
  const entries = JSON.parse(
    readFileSync(join(__dirname, './data/compounds.json'), 'utf8'),
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
  });
});
