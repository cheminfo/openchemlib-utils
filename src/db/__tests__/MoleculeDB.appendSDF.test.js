import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { MoleculesDB } from '../MoleculesDB';

describe('appendSDF', () => {
  const sdf = readFileSync(join(__dirname, './data/data.sdf'));
  it('should parse all molecules from SDF', async () => {
    const moleculesDB = new MoleculesDB(OCL);
    await moleculesDB.appendSDF(sdf);
    expect(Object.keys(moleculesDB.db)).toHaveLength(10);
    const db = moleculesDB.getDB();
    expect(db).toHaveLength(10);
    expect(db.filter((entry) => entry.properties)).toHaveLength(10);
  });

  it('should call step for each molecule', () => {
    const moleculesDB = new MoleculesDB(OCL);
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
    const moleculesDB = new MoleculesDB(OCL, { computeProperties: true });
    await moleculesDB.appendSDF(sdf);
    const firstEntry = moleculesDB.getDB()[0];
    expect(firstEntry).toHaveProperty('properties');
    expect(firstEntry.properties.mf).toBeDefined();
    expect(firstEntry.properties.logP).toBeDefined();
    expect(firstEntry.properties.polarSurfaceArea).toBeDefined();
  });

  it('stats should be in incremental', async () => {
    const moleculesDB = new MoleculesDB(OCL, { computeProperties: true });
    await moleculesDB.appendSDF(sdf);
    expect(moleculesDB.statistics).toMatchSnapshot();
    expect(
      moleculesDB.statistics.data.map((datum) => datum.counter),
    ).toStrictEqual([20, 20, 20, 19, 19, 9, 19]);
    const sdfTest = readFileSync(join(__dirname, './data/test.sdf'));
    await moleculesDB.appendSDF(sdfTest);
    expect(
      moleculesDB.statistics.data.map((datum) => datum.counter),
    ).toStrictEqual([
      28, 20, 20, 19, 19, 9, 19, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2, 2, 2, 2,
    ]);
    expect(moleculesDB.statistics).toMatchSnapshot();
    moleculesDB.clear();
    await moleculesDB.appendSDF(sdf);
    expect(
      moleculesDB.statistics.data.map((datum) => datum.counter),
    ).toStrictEqual([20, 20, 20, 19, 19, 9, 19]);
  });
});
