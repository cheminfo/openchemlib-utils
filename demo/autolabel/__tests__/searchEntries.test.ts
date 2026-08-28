import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { AUTO_LABEL_ENTRIES } from '../entries.ts';
import type { AutoLabelSortColumn } from '../searchEntries.ts';
import {
  DEFAULT_SEARCH_STATE,
  findEntriesContainingQuery,
  findEntriesMatchingMolecule,
  nextSort,
  searchEntries,
} from '../searchEntries.ts';

const CHOLESTANOL =
  'CC(C)CCC[C@@H](C)[C@H]1CC[C@H]2[C@@H]3CC[C@H]4C[C@@H](O)CC[C@]4(C)[C@H]3CC[C@]12C';
const QUERCETIN = 'Oc1cc(O)c2c(c1)oc(-c1ccc(O)c(O)c1)c(O)c2=O';

function labelsOf(entries: typeof AUTO_LABEL_ENTRIES): string[] {
  return entries.map((entry) => entry.label);
}

function sorted(column: AutoLabelSortColumn, descending = false) {
  return searchEntries(
    AUTO_LABEL_ENTRIES,
    { ...DEFAULT_SEARCH_STATE, sort: { column, descending } },
    null,
  );
}

test('the default state keeps every entry in priority order', () => {
  const found = searchEntries(AUTO_LABEL_ENTRIES, DEFAULT_SEARCH_STATE, null);

  expect(found).toHaveLength(65);
  expect(found[0].label).toBe('Lycopene');
  expect(found.at(-1)?.label).toBe('furanose core');
});

test('a text query matches label, formula and normalised locants', () => {
  const found = searchEntries(
    AUTO_LABEL_ENTRIES,
    { ...DEFAULT_SEARCH_STATE, text: 'flav' },
    null,
  );

  expect(labelsOf(found)).toStrictEqual([
    'Flavan-3,4-diol',
    'Dihydroflavonol',
    'Flavonol',
    'Flavan-3-ol',
    'Flavanone',
    'Flavone',
    'Isoflavanone',
    'Isoflavone',
  ]);
  expect(
    searchEntries(
      AUTO_LABEL_ENTRIES,
      { ...DEFAULT_SEARCH_STATE, text: 'C40H56' },
      null,
    ).map((entry) => entry.label),
  ).toStrictEqual(['Lycopene', 'beta-carotene']);
});

test('the query-feature facet splits the database 24 / 41', () => {
  const withFeatures = searchEntries(
    AUTO_LABEL_ENTRIES,
    { ...DEFAULT_SEARCH_STATE, queryFeatures: 'with' },
    null,
  );
  const withoutFeatures = searchEntries(
    AUTO_LABEL_ENTRIES,
    { ...DEFAULT_SEARCH_STATE, queryFeatures: 'without' },
    null,
  );

  expect(withFeatures).toHaveLength(24);
  expect(withoutFeatures).toHaveLength(41);
});

test('a family keeps only that family', () => {
  const found = searchEntries(
    AUTO_LABEL_ENTRIES,
    { ...DEFAULT_SEARCH_STATE, family: 'Core' },
    null,
  );

  expect(labelsOf(found)).toStrictEqual([
    'cholesterol',
    'deoxyguanosine',
    'steroid',
    'deoxyadenosine',
    'deoxythymidine',
    'steroid core',
    'deoxyuridine',
    'deoxycytidine',
    'methionine',
    'pyranose',
    'furanose',
    'pyranose core',
    'furanose core',
  ]);
});

test('a null family keeps every entry', () => {
  expect(
    searchEntries(
      AUTO_LABEL_ENTRIES,
      { ...DEFAULT_SEARCH_STATE, family: null },
      null,
    ),
  ).toHaveLength(AUTO_LABEL_ENTRIES.length);
});

test('direction A finds the entries that would label a molecule', () => {
  const hits = findEntriesMatchingMolecule(Molecule.fromSmiles(CHOLESTANOL));

  expect([...hits]).toStrictEqual([19, 20, 21, 23, 34, 35, 46]);

  const quercetin = findEntriesMatchingMolecule(Molecule.fromSmiles(QUERCETIN));

  expect(
    [...quercetin].map((index) => AUTO_LABEL_ENTRIES[index].label),
  ).toStrictEqual(['Flavonol', 'Flavone', 'Chalcone']);
  expect(findEntriesMatchingMolecule(Molecule.fromMolfile('')).size).toBe(0);
});

