/* eslint-disable no-await-in-loop */
import { writeFileSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

import { Canonizer, Molecule } from 'openchemlib';

// we will create a database of molecule to number
// this database will be ordered by molecule size

async function createAutoLabelingJson() {
  const files = (
    await readdir(join(import.meta.dirname, 'templates'), {
      recursive: true,
    })
  ).filter((file) => file.endsWith('.mol'));
  const moleculeDatabase = [];

  for (const file of files) {
    const molfile = await readFile(
      join(import.meta.dirname, 'templates', file),
      'utf8',
    );
    const molecule = Molecule.fromMolfile(molfile);
    const mf = molecule.getMolecularFormula().formula;
    const mw = molecule.getMolecularFormula().relativeWeight;
    molecule.setFragment(true);

    const canonizer = new Canonizer(molecule, { encodeAtomCustomLabels: true });

    const idCode = canonizer.getIDCode();
    const coordinates = canonizer.getEncodedCoordinates(false);

    moleculeDatabase.push({
      idCode,
      coordinates,
      mf,
      mw,
      label: file.replace(/.*\//, '').replace('.mol', '').replaceAll('_', ' '),
    });
  }
  return moleculeDatabase;
}

const moleculeDatabase = await createAutoLabelingJson();
moleculeDatabase.sort((a, b) => b.mw - a.mw);

const target = join(import.meta.dirname, '../../src/util/autoLabelDatabase.ts');
writeFileSync(
  target,
  `export const autoLabelDatabase = ${JSON.stringify(moleculeDatabase, null, 2)};`,
);
