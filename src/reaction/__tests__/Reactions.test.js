import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { MF } from 'mf-parser';
import OCL, { Molecule } from 'openchemlib';
import { test } from 'vitest';

import { parseDwar } from '../../misc/dwar/parseDwar.js';
import { getMF } from '../../util/getMF.js';
import { Reactions } from '../Reactions.js';

// tree can be debug using https://my.cheminfo.org/?viewURL=https%3A%2F%2Fmyviews.cheminfo.org%2Fdb%2Fvisualizer%2Fentry%2Fbd04a6cedc05e54275bc62a29dd0a0cd%2Fview.json

test('Reactions', () => {
  const dwar = readFileSync(
    join(__dirname, './data/ReactionMassFragmentation.dwar'),
    'utf8',
  );
  const database = parseDwar(dwar).data;
  const ionizationsDatabase = database.filter(
    (entry) => entry.kind === 'ionization',
  );
  const fragmentationsDatabase = database.filter(
    (entry) => entry.kind !== 'ionization',
  );

  const xtc = Molecule.fromSmiles('CC(CC1(=CC2(=C(C=C1)OCO2)))NC');

  const reactions = new Reactions(OCL, {
    moleculeInfoCallback: (molecule) => {
      const mf = getMF(molecule).mf;
      const mfInfo = new MF(mf).getInfo();
      return {
        mf,
        mw: mfInfo.mass,
        em: mfInfo.monoisotopicMass,
        mz: mfInfo.observedMonoisotopicMass,
        charge: mfInfo.charge,
      };
    },
    maxDepth: 5,
    skipProcessed: true,
  });

  reactions.appendTree([xtc]);
  reactions.applyOneReactantReactions(ionizationsDatabase);
  reactions.applyOneReactantReactions(fragmentationsDatabase);

  const processedMolecules = Object.fromEntries(reactions.processedMolecules);
  console.log(Object.keys(processedMolecules).length);
  console.log(reactions.moleculeInfo);

  //  console.log(reactions.trees)

  // in order to debug the trees
  // https://www.cheminfo.org/?viewURL=https%3A%2F%2Fcouch.cheminfo.org%2Fcheminfo-public%2Fbd04a6cedc05e54275bc62a29dd0a0cd%2Fview.json&loadversion=true&fillsearch=Trees+debug+fragmentation
  writeFileSync('trees.json', JSON.stringify(reactions.trees, null, 2));
});
