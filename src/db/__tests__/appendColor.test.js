import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { MoleculesDB } from '../MoleculesDB';

describe('appendColor', () => {
  const sdf = readFileSync(join(__dirname, './data/data.sdf'));
  let moleculesDB = new MoleculesDB(OCL);
  moleculesDB.appendSDF(sdf);
  let db = moleculesDB.getDB();
  expect(db).toHaveLength(10);

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
  let colors = db
    .map((entry) => entry.data)
    .flat()
    .map((entry) => entry.color);
  return Array.from(new Set(colors));
}
