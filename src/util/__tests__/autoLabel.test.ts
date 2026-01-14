import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { autoLabel } from '../autoLabel.js';

test('autoLabel', () => {
  const molecule = Molecule.fromSmiles('CCCCC1CCCC(O)O1');
  autoLabel(molecule);
  const molfile = molecule.toMolfile({
    includeCustomAtomLabelsAsALines: false,
    includeCustomAtomLabelsAsVLines: true,
    removeCustomAtomLabels: true,
    customLabelPosition: 'normal',
  });
  const vLines = molfile.split('\n').filter((line) => line.startsWith('V '));

  expect(vLines).toStrictEqual([
    'V    4 6',
    'V    5 5',
    'V    6 4',
    'V    7 3',
    'V    8 2',
    'V    9 1',
  ]);
});
