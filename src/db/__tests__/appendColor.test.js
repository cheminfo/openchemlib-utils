import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { MoleculesDB } from '../MoleculesDB';

describe('appendColor', async () => {
  const sdf = readFileSync(join(import.meta.dirname, './data/data.sdf'));
  const moleculesDB = new MoleculesDB(OCL);
  await moleculesDB.appendSDF(sdf);
  const db = moleculesDB.getDB();
  it('test DB', () => {
    expect(db).toHaveLength(10);
  });

  it('undefined colors', () => {
    moleculesDB.appendColor({});
    const colors = getDistinctColors(db);
    expect(colors).toStrictEqual(['black']);
  });
  it('colors based on data label', () => {
    moleculesDB.appendColor({ dataLabel: 'mw' });
    const colors = getDistinctColors(db);
    expect(colors).toStrictEqual([
      'hsl(0,65%,65%)',
      'black',
      'hsl(63,65%,65%)',
      'hsl(350,65%,65%)',
      'hsl(360,65%,65%)',
      'hsl(354,65%,65%)',
      'hsl(58,65%,65%)',
      'hsl(321,65%,65%)',
      'hsl(319,65%,65%)',
      'hsl(234,65%,65%)',
      'hsl(155,65%,65%)',
    ]);
  });

  it('colors based on property label', () => {
    moleculesDB.appendColor({ propertyLabel: 'mw' });
    const colors = getDistinctColors(db);
    expect(colors).toStrictEqual([
      'hsl(0,65%,65%)',
      'hsl(63,65%,65%)',
      'hsl(350,65%,65%)',
      'hsl(360,65%,65%)',
      'hsl(354,65%,65%)',
      'hsl(58,65%,65%)',
      'hsl(321,65%,65%)',
      'hsl(319,65%,65%)',
      'hsl(234,65%,65%)',
      'hsl(155,65%,65%)',
    ]);
  });
});

function getDistinctColors(db) {
  const colors = db.flatMap((entry) => entry.data).map((entry) => entry.color);
  return Array.from(new Set(colors));
}