test('direction B finds the entries that contain a sketch', () => {
  expect(findEntriesContainingQuery(Molecule.fromSmiles('c1ccccc1')).size).toBe(
    28,
  );
  expect(findEntriesContainingQuery(Molecule.fromSmiles('C1CCCCC1')).size).toBe(
    25,
  );

  const pyran = findEntriesContainingQuery(Molecule.fromSmiles('C1CCCCO1'));

  expect(
    [...pyran].map((index) => AUTO_LABEL_ENTRIES[index].label),
  ).toStrictEqual(['Spirostane', 'pyranose', 'pyranose core']);
  expect(findEntriesContainingQuery(Molecule.fromMolfile('')).size).toBe(0);
});

test('direction B does not modify the sketch it is given', () => {
  const sketch = Molecule.fromSmiles('C1CCCCO1');
  findEntriesContainingQuery(sketch);

  expect(sketch.isFragment()).toBe(false);
});

test('the structure filter only applies when it is switched on', () => {
  const hits = findEntriesContainingQuery(Molecule.fromSmiles('C1CCCCO1'));

  expect(
    searchEntries(AUTO_LABEL_ENTRIES, DEFAULT_SEARCH_STATE, hits),
  ).toHaveLength(65);
  expect(
    labelsOf(
      searchEntries(
        AUTO_LABEL_ENTRIES,
        { ...DEFAULT_SEARCH_STATE, structureFilter: true },
        hits,
      ),
    ),
  ).toStrictEqual(['Spirostane', 'pyranose', 'pyranose core']);
  expect(
    labelsOf(
      searchEntries(
        AUTO_LABEL_ENTRIES,
        { ...DEFAULT_SEARCH_STATE, structureFilter: true, text: 'pyran' },
        hits,
      ),
    ),
  ).toStrictEqual(['pyranose', 'pyranose core']);
});

test('every column sorts both ways', () => {
  expect(sorted('index')[0].label).toBe('Lycopene');
  expect(sorted('index', true)[0].label).toBe('furanose core');
  expect(sorted('mw')[0].label).toBe('furanose core');
  expect(sorted('mw', true)[0].label).toBe('Lycopene');
  expect(sorted('label')[0].label).toBe('2H-Chromene');
  expect(sorted('label', true)[0].label).toBe('Xanthone');
  expect(sorted('atomCount', true)[0].label).toBe('Lycopene');
  expect(
    sorted('labelledAtomCount')
      .slice(0, 3)
      .map((entry) => entry.label),
  ).toStrictEqual(['furanose core', 'methionine', 'furanose']);
});

test('a header cycles through ascending, descending and the database order', () => {
  const ascending = nextSort(null, 'mw');
  const descending = nextSort(ascending, 'mw');

  expect(ascending).toStrictEqual({ column: 'mw', descending: false });
  expect(descending).toStrictEqual({ column: 'mw', descending: true });
  expect(nextSort(descending, 'mw')).toBeNull();
  expect(nextSort(descending, 'label')).toStrictEqual({
    column: 'label',
    descending: false,
  });
  expect(
    searchEntries(
      AUTO_LABEL_ENTRIES,
      { ...DEFAULT_SEARCH_STATE, sort: nextSort(descending, 'mw') },
      null,
    ).map((entry) => entry.label),
  ).toStrictEqual(sorted('index').map((entry) => entry.label));
});

test('the index breaks every tie, so a sort is stable in both directions', () => {
  const ascending = sorted('atomCount');
  const descending = sorted('atomCount', true);

  expect(ascending.map((entry) => entry.index)).toStrictEqual(
    ascending
      .toSorted((a, b) => a.atomCount - b.atomCount || a.index - b.index)
      .map((entry) => entry.index),
  );
  expect(descending[0].atomCount).toBe(40);
  expect(descending[0].index).toBe(0);
});
