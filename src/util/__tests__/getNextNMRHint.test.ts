import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import type { NMRHint } from '../getNMRHints.js';
import { getNextNMRHint } from '../getNextNMRHint.ts';

test('getNextNMRHint', () => {
  const correct = Molecule.fromSmiles('c1ccncc1C(=O)OCC');
  const answer = Molecule.fromSmiles('c1ccccc1NC(=O)CO');

  const providedHints: NMRHint[] = [];
  const hint = getNextNMRHint(correct, answer, providedHints);

  expect(hint).toStrictEqual({
    hash: 8501907645562099,
    idCode: 'dmvD@DBdfUmYUj`@@@',
    message: 'An aromatic cycle can be an heterocycle.',
  });

  providedHints.push(hint as NMRHint);
  const hint2 = getNextNMRHint(correct, answer, providedHints);

  expect(hint2).toStrictEqual({
    hash: 7320388637202908,
    idCode: 'dmvD@DBdfUmYUj`@@@',
    message: 'Did you think about pyridine derivatives?',
  });

  providedHints.push(hint2 as NMRHint);

  const hint3 = getNextNMRHint(correct, answer, providedHints);

  expect(hint3).toStrictEqual({
    hash: 5639041189348174,
    idCode: 'dmvD@DBdfUmYUj`@@@',
    message: 'What about an ester?',
  });

  providedHints.push(hint3 as NMRHint);

  const hint4 = getNextNMRHint(correct, answer, providedHints);

  expect(hint4).toStrictEqual({
    message: 'The proposed molecule is too symmetric.',
    idCode: 'dmvD@DBdfUmYUj`@@@',
    hash: 8088209302184228,
  });

  providedHints.push(hint4 as NMRHint);

  const hint5 = getNextNMRHint(correct, answer, providedHints);

  expect(hint5).toBeUndefined();
});
