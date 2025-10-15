import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

test('just numbers', () => {
  const molecule = Molecule.fromSmiles('CCC(=O)CCCCC(=O)CC');
  const fragment = Molecule.fromSmiles('CCC(=O)');
  fragment.setAtomCustomLabel(0, 'β');
  fragment.setAtomCustomLabel(1, 'ɑ');
  fragment.setFragment(true);

  molecule.applyFragmentLabels(fragment);
  console.log(molecule.toMolfile());
});
