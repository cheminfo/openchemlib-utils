import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { MoleculesDB } from '../MoleculesDB';

describe('appendCSV', () => {
  const csv = readFileSync(join(import.meta.dirname, './data/data.csv'));

  it('should parse all molecules', async () => {
    const moleculesDB = new MoleculesDB(OCL);
    await moleculesDB.appendCSV(csv);

    expect(moleculesDB.getDB()).toHaveLength(5);
  });

  it('should call step for each molecule', async () => {
    const moleculesDB = new MoleculesDB(OCL);
    let called = 0;

    function onStep(current, total) {
      expect(current).toBe(++called);
      expect(total).toBe(6);
    }

    await moleculesDB.appendCSV(csv, { onStep });

    expect(called).toBe(6);
  });
});
