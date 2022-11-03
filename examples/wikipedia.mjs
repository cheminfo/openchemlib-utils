import OCL from 'openchemlib/minimal.js';

import OCLUtils from '../lib/index.js';

const { MoleculesDB } = OCLUtils;

const response = await fetch(
  'https://wikipedia.cheminfo.org/src/json/data.json',
);
const data = (await response.json()).data.molecules.slice(0, 1000);

// We create a database

const moleculesDB = new MoleculesDB(OCL);

for (const entry of data) {
  const molecule = OCL.Molecule.fromIDCode(entry.actID.value);
  moleculesDB.pushEntry(
    molecule,
    {
      id: entry.id,
      code: entry.code,
      smiles: entry.smiles,
      mf: entry.mf.value,
      em: entry.em,
    },
    { index: entry.act_idx, idCode: entry.actID.value, mw: entry.mw },
  );
}

// Test an exact search
//const benzeneIDCode = 'gFp@DiTt@@@';
const napthaleneIDCode = 'det@@DjYUX^d@@@@@';

const exact = moleculesDB.search(napthaleneIDCode, {
  format: 'idCode',
  mode: 'exact',
});

console.log('Number exact: ', exact.length);
console.log(exact[0]);

const substructure = moleculesDB.search(napthaleneIDCode, {
  format: 'idCode',
  mode: 'substructure',
});

console.log('Number substructure: ', substructure.length);
console.log(substructure[0]);

const similarity = moleculesDB.search(napthaleneIDCode, {
  format: 'idCode',
  mode: 'similarity',
});

console.log('Number similarity: ', similarity.length);
console.log(similarity[0]);
