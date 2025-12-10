import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

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

test('createPolymer, just 2 units of ethylene glycol but mark the units', () => {
  const unit = Molecule.fromSmiles('CCCOC');
  unit.setAtomicNo(0, r1);
  unit.setAtomicNo(4, r2);
  const alpha = Molecule.fromSmiles('CCl');
  alpha.setAtomicNo(0, r1);
  const gamma = Molecule.fromSmiles('CBr');
  gamma.setAtomicNo(0, r2);

  const polymer = createPolymer(unit, {
    count: 2,
    markMonomer: true,
    alpha,
    gamma,
  });

  expect(polymer.getIDCode()).toBe('daxDPHHLShaIUVjj@@');

  let monomerOneCounter = 0;
  for (let i = 0; i < polymer.getAtoms(); i++) {
    if (polymer.getAtomMapNo(i) === 1) {
      monomerOneCounter++;
    }
  }

  expect(monomerOneCounter).toBe(3);

  let monomerTwoCounter = 0;
  for (let i = 0; i < polymer.getAtoms(); i++) {
    if (polymer.getAtomMapNo(i) === 2) {
      monomerTwoCounter++;
    }
  }

  expect(monomerTwoCounter).toBe(3);

  expect(polymer.toSmiles()).toBe('ClCCOCCOBr');
});

test('all the exceptions', () => {
  expect(() => createPolymer()).toThrowError('unit is required');

  const unit = Molecule.fromSmiles('CCCOC');

  expect(() => createPolymer(unit)).toThrowError('unit must contain 1 R1');

  unit.setAtomicNo(0, r1);

  expect(() => createPolymer(unit)).toThrowError('unit must contain 1 R2');

  unit.setAtomicNo(4, r1);

  expect(() => createPolymer(unit)).toThrowError('unit must contain 1 R1');

  unit.setAtomicNo(4, r2);
  const alpha = Molecule.fromSmiles('CCCOC');

  expect(() => createPolymer(unit, { alpha })).toThrowError(
    'alpha must contain 1 R1',
  );

  const gamma = Molecule.fromSmiles('CCCOC');

  expect(() => createPolymer(unit, { gamma })).toThrowError(
    'gamma must contain 1 R2',
  );
});
