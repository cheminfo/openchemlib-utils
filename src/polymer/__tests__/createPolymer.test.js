import { Molecule } from 'openchemlib';
import { test, expect } from 'vitest';

import { createPolymer } from '../createPolymer';

const r1 = Molecule.getAtomicNoFromLabel('R1', Molecule.cPseudoAtomsRGroups);
const r2 = Molecule.getAtomicNoFromLabel('R2', Molecule.cPseudoAtomsRGroups);

test('createPolymer, default values', () => {
  const unit = Molecule.fromSmiles('CCCOC');
  unit.setAtomicNo(0, r1);
  unit.setAtomicNo(4, r2);
  const polymer = createPolymer(unit);
  expect(polymer.toSmiles()).toBe('CCOCCOCCOCCOCCOCCOCCOCCOCCOCCO');
});

test('createPolymer, just 2 units of ethylene glycol', () => {
  const unit = Molecule.fromSmiles('CCCOC');
  unit.setAtomicNo(0, r1);
  unit.setAtomicNo(4, r2);
  const alpha = Molecule.fromSmiles('CCl');
  alpha.setAtomicNo(0, r1);
  const gamma = Molecule.fromSmiles('CBr');
  gamma.setAtomicNo(0, r2);

  const polymer = createPolymer(unit, {
    count: 2,
    alpha,
    gamma,
  });

  expect(polymer.toSmiles()).toBe('ClCCOCCOBr');
});

test('all the exceptions', () => {
  expect(() => createPolymer()).toThrow('unit is required');
  const unit = Molecule.fromSmiles('CCCOC');
  expect(() => createPolymer(unit)).toThrow('unit must contain 1 R1');
  unit.setAtomicNo(0, r1);
  expect(() => createPolymer(unit)).toThrow('unit must contain 1 R2');
  unit.setAtomicNo(4, r1);
  expect(() => createPolymer(unit)).toThrow('unit must contain 1 R1');
  unit.setAtomicNo(4, r2);
  const alpha = Molecule.fromSmiles('CCCOC');
  expect(() => createPolymer(unit, { alpha })).toThrow(
    'alpha must contain 1 R1',
  );
  const gamma = Molecule.fromSmiles('CCCOC');
  expect(() => createPolymer(unit, { gamma })).toThrow(
    'gamma must contain 1 R2',
  );
});
