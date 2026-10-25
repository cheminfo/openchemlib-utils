/** A correct / proposed pair loaded into both editors at once. */
export interface PairPreset {
  /** stable identifier, used as a React key */
  id: string;
  label: string;
  group: string;
  /** SMILES of the expected structure */
  correct: string;
  /** SMILES of the structure a student could have proposed */
  proposed: string;
}

interface PairGroupData {
  group: string;
  /** `[id, label, correct SMILES, proposed SMILES]` */
  entries: Array<[string, string, string, string]>;
}

const PAIR_DATA: PairGroupData[] = [
  {
    group: 'From the test suite',
    entries: [
      ['identical', 'identical (ethane)', 'CC', 'CC'],
      ['stereo-only', 'stereo missing', 'C[C@H](Cl)CC', 'CC(Cl)CC'],
      ['wrong-mf', 'wrong formula', 'CC', 'C'],
      ['pyridine-benzene', 'pyridine vs benzene', 'c1ccncc1C', 'c1ccccc1N'],
      ['ester-carbamate', 'ester vs carbamate', 'CC(=O)OC', 'COC(=O)N'],
      ['ortho-para', 'ortho vs para', 'c1c(C)c(C)ccc1', 'c1c(C)ccc(C)c1'],
      ['dbe-too-low', 'DBE too low', 'C=C', 'CC'],
      ['para-meta', 'para vs meta', 'c1c(C)ccc(C)c1', 'c1c(C)cc(C)cc1'],
    ],
  },
  {
    group: 'Functional groups',
    entries: [
      ['alcohol-ether', 'alcohol vs ether', 'CCO', 'COC'],
      ['thiol-thioether', 'thiol vs thioether', 'CCS', 'CSC'],
      ['aldehyde-ketone', 'aldehyde vs ketone', 'CCCC=O', 'CC(=O)CC'],
      ['acid-formate', 'acid vs formate', 'CC(=O)O', 'COC=O'],
      ['ester-orientation', 'ester orientation', 'CC(=O)OCC', 'CCC(=O)OC'],
      ['primary-secondary-amine', 'primary vs secondary amine', 'CCN', 'CNC'],
      [
        'secondary-tertiary-amine',
        'secondary vs tertiary amine',
        'CCNC',
        'CN(C)C',
      ],
      ['primary-amide', 'primary amide vs formamide', 'CC(N)=O', 'CNC=O'],
      ['phenol-anisole', 'phenol vs anisole', 'Oc1ccccc1', 'COc1ccccc1'],
      ['aniline-picoline', 'aniline vs 2-picoline', 'Nc1ccccc1', 'Cc1ccccn1'],
    ],
  },
  {
    group: 'Rings and aromaticity',
    entries: [
      ['cyclohexane-hexene', 'cyclohexane vs hex-1-ene', 'C1CCCCC1', 'C=CCCCC'],
      ['thf-butanal', 'THF vs butanal', 'C1CCOC1', 'CCCC=O'],
      [
        'thiolane-diethylsulfide',
        'thiolane vs diethyl sulfide',
        'C1CCSC1',
        'CCSCC',
      ],
      ['lactone-ester', 'lactone vs ester', 'O=C1CCCCO1', 'CCCC(=O)OC'],
      ['pyrrole-benzene', 'pyrrole vs benzene', 'c1cc[nH]c1', 'c1ccccc1'],
      ['imidazole-pyrrole', 'imidazole vs pyrrole', 'c1cnc[nH]1', 'c1ccc[nH]1'],
      [
        'norbornane',
        'norbornane vs methylcyclohexane',
        'C1CC2CCC1C2',
        'CC1CCCCC1',
      ],
    ],
  },
  {
    group: 'Stereo and tautomers',
    entries: [
      ['enantiomer', 'enantiomer', 'C[C@H](Cl)CC', 'C[C@@H](Cl)CC'],
      [
        'pyridone',
        '2-pyridone vs 2-hydroxypyridine',
        'O=c1cccc[nH]1',
        'Oc1ccccn1',
      ],
    ],
  },
];

/** every pair, ordered by group then by the order declared in that group */
export const PAIR_PRESETS: PairPreset[] = PAIR_DATA.flatMap((data) =>
  data.entries.map(([id, label, correct, proposed]) => ({
    id,
    label,
    group: data.group,
    correct,
    proposed,
  })),
);
