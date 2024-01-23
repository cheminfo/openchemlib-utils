import OCL from 'openchemlib';
import { describe, it, expect } from 'vitest';

import { getTips } from '../getTips';

describe('getTips', () => {
  it('should return an empty array if the molecules are identical', () => {
    const correct = OCL.Molecule.fromSmiles('CC');
    const answer = OCL.Molecule.fromSmiles('CC');
    const tips = getTips(correct, answer);
    expect(tips).toHaveLength(0);
  });

  it('only stereo problem', () => {
    const correct = OCL.Molecule.fromSmiles('C[C@H](Cl)CC');
    const answer = OCL.Molecule.fromSmiles('CC(Cl)CC');
    const tips = getTips(correct, answer);
    expect(tips).toHaveLength(1);
    expect(tips[0].message).toBe('There is only a problem with stereochemistry.');
  });

  it('wrong MF', () => {
    const correct = OCL.Molecule.fromSmiles('CC');
    const answer = OCL.Molecule.fromSmiles('C');
    const tips = getTips(correct, answer);
    expect(tips).toHaveLength(1);
    expect(tips[0].message).toBe('You should check the molecular formula.');
  }
  )

  it('pyridine versus benzene', () => {
    const correct = OCL.Molecule.fromSmiles('c1ccncc1C');
    const answer = OCL.Molecule.fromSmiles('c1ccccc1N');
    const tips = getTips(correct, answer);
    expect(tips).toHaveLength(2);
    expect(tips[0].message).toBe('Did you think about pyridine derivatives?');
    expect(tips[1].message).toBe('An aromatic cycle can be an heterocycle.');
  })

});
