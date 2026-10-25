import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { PAIR_PRESETS } from '../pairPresets.ts';
import { drawSide, loadPreset, loadSide, swapSides } from '../pairState.ts';

const preset = {
  id: 'test',
  label: 'test',
  group: 'test',
  correct: 'CCO',
  proposed: 'COC',
};

function idCodeOf(molfile: string): string {
  return Molecule.fromMolfile(molfile).getIDCode();
}

test('pair presets have unique ids', () => {
  const ids = PAIR_PRESETS.map((pairPreset) => pairPreset.id);

  expect(ids).toHaveLength(27);
  expect(new Set(ids).size).toBe(27);
});

test('a preset loads both editors and remounts them', () => {
  const pair = loadPreset(preset);
  const next = loadPreset(preset, pair);

  expect(idCodeOf(pair.correct.current)).toBe(
    Molecule.fromSmiles('CCO').getIDCode(),
  );
  expect(idCodeOf(pair.proposed.initial)).toBe(
    Molecule.fromSmiles('COC').getIDCode(),
  );
  expect([pair.correct.revision, pair.proposed.revision]).toStrictEqual([1, 1]);
  expect([next.correct.revision, next.proposed.revision]).toStrictEqual([2, 2]);
});

test('drawing keeps the editor mounted, loading remounts it', () => {
  const pair = loadPreset(preset);
  const drawn = drawSide(pair, 'correct', 'drawn');
  const pasted = loadSide(drawn, 'proposed', 'pasted');

  expect(drawn.correct).toStrictEqual({
    initial: pair.correct.initial,
    current: 'drawn',
    revision: 1,
  });
  expect(pasted.proposed).toStrictEqual({
    initial: 'pasted',
    current: 'pasted',
    revision: 2,
  });
  expect(pasted.correct).toBe(drawn.correct);
});

test('swapping exchanges what is drawn and remounts both editors', () => {
  const pair = drawSide(loadPreset(preset), 'correct', 'drawn');
  const swapped = swapSides(pair);

  expect(swapped.correct).toStrictEqual({
    initial: pair.proposed.current,
    current: pair.proposed.current,
    revision: 2,
  });
  expect(swapped.proposed).toStrictEqual({
    initial: 'drawn',
    current: 'drawn',
    revision: 2,
  });
});
