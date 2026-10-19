export interface Example {
  label: string;
  value: string;
}

/**
 * A peptide built elsewhere — by `sequence-to-molecule` from a
 * `chemical-groups` abbreviation, by a drawing tool, by a database — reaches
 * the playground as an idcode, a SMILES or a molfile.
 */
export const EXAMPLES: Example[] = [
  {
    label: 'cyclosporin A (cyclic, SMILES)',
    value:
      'CC[C@H]1C(=O)N(CC(=O)N([C@H](C(=O)N[C@H](C(=O)N([C@H](C(=O)N[C@H](C(=O)N[C@@H](C(=O)N([C@H](C(=O)N([C@H](C(=O)N([C@H](C(=O)N([C@H](C(=O)N1)[C@@H]([C@H](C)C/C=C/C)O)C)C(C)C)C)CC(C)C)C)CC(C)C)C)C)C)CC(C)C)C)C(C)C)CC(C)C)C)C',
  },
  {
    label: 'MeAlaGlyProPh (idcode)',
    value: 'fncq`@FAJAr\\bbbbRbVcRfbe[Qf`hJajZhdXfX@',
  },
  { label: 'H-Ala-Gly-OH (idcode)', value: 'deeL@DhAgHheDXuUMFP@' },
  {
    label: 'H-Ala-Gly-Pro-OH (idcode)',
    value: 'fhqpP@BZ|ADkYEMEDiTiipSUUMSUHqGP@',
  },
  {
    label: 'H-Ala-Cys-Glu-OH (SMILES)',
    value: 'C[C@@H](N)C(=O)N[C@@H](CS)C(=O)N[C@@H](CCC(=O)O)C(=O)O',
  },
  {
    label: 'H-Trp-His-Phe-OH (SMILES)',
    value:
      'N[C@@H](Cc1c[nH]c2ccccc12)C(=O)N[C@@H](Cc1cnc[nH]1)C(=O)N[C@@H](Cc1ccccc1)C(=O)O',
  },
  { label: 'Ac-Ala-NHMe (capped)', value: 'CC(=O)N[C@@H](C)C(=O)NC' },
  { label: 'ethanol (not a peptide)', value: 'CCO' },
];
