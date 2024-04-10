import OCL from 'openchemlib';
import { describe, it, expect } from 'vitest';

import { getNMRHints } from '../getNMRHints';

describe('getNMRHints', () => {
  it('should return an empty array if the molecules are identical', () => {
    const correct = OCL.Molecule.fromSmiles('CC');
    const answer = OCL.Molecule.fromSmiles('CC');
    const hints = getNMRHints(correct, answer);
    expect(hints).toHaveLength(0);
  });

  it('only stereo problem', () => {
    const correct = OCL.Molecule.fromSmiles('C[C@H](Cl)CC');
    const answer = OCL.Molecule.fromSmiles('CC(Cl)CC');
    const hints = getNMRHints(correct, answer);
    expect(hints).toHaveLength(1);
    expect(hints[0].message).toBe(
      'There is only a problem with stereochemistry.',
    );
    expect(hints[0].hash).toBe(6332019985947725);
  });

  it('wrong MF', () => {
    const correct = OCL.Molecule.fromSmiles('CC');
    const answer = OCL.Molecule.fromSmiles('C');
    const hints = getNMRHints(correct, answer);
    expect(hints).toHaveLength(1);
    expect(hints[0].message).toBe('You should check the molecular formula.');
  });

  it('pyridine versus benzene', () => {
    const correct = OCL.Molecule.fromSmiles('c1ccncc1C');
    const answer = OCL.Molecule.fromSmiles('c1ccccc1N');
    const hints = getNMRHints(correct, answer);
    expect(hints).toHaveLength(3);
    expect(hints[0].message).toBe('The proposed molecule is too symmetric.');
    expect(hints[1].message).toBe('An aromatic cycle can be an heterocycle.');
    expect(hints[2].message).toBe('Did you think about pyridine derivatives?');
  });

  it('propose carbamate rather than ester', () => {
    const correct = OCL.Molecule.fromSmiles('CC(=O)OC');
    const answer = OCL.Molecule.fromSmiles('COC(=O)N');
    const hints = getNMRHints(correct, answer);
    expect(hints).toHaveLength(2);
    expect(hints[1].message).toBe('What about an ester?');
  });

  it('propose para rather than ortho', () => {
    const correct = OCL.Molecule.fromSmiles('c1c(C)c(C)ccc1');
    const answer = OCL.Molecule.fromSmiles('c1c(C)ccc(C)c1');
    const hints = getNMRHints(correct, answer);
    expect(hints).toHaveLength(2);
    expect(hints[0].message).toBe('The proposed molecule is too symmetric.');
    expect(hints[1].message).toBe('Disubstituted aromatic ring can be o, m or p.');
  });

  it('propose meta rather than para', () => {
    const correct = OCL.Molecule.fromSmiles('c1c(C)ccc(C)c1');
    const answer = OCL.Molecule.fromSmiles('c1c(C)cc(C)cc1');
    const hints = getNMRHints(correct, answer);
    expect(hints).toHaveLength(2);
    expect(hints[0].message).toBe('The proposed molecule is not symmetric enough.');
    expect(hints[1].message).toBe('Disubstituted aromatic ring can be o, m or p.');
  });

});
