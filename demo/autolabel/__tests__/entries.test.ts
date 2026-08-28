import { expect, test } from 'vitest';

import {
  AUTO_LABEL_ENTRIES,
  AUTO_LABEL_ENTRY_ERRORS,
  AUTO_LABEL_FAMILIES,
  MW_RANGE,
  getEntryDisplayMolecule,
  normalizeLabel,
} from '../entries.ts';
import { ENTRY_FAMILIES } from '../families.ts';

test('the whole database decodes', () => {
  expect(AUTO_LABEL_ENTRY_ERRORS).toStrictEqual([]);
  expect(AUTO_LABEL_ENTRIES).toHaveLength(65);

  for (let i = 0; i < AUTO_LABEL_ENTRIES.length; i++) {
    expect(AUTO_LABEL_ENTRIES[i].index).toBe(i);
  }
});

test('MW_RANGE spans the shipped database exactly', () => {
  expect(MW_RANGE).toStrictEqual({ min: 88.10552, max: 536.88464 });
});

test('24 entries carry atom query features', () => {
  const withQueryFeatures = AUTO_LABEL_ENTRIES.filter(
    (entry) => entry.hasQueryFeatures,
  );

  expect(withQueryFeatures).toHaveLength(24);
  expect(withQueryFeatures[0].label).toBe('Cucurbitane');
  expect(withQueryFeatures.at(-1)?.label).toBe('Gonane');
});

test('every entry has a label and a known family', () => {
  expect(AUTO_LABEL_FAMILIES).toStrictEqual([
    'Core',
    'Flavonoids',
    'Other',
    'Pentacyclic triterpenoids',
    'Phenylpropanoids',
    'Polyketides',
    'Sapogenin',
    'Steroids',
    'Tetracyclic triterpenoids',
    'Tetraterpenes',
  ]);

  const families = new Set(AUTO_LABEL_FAMILIES);
  for (const entry of AUTO_LABEL_ENTRIES) {
    expect(entry.label.length).toBeGreaterThan(0);
    expect(families.has(entry.family)).toBe(true);
    expect(entry.family).toBe(ENTRY_FAMILIES[entry.label]);
  }
});

test('entry 19 is cholesterol, fully labelled and coordinate-bearing', () => {
  const entry = AUTO_LABEL_ENTRIES[19];

  expect(entry.label).toBe('cholesterol');
  expect(entry.family).toBe('Core');
  expect(entry.mf).toBe('C27H48');
  expect(entry.atomCount).toBe(27);
  expect(entry.labelledAtomCount).toBe(27);
  expect(entry.hasQueryFeatures).toBe(false);
  expect(entry.ringCount).toBe(4);
  expect(entry.rawLabels[0]).toBe('10');
  expect(entry.searchText.startsWith('cholesterol c27h48 ')).toBe(true);
});

test('normalizeLabel strips the superscript marker and both primes', () => {
  expect(normalizeLabel(']10')).toBe('10');
  expect(normalizeLabel(']1′')).toBe("1'");
  expect(normalizeLabel(']2″')).toBe("2''");
  expect(normalizeLabel("1'")).toBe("1'");
  expect(normalizeLabel(']4α')).toBe('4α');
});

test('the four Lycopene labels with a stray leading space normalise', () => {
  const lycopene = AUTO_LABEL_ENTRIES[0];

  expect(lycopene.label).toBe('Lycopene');

  const spaced = lycopene.rawLabels.filter((raw) => raw?.includes(' '));

  expect(spaced).toStrictEqual(['] 4′', '] 3′', '] 2′', '] 1′']);
  expect(spaced.map((raw) => normalizeLabel(raw as string))).toStrictEqual([
    "4'",
    "3'",
    "2'",
    "1'",
  ]);
  expect(lycopene.searchText).not.toContain(']');

  for (const label of lycopene.normalizedLabels) {
    expect(label).toBe(label.trim());
  }
});

test('Stilbene keeps its double prime distinguishable', () => {
  const stilbene = AUTO_LABEL_ENTRIES.find(
    (entry) => entry.label === 'Stilbene',
  );

  expect(stilbene?.normalizedLabels).toStrictEqual([
    "1'",
    "6'",
    "2'",
    "2''",
    "5'",
    "3'",
    "1''",
    "4'",
    '1',
    '6',
    '2',
    '5',
    '3',
    '4',
  ]);
});

test('getEntryDisplayMolecule caches and never mutates the target', () => {
  const entry = AUTO_LABEL_ENTRIES[29];

  expect(entry.label).toBe('Flavone');
  expect(getEntryDisplayMolecule(entry, 'stored')).toBe(entry.target);

  const normalised = getEntryDisplayMolecule(entry, 'normalised');

  expect(getEntryDisplayMolecule(entry, 'normalised')).toBe(normalised);
  expect(normalised).not.toBe(entry.target);

  const hidden = getEntryDisplayMolecule(entry, 'hidden');
  const first = [1, 2, 3, 4, 5];

  expect(
    first.map((atom) => normalised.getAtomCustomLabel(atom)),
  ).toStrictEqual(['4', '4α', '3', '8α', '5']);
  expect(first.map((atom) => hidden.getAtomCustomLabel(atom))).toStrictEqual([
    null,
    null,
    null,
    null,
    null,
  ]);
  expect(
    first.map((atom) => entry.target.getAtomCustomLabel(atom)),
  ).toStrictEqual([']4', ']4α', ']3', ']8α', ']5']);
  expect(normalised.getAtomX(4)).toBe(entry.target.getAtomX(4));
});
