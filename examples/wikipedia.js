import OCL from 'openchemlib';

import { MoleculesDB } from '../src/index.js';

async function doAll() {
  const response = await fetch('https://wikipedia.cheminfo.org/data.json');
  const wikiJson = await response.json();
  const data = wikiJson.data.molecules;

  // We create a database

  const moleculesDB = new MoleculesDB(OCL);

  for (const entry of data) {
    const molecule = OCL.Molecule.fromIDCode(entry.actID.value, false);
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

  console.log('Number exact:', exact.length);
  console.log(exact[0]);

  const substructure = moleculesDB.search(napthaleneIDCode, {
    format: 'idCode',
    mode: 'substructure',
  });

  console.log('Number substructure:', substructure.length);
  console.log(substructure[0]);

  const similarity = moleculesDB.search(napthaleneIDCode, {
    format: 'idCode',
    mode: 'similarity',
  });

  console.log('Number similarity:', similarity.length);
  console.log(similarity[0]);
}

await doAll();

console.log('done');
