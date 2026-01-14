/* eslint-disable no-await-in-loop */
import { writeFileSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { Canonizer, Molecule } from 'openchemlib';

// we will create a database of molecule to number
// this database will be ordered by molecule size

async function createAutoLabelingJson() {
  const files = await readdir(join(import.meta.dirname, 'templates'));
  const moleculeDatabase = [];

  for (const file of files) {
    if (!file.endsWith('.mol')) continue;
    const molfile = await readFile(
      join(import.meta.dirname, 'templates', file),
      'utf8',
    );
    const molecule = Molecule.fromMolfile(molfile);
    molecule.setFragment(true);

    const canonizer = new Canonizer(molecule, { encodeAtomCustomLabels: true });

    const idCode = canonizer.getIDCode();

    moleculeDatabase.push({
      idCode,
      mf: molecule.getMolecularFormula().formula,
      mw: molecule.getMolecularFormula().relativeWeight,
    });
  }
  return moleculeDatabase;
}

const moleculeDatabase = await createAutoLabelingJson();
moleculeDatabase.sort((a, b) => b.mw - a.mw);

const target = join(import.meta.dirname, '../../src/util/autoLabelDatabase.js');
writeFileSync(
  target,
  `export const autoLabelDatabase = ${JSON.stringify(moleculeDatabase, null, 2)};`,
);
