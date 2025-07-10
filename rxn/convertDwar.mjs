// execute this file with `node rxn/convertDwar.mjs`
// but first you will have to `npm run prepack`

import { readFileSync, writeFileSync } from 'node:fs';

import { parseDwar } from '../lib/index.js';

const dwar = readFileSync(new URL('reactions.dwar', import.meta.url), 'utf8');
const reactions = parseDwar(dwar).data;

writeFileSync(
  new URL('../src/reaction/reactionsDatabase.js', import.meta.url),
  `export const reactionsDatabase=${JSON.stringify(reactions)}`,
  'utf8',
);

const dwarTest = readFileSync(
  new URL('reactions.test.dwar', import.meta.url),
  'utf8',
);
const reactionsTest = parseDwar(dwarTest).data;
writeFileSync(
  new URL('../src/reaction/__tests__/reactionsDatabase.js', import.meta.url),
  `export const reactionsDatabase=${JSON.stringify(reactionsTest)}`,
  'utf8',
);
