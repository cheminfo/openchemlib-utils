import { readFileSync } from 'fs';
import { join } from 'path';

import OCL, { SSSearcher } from 'openchemlib';
import { expect, test } from 'vitest';

import { MoleculesDB } from '../MoleculesDB';

test('water', async () => {
  const moleculesDB = new MoleculesDB(OCL);
  await moleculesDB.appendCSV('smiles\nO');

  expect(moleculesDB.search('O', { format: 'smiles' })).toHaveLength(1);
  expect(moleculesDB.search('[OH2]', { format: 'smiles' })).toHaveLength(1);
  expect(moleculesDB.search('S', { format: 'smiles' })).toHaveLength(0);
  expect(
    moleculesDB.search('O', { format: 'smiles', mode: 'exact' }),
  ).toHaveLength(1);
  expect(
    moleculesDB.search('[OH2]', { format: 'smiles', mode: 'exact' }),
  ).toHaveLength(1);
  expect(
    moleculesDB.search('S', { format: 'smiles', mode: 'exact' }),
  ).toHaveLength(0);
});

test('water from scratch', async () => {
  const molecule = OCL.Molecule.fromSmiles('CCO');
  const fragment = OCL.Molecule.fromSmiles('CCO');
  fragment.setFragment(true);

  const ssSearcher = new SSSearcher();
  ssSearcher.setMolecule(molecule);
  ssSearcher.setFragment(fragment);
  expect(ssSearcher.isFragmentInMolecule()).toBe(true);

  // If fragment is false it will find nothing EVEN if it is the same molecule !!!!
  fragment.setFragment(false);
  ssSearcher.setFragment(fragment);
  expect(ssSearcher.isFragmentInMolecule()).toBe(false);
});

test('water from database', async () => {
  const json = JSON.parse(
    readFileSync(join(__dirname, './data/wikipedia.json'), 'utf8'),
  );
  const moleculesDB = new MoleculesDB(OCL);
  moleculesDB.appendEntries(json.data.molecules, {
    idCodePath: 'idCode',
    indexPath: 'ssIndex',
  });
  expect(Object.keys(moleculesDB.db)).toHaveLength(1);
  expect(moleculesDB.search('O', { format: 'smiles' })).toHaveLength(1);
  expect(moleculesDB.search('[OH2]', { format: 'smiles' })).toHaveLength(1);
  expect(moleculesDB.search('S', { format: 'smiles' })).toHaveLength(0);
  expect(
    moleculesDB.search('O', { format: 'smiles', mode: 'exact' }),
  ).toHaveLength(1);
  expect(
    moleculesDB.search('[OH2]', { format: 'smiles', mode: 'exact' }),
  ).toHaveLength(1);
  expect(
    moleculesDB.search('S', { format: 'smiles', mode: 'exact' }),
  ).toHaveLength(0);
});
