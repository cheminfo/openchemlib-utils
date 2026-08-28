import { Molecule } from 'openchemlib';

import cyclosporinMolfile from '../src/topic/__tests__/data/cyclosporin.mol?raw';
import cyclosporinNoHMolfile from '../src/topic/__tests__/data/cyclosporin_noH.mol?raw';
import ethanol2HMolfile from '../src/topic/__tests__/data/ethanol_2H.mol?raw';
import ethylVinylEtherMolfile from '../src/topic/__tests__/data/ethylvinylether.mol?raw';
import propylVinylEtherMolfile from '../src/topic/__tests__/data/propylvinylether.mol?raw';

import type { RouteId } from './useHashRoute.ts';

export interface Preset {
  /** stable identifier, used as a React key and as the molfile cache key */
  id: string;
  /** name shown in the preset menu */
  label: string;
  /** one of `PRESET_GROUPS` */
  group: string;
  /** tab the preset is offered on; a structure only makes sense for one of them */
  tab: RouteId;
  /** set on every preset that is defined by a SMILES */
  smiles?: string;
  /** set on every preset that ships a V2000 molfile from the test suite */
  molfile?: string;
}

/**
 * Resolves a preset to a V2000 molfile, parsing its SMILES on first use.
 * @param preset - the preset to resolve
 * @returns the V2000 molfile of the preset
 */
export function presetToMolfile(preset: Preset): string {
  if (preset.molfile !== undefined) return preset.molfile;
  const cached = molfileCache.get(preset.id);
  if (cached !== undefined) return cached;
  if (preset.smiles === undefined) {
    throw new Error(`preset ${preset.id} has neither a molfile nor a SMILES`);
  }
  const molfile = Molecule.fromSmiles(preset.smiles).toMolfile();
  molfileCache.set(preset.id, molfile);
  return molfile;
}

const molfileCache = new Map<string, string>();

interface PresetGroupData {
  group: string;
  tab: RouteId;
  format: 'smiles' | 'molfile';
  /** `[id, label, SMILES or molfile]` triples */
  entries: Array<[string, string, string]>;
}

