import OCL from 'openchemlib';
import { describe, it, expect } from 'vitest';

import { getHints } from '../getHints';

describe('getHints', () => {
  it('should return an empty array if the molecules are identical', () => {
    const correct = OCL.Molecule.fromSmiles('CC');
    const answer = OCL.Molecule.fromSmiles('CC');
    const hints = getHints(correct, answer);
    expect(hints).toHaveLength(0);
  });

  it('only stereo problem', () => {
    const correct = OCL.Molecule.fromSmiles('C[C@H](Cl)CC');
    const answer = OCL.Molecule.fromSmiles('CC(Cl)CC');
    const hints = getHints(correct, answer);
    expect(hints).toHaveLength(1);
    expect(hints[0].message).toBe(
      'There is only a problem with stereochemistry.',
    );
  });

  it('wrong MF', () => {
    const correct = OCL.Molecule.fromSmiles('CC');
    const answer = OCL.Molecule.fromSmiles('C');
    const hints = getHints(correct, answer);
    expect(hints).toHaveLength(1);
    expect(hints[0].message).toBe('You should check the molecular formula.');
  });

  it('pyridine versus benzene', () => {
    const correct = OCL.Molecule.fromSmiles('c1ccncc1C');
    const answer = OCL.Molecule.fromSmiles('c1ccccc1N');
    const hints = getHints(correct, answer);
    expect(hints).toHaveLength(2);
    expect(hints[0].message).toBe('Did you think about pyridine derivatives?');
    expect(hints[1].message).toBe('An aromatic cycle can be an heterocycle.');
  });
});
