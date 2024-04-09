import OCL from 'openchemlib';
import { test, expect } from 'vitest';

import { getNextNMRHint } from '../getNextNMRHint.js';

const { Molecule } = OCL;

test('getNextNMRHint', () => {
  const correct = Molecule.fromSmiles('c1ccccn1C(=O)OC');
  const answer = Molecule.fromSmiles('c1ccccc1OC(=O)');

  const providedHints = [];
  const hint = getNextNMRHint(correct, answer, providedHints);
  expect(hint).toStrictEqual({
    message: 'You should check the molecular formula.',
    hash: 7435243063749257,
    idCode: 'didD@@QIVUxV`@@@',
  });

  providedHints.push(hint);
  const hint2 = getNextNMRHint(correct, answer, providedHints);
  expect(hint2).toStrictEqual({
    idCode: 'didD@@QIVUxV`@@@',
    message: 'What about a non-aromatic ring?',
    hash: 4559403381457072,
  });

  providedHints.push(hint2);
  const hint3 = getNextNMRHint(correct, answer, providedHints);
  expect(hint3).toBeUndefined();
});
