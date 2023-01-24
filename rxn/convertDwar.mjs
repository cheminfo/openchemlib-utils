// execute this file with `node rxn/convertDwar.mjs`

import { writeFileSync, readFileSync } from 'fs';

const dwar = readFileSync(new URL('reactions.dwar', import.meta.url), 'utf8');
const reactions = convertDwar(dwar);

writeFileSync(
  new URL('../src/reaction/reactionsDatabase.js', import.meta.url),
  `export const reactionsDatabase=${JSON.stringify(reactions)}`,
  'utf8',
);

const dwarTest = readFileSync(
  new URL('reactions.test.dwar', import.meta.url),
  'utf8',
);
const reactionsTest = convertDwar(dwarTest);
writeFileSync(
  new URL('../src/reaction/__tests__/reactionsDatabase.js', import.meta.url),
  `export const reactionsDatabase=${JSON.stringify(reactionsTest)}`,
  'utf8',
);

function convertDwar(dwar) {
  let lines = dwar
    .split(/\r?\n/)
    .filter((line) => !line.match(/^<.*>$/))
    .filter((line) => !line.match(/^[\t ]*$/));
  const reactions = [];
  const headers = lines.shift().split('\t');
  if (headers.filter((header) => header === 'rxnCode').length === 0) {
    throw new Error('Missing column named rxnCode');
  }

  for (let line of lines) {
    const fields = line.split('\t');
    const reaction = {};
    reaction.rxnCode = `${fields[headers.indexOf('rxnCode')]}#${
      fields[headers.indexOf('atomMapping')]
    }#${fields[headers.indexOf('idcoordinates2D')]}`;
    headers.forEach((header, index) => {
      if (header.match(/^[a-z]/)) return;
      reaction[header] = fields[index];
    });
    reactions.push(reaction);
  }
  return reactions;
}