const PRESET_DATA: PresetGroupData[] = [
  {
    group: 'Diastereotopic basics',
    tab: 'diastereotopic',
    format: 'smiles',
    entries: [
      ['ethanol', 'ethanol', 'CCO'],
      ['propan-1-ol', 'propan-1-ol', 'CCCO'],
      ['2-chlorobutane', '2-chlorobutane', 'CC(Cl)CC'],
      ['r-2-chlorobutane', '(R)-2-chlorobutane', 'C[C@H](Cl)CC'],
      ['glycerol', 'glycerol', 'OCC(O)CO'],
      ['benzyl-alcohol', 'benzyl alcohol', 'OCc1ccccc1'],
      ['methylcyclobutane', 'methylcyclobutane', 'CC1CCC1'],
      [
        '3-hydroxyglutaric-acid',
        '3-hydroxyglutaric acid',
        'OC(=O)CC(O)CC(=O)O',
      ],
      ['citric-acid', 'citric acid', 'OC(=O)CC(O)(CC(=O)O)C(=O)O'],
    ],
  },
  {
    group: 'Stereochemistry edge cases',
    tab: 'diastereotopic',
    format: 'smiles',
    entries: [
      [
        'alpha-d-glucopyranose',
        'α-D-glucopyranose',
        'OC[C@H]1O[C@H](O)[C@H](O)[C@@H](O)[C@@H]1O',
      ],
      [
        'meso-tartaric-acid',
        'meso-tartaric acid',
        'O[C@H](C(=O)O)[C@@H](O)C(=O)O',
      ],
      [
        'pseudoasymmetric-pentanetriol',
        'pseudoasymmetric pentane-2,3,4-triol',
        'C[C@H](O)[C@H](O)[C@@H](O)C',
      ],
      ['fragment', 'fragment', 'CC[*]'],
      ['charged', 'charged', 'CC[NH3+]'],
      ['disconnected', 'disconnected', 'CCO.CCO'],
    ],
  },
  {
    group: 'Size / performance',
    tab: 'diastereotopic',
    format: 'smiles',
    entries: [
      ['caffeine', 'caffeine', 'Cn1cnc2c1c(=O)n(C)c(=O)n2C'],
      ['ibuprofen', 'ibuprofen', 'CC(C)Cc1ccc(cc1)C(C)C(=O)O'],
      [
        'cholesterol',
        'cholesterol',
        'CC(C)CCC[C@@H](C)[C@H]1CC[C@H]2[C@@H]3CC=C4C[C@@H](O)CC[C@]4(C)[C@H]3CC[C@]12C',
      ],
      [
        'paclitaxel',
        'paclitaxel',
        'CC1=C2[C@H](C(=O)[C@@]3(C)[C@@H](O)C[C@H]4OC[C@]4(OC(C)=O)[C@H]3[C@H](OC(=O)c3ccccc3)[C@]2(C)C[C@@H]1OC(=O)[C@H](O)[C@@H](NC(=O)c1ccccc1)c1ccccc1)OC(C)=O',
      ],
      [
        'cyclopentane-20x',
        '20× cyclopentane (over maxNbAtoms)',
        'C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1.C1CCCC1',
      ],
    ],
  },
  {
    group: 'autoLabel targets',
    tab: 'autolabel',
    format: 'smiles',
    entries: [
      [
        '5alpha-cholestan-3beta-ol',
        '5α-cholestan-3β-ol',
        'CC(C)CCC[C@@H](C)[C@H]1CC[C@H]2[C@@H]3CC[C@H]4C[C@@H](O)CC[C@]4(C)[C@H]3CC[C@]12C',
      ],
      [
        'beta-d-glucopyranose',
        'β-D-glucopyranose',
        'OC[C@H]1O[C@@H](O)[C@H](O)[C@@H](O)[C@@H]1O',
      ],
      [
        'beta-d-ribofuranose',
        'β-D-ribofuranose',
        'OC[C@H]1O[C@@H](O)[C@H](O)[C@@H]1O',
      ],
      [
        '2-deoxyadenosine',
        '2′-deoxyadenosine',
        'OC[C@H]1O[C@H](C[C@@H]1O)n1cnc2c(N)ncnc12',
      ],
      ['quercetin', 'quercetin', 'Oc1cc(O)c2c(c1)oc(-c1ccc(O)c(O)c1)c(O)c2=O'],
      [
        'ursolic-acid',
        'ursolic acid',
        'C[C@@H]1CC[C@@]2(CC[C@]3(C)C(=CC[C@@H]4[C@@]5(C)CC[C@H](O)C(C)(C)[C@@H]5CC[C@@]34C)[C@@H]2[C@H]1C)C(=O)O',
      ],
      ['methionine', 'methionine', 'CSCC[C@H](N)C(=O)O'],
      [
        'testosterone',
        'testosterone',
        'C[C@]12CC[C@H]3[C@@H](CCC4=CC(=O)CC[C@]34C)[C@@H]1CC[C@@H]2O',
      ],
      [
        'raffinose',
        'raffinose (glycan: 2 pyranose + 1 furanose)',
        'OC[C@H]1O[C@H](OC[C@H]2O[C@H](O[C@]3(CO)O[C@H](CO)[C@@H](O)[C@@H]3O)[C@H](O)[C@@H](O)[C@@H]2O)[C@H](O)[C@@H](O)[C@H]1O',
      ],
      [
        'ala-gly-met',
        'Ala-Gly-Met tripeptide',
        'C[C@H](N)C(=O)NCC(=O)N[C@@H](CCSC)C(=O)O',
      ],
    ],
  },
  {
    group: 'Molfiles from the test suite',
    tab: 'diastereotopic',
    format: 'molfile',
    entries: [
      ['cyclosporin', 'cyclosporin', cyclosporinMolfile],
      ['cyclosporin-no-h', 'cyclosporin (no H)', cyclosporinNoHMolfile],
      ['ethanol-2h', 'ethanol with 2 explicit H', ethanol2HMolfile],
      ['ethyl-vinyl-ether', 'ethyl vinyl ether', ethylVinylEtherMolfile],
      ['propyl-vinyl-ether', 'propyl vinyl ether', propylVinylEtherMolfile],
    ],
  },
];

/** the preset menu sections, in display order */
export const PRESET_GROUPS: string[] = PRESET_DATA.map((data) => data.group);

/** every preset, ordered by group then by the order declared in that group */
export const PRESETS: Preset[] = buildPresets();

/** the presets of each tab, in display order */
export const PRESETS_BY_TAB: Record<RouteId, Preset[]> = {
  diastereotopic: PRESETS.filter((preset) => preset.tab === 'diastereotopic'),
  autolabel: PRESETS.filter((preset) => preset.tab === 'autolabel'),
};

function buildPresets(): Preset[] {
  const presets: Preset[] = [];
  for (const data of PRESET_DATA) {
    for (const [id, label, content] of data.entries) {
      const base = { id, label, group: data.group, tab: data.tab };
      presets.push(
        data.format === 'smiles'
          ? { ...base, smiles: content }
          : { ...base, molfile: content },
      );
    }
  }
  return presets;
}
