import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import type { Preset } from '../presets.ts';
import {
  PRESETS,
  PRESETS_BY_TAB,
  PRESET_GROUPS,
  presetToMolfile,
} from '../presets.ts';

test('PRESET_GROUPS lists the five sections in display order', () => {
  expect(PRESET_GROUPS).toStrictEqual([
    'Diastereotopic basics',
    'Stereochemistry edge cases',
    'Size / performance',
    'autoLabel targets',
    'Molfiles from the test suite',
  ]);
});

test('PRESETS holds 35 entries', () => {
  expect(PRESETS).toHaveLength(35);
});

test('PRESETS_BY_TAB splits the presets between the two tabs', () => {
  expect(PRESETS_BY_TAB.diastereotopic).toHaveLength(25);
  expect(PRESETS_BY_TAB.autolabel).toHaveLength(10);

  for (const preset of PRESETS_BY_TAB.autolabel) {
    expect(preset.group).toBe('autoLabel targets');
  }
});

test('every preset belongs to a declared group', () => {
  const groups = new Set(PRESET_GROUPS);
  for (const preset of PRESETS) {
    expect(groups.has(preset.group)).toBe(true);
  }
});

test('each group holds the expected number of presets', () => {
  const counts = new Map<string, number>();
  for (const preset of PRESETS) {
    counts.set(preset.group, (counts.get(preset.group) ?? 0) + 1);
  }

  expect(Object.fromEntries(counts)).toStrictEqual({
    'Diastereotopic basics': 9,
    'Stereochemistry edge cases': 6,
    'Size / performance': 5,
    'autoLabel targets': 10,
    'Molfiles from the test suite': 5,
  });
});

test('preset ids are unique', () => {
  const ids = new Set<string>();
  for (const preset of PRESETS) {
    ids.add(preset.id);
  }

  expect(ids.size).toBe(35);
});

test('every preset carries exactly one of smiles or molfile', () => {
  for (const preset of PRESETS) {
    expect(preset.smiles === undefined).toBe(preset.molfile !== undefined);
  }
});

test('every preset SMILES parses to the expected atom count', () => {
  const atomCounts: Record<string, number> = {};
  for (const preset of PRESETS) {
    if (preset.smiles === undefined) continue;
    atomCounts[preset.id] = Molecule.fromSmiles(preset.smiles).getAllAtoms();
  }

  expect(atomCounts).toStrictEqual({
    ethanol: 3,
    'propan-1-ol': 4,
    '2-chlorobutane': 5,
    'r-2-chlorobutane': 5,
    glycerol: 6,
    'benzyl-alcohol': 8,
    methylcyclobutane: 5,
    '3-hydroxyglutaric-acid': 10,
    'citric-acid': 13,
    'alpha-d-glucopyranose': 12,
    'meso-tartaric-acid': 10,
    'pseudoasymmetric-pentanetriol': 8,
    fragment: 3,
    charged: 3,
    disconnected: 6,
    caffeine: 14,
    ibuprofen: 15,
    cholesterol: 28,
    paclitaxel: 59,
    'cyclopentane-20x': 100,
    '5alpha-cholestan-3beta-ol': 28,
    'beta-d-glucopyranose': 12,
    'beta-d-ribofuranose': 10,
    '2-deoxyadenosine': 18,
    quercetin: 22,
    'ursolic-acid': 33,
    methionine: 9,
    testosterone: 21,
    raffinose: 34,
    'ala-gly-met': 18,
  });
});

test('presetToMolfile resolves 2-chlorobutane to a V2000 molfile', () => {
  const preset = getPreset('2-chlorobutane');
  const molfile = presetToMolfile(preset);

  expect(molfile).toContain('V2000');

  const molecule = Molecule.fromMolfile(molfile);

  expect(molecule.getAllAtoms()).toBe(5);
  expect(molecule.getAllBonds()).toBe(4);
  expect(molecule.toIsomericSmiles()).toBe('CCC(C)Cl');
});

test('presetToMolfile caches the parsed SMILES', () => {
  const preset = getPreset('cholesterol');

  expect(presetToMolfile(preset)).toBe(presetToMolfile(preset));
});

test('presetToMolfile returns the shipped molfile untouched', () => {
  const preset = getPreset('cyclosporin');
  const molfile = presetToMolfile(preset);

  expect(molfile).toBe(preset.molfile);

  const molecule = Molecule.fromMolfile(molfile);

  expect(molecule.getAllAtoms()).toBe(196);
  expect(molecule.getAllBonds()).toBe(196);
});

test('every molfile preset parses to the expected atom count', () => {
  const atomCounts: Record<string, number> = {};
  for (const preset of PRESETS) {
    if (preset.molfile === undefined) continue;
    atomCounts[preset.id] = Molecule.fromMolfile(preset.molfile).getAllAtoms();
  }

  expect(atomCounts).toStrictEqual({
    cyclosporin: 196,
    'cyclosporin-no-h': 85,
    'ethanol-2h': 5,
    'ethyl-vinyl-ether': 7,
    'propyl-vinyl-ether': 8,
  });
});

test('presetToMolfile throws on a preset with no structure', () => {
  const preset: Preset = {
    id: 'empty',
    label: 'empty',
    group: 'none',
    tab: 'diastereotopic',
  };

  expect(() => presetToMolfile(preset)).toThrow(
    'preset empty has neither a molfile nor a SMILES',
  );
});

function getPreset(id: string): Preset {
  const preset = PRESETS.find((entry) => entry.id === id);
  if (preset === undefined) throw new Error(`unknown preset ${id}`);
  return preset;
}
