import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { MoleculesDB } from '../MoleculesDB';

describe('appendCSV', () => {
  const csv = readFileSync(join(__dirname, './data/data.csv'));
  it('should parse all molecules', async () => {
    const moleculesDB = new MoleculesDB(OCL);
    await moleculesDB.appendCSV(csv);
    expect(moleculesDB.getDB()).toHaveLength(5);
  });

  it('should call step for each molecule', () => {
    const moleculesDB = new MoleculesDB(OCL);
    let called = 0;

    function onStep(current, total) {
      expect(current).toBe(++called);
      expect(total).toBe(6);
    }

    return moleculesDB.appendCSV(csv, { onStep }).then(() => {
      expect(called).toBe(6);
    });
  });
});
