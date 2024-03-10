import OCL from 'openchemlib';
import { test, expect } from 'vitest';

import { getNextHint } from '../getNextHint.js';

const { Molecule } = OCL;

test('getNextHint', () => {
  const correct = Molecule.fromSmiles('c1ccccn1C(=O)OC');
  const answer = Molecule.fromSmiles('c1ccccc1OC(=O)');

  const providedHints = [];
  const hint = getNextHint(correct, answer, providedHints);
  expect(hint).toStrictEqual({
    message: 'You should check the molecular formula.',
    hash: 7435243063749257,
    idCode: 'didD@@QIVUxV`@@@',
  });

  providedHints.push(hint);
  const hint2 = getNextHint(correct, answer, providedHints);
  expect(hint2).toStrictEqual({
    idCode: 'didD@@QIVUxV`@@@',
    message: 'There is an amide function in the molecule.',
    hash: 7193064197403359,
  });

  providedHints.push(hint2);
  const hint3 = getNextHint(correct, answer, providedHints);
  expect(hint3).toStrictEqual({
    idCode: 'didD@@QIVUxV`@@@',
    message: 'What about a non-aromatic ring?',
    hash: 4559403381457072,
  });
});
