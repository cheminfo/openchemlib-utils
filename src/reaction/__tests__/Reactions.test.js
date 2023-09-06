import { readFileSync } from 'fs';
import { join } from 'path';

import { MF } from 'mf-parser';
import { Molecule } from 'openchemlib';

import { parseDwar } from '../../misc/dwar/parseDwar.js';
import { getMF } from '../../util/getMF.js';
import { Reactions } from '../Reactions.js';

test('Reactions', () => {
  const dwar = readFileSync(
    join(__dirname, './data/ReactionMassFragmentation.dwar'),
    'utf8',
  );
  const database = parseDwar(dwar).data;

  console.log(database)
  const ionizations = database.filter((entry) => entry.Label === 'Ionization');
  const fragmentations = database.filter((entry) => entry.Label !== 'Ionization');

  const xtc = Molecule.fromSmiles('CC(CC1(=CC2(=C(C=C1)OCO2)))NC');

  const reactions = new Reactions({
    moleculeExtraInfo: (entry, molecule) => {
      const mf = getMF(molecule).mf;
      const mfInfo = new MF(mf).getInfo();
      entry.mf = mf;
      entry.mw = mfInfo.mass;
      entry.em = mfInfo.monoisotopicMass;
      entry.mz = mfInfo.observedMonoisotopicMass;
      entry.charge = mfInfo.charge;
    },
    maxDepth: 5,
    skipProcessed: true,
  });

  reactions.appendOneReactionReactants([xtc]);

  reactions.applyReactions(ionizations, { min: 1, max: 2, flattenProducts: true });

  reactions.applyReactions(fragmentations, { min: 1, max: 3, flattenProducts: true });

  reactions.filterTree((entry) => {
    console.log(reactions);
  });
});
