import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { MoleculesDB } from '../MoleculesDB';

describe('appendSDF', () => {
  const sdf = readFileSync(join(__dirname, './data/data.sdf'));
  it('should parse all molecules from SDF', async () => {
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

    return moleculesDB.appendSDF(sdf, { onStep }).then(() => {
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
