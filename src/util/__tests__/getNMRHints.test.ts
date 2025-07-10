import { Molecule } from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { getNMRHints } from '../getNMRHints.js';

describe('getNMRHints', () => {
  it('should return an empty array if the molecules are identical', () => {
    const correct = Molecule.fromSmiles('CC');
    const answer = Molecule.fromSmiles('CC');
    const hints = getNMRHints(correct, answer);

    expect(hints).toHaveLength(0);
  });

  it('only stereo problem', () => {
    const correct = Molecule.fromSmiles('C[C@H](Cl)CC');
    const answer = Molecule.fromSmiles('CC(Cl)CC');
    const hints = getNMRHints(correct, answer);

    expect(hints).toHaveLength(1);
    expect(hints[0]?.message).toBe(
      'There is only a problem with stereochemistry.',
    );
    expect(hints[0]?.hash).toBe(6332019985947725);
  });

  it('wrong MF', () => {
    const correct = Molecule.fromSmiles('CC');
    const answer = Molecule.fromSmiles('C');
    const hints = getNMRHints(correct, answer);

    expect(hints).toHaveLength(1);
    expect(hints[0]?.message).toBe('You should check the molecular formula.');
  });

  it('pyridine versus benzene', () => {
    const correct = Molecule.fromSmiles('c1ccncc1C');
    const answer = Molecule.fromSmiles('c1ccccc1N');
    const hints = getNMRHints(correct, answer);

    expect(hints).toHaveLength(3);
    expect(hints[0]?.message).toBe('An aromatic cycle can be an heterocycle.');
    expect(hints[1]?.message).toBe('Did you think about pyridine derivatives?');
    expect(hints[2]?.message).toBe('The proposed molecule is too symmetric.');
  });

  it('propose carbamate rather than ester', () => {
    const correct = Molecule.fromSmiles('CC(=O)OC');
    const answer = Molecule.fromSmiles('COC(=O)N');
    const hints = getNMRHints(correct, answer);

    expect(hints).toHaveLength(2);
    expect(hints[1]?.message).toBe('What about an ester?');
  });

  it('propose para rather than ortho', () => {
    const correct = Molecule.fromSmiles('c1c(C)c(C)ccc1');
    const answer = Molecule.fromSmiles('c1c(C)ccc(C)c1');
    const hints = getNMRHints(correct, answer);

    expect(hints).toHaveLength(2);
    expect(hints[0]?.message).toBe(
      'Disubstituted aromatic ring can be ortho (1,2), meta (1,3) or para (1,4).',
    );
    expect(hints[1]?.message).toBe('The proposed molecule is too symmetric.');
  });

  it('DBE too low', () => {
    const correct = Molecule.fromSmiles('C=C');
    const answer = Molecule.fromSmiles('CC');
    const hints = getNMRHints(correct, answer);

    expect(hints).toHaveLength(3);
    expect(hints[1]?.message).toBe(
      'The proposed molecule has a double bond equivalent (DBE) that is too low.',
    );
  });

  it('propose meta rather than para', () => {
    const correct = Molecule.fromSmiles('c1c(C)ccc(C)c1');
    const answer = Molecule.fromSmiles('c1c(C)cc(C)cc1');
    const hints = getNMRHints(correct, answer);

    expect(hints).toHaveLength(2);
    expect(hints[0]?.message).toBe(
      'Disubstituted aromatic ring can be ortho (1,2), meta (1,3) or para (1,4).',
    );
    expect(hints[1]?.message).toBe(
      'The proposed molecule is not symmetric enough.',
    );
  });
});
