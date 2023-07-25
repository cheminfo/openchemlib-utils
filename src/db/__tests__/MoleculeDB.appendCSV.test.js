import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { MoleculesDB } from '../MoleculesDB';

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

    return moleculesDB.appendCSV(csv, { onStep }).then(() => {
      expect(called).toBe(5);
    });
  });
});
