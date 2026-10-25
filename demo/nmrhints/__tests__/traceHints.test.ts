import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { analysePair } from '../analysePair.ts';
import { HINT_CATALOG, buildHintCatalog } from '../hintCatalog.ts';
import { PAIR_PRESETS } from '../pairPresets.ts';
import {
  findMatchAtoms,
  findTraceMismatch,
  traceHints,
} from '../traceHints.ts';

const ESTER = 'gGP`@df]j`H';
const REVERSED_ESTER = 'gGP`@dfUj`H';

const catalog = buildHintCatalog([
  { idCode: 'eFHBJD', message: 'carbonyl' },
  { idCode: ESTER, anyMatches: [REVERSED_ESTER], message: 'orientation' },
  { idCode: 'gC``@dfZ@~bl', message: 'acid' },
  { idCode: ESTER, anyMatches: [String.raw`eF@Hh\q@`], message: 'olefin gate' },
]);

const ethylAcetate = Molecule.fromSmiles('CC(=O)OCC');
const methylPropanoate = Molecule.fromSmiles('CCC(=O)OC');

test('each hint gets the status of the step that kept or dropped it', () => {
  const traces = traceHints(catalog, ethylAcetate, methylPropanoate);

  expect(traces.map((trace) => trace.status)).toStrictEqual([
    'presentInProposed',
    'fired',
    'absentFromCorrect',
    'gated',
  ]);
  expect(traces.map((trace) => trace.gate)).toStrictEqual([
    [],
    [true],
    [],
    [false],
  ]);
  expect(
    traces.map((trace) => [trace.inCorrect, trace.inProposed]),
  ).toStrictEqual([
    [true, true],
    [true, false],
    [false, false],
    [true, false],
  ]);
});

test('the trace is idle until both structures exist', () => {
  const traces = traceHints(catalog, ethylAcetate, undefined);

  expect(traces.map((trace) => trace.status)).toStrictEqual([
    'idle',
    'idle',
    'idle',
    'idle',
  ]);
  expect(traces.map((trace) => trace.gate)).toStrictEqual([
    [],
    [undefined],
    [],
    [undefined],
  ]);
});

test('the returned hints are linked to the hint they come from', () => {
  const analysis = analysePair(catalog, ethylAcetate, methylPropanoate);

  expect(analysis.hints?.map((hint) => hint.message)).toStrictEqual([
    'orientation',
  ]);
  expect(analysis.attribution).toStrictEqual([1]);
  expect(analysis.mismatch).toBeUndefined();
  expect(analysis.facts?.correct.mf).toBe('C4H8O2');
  expect(analysis.facts?.proposed.diaIDCount).toBe(9);
});

test('global checks are not attributed to any hint', () => {
  const analysis = analysePair(
    catalog,
    Molecule.fromSmiles('C[C@H](Cl)CC'),
    Molecule.fromSmiles('CC(Cl)CC'),
  );

  expect(analysis.hints?.map((hint) => hint.message)).toStrictEqual([
    'There is only a problem with stereochemistry.',
  ]);
  expect(analysis.attribution).toStrictEqual([undefined]);
});

test('a disagreement between the trace and the result is reported', () => {
  const traces = traceHints(catalog, ethylAcetate, methylPropanoate);

  expect(findTraceMismatch([], traces)).toBe(
    'the trace predicts 1 fragment hint(s) but getNMRHints returned 0, or in another order',
  );
});

test('an invalid hint is flagged and the error of getNMRHints is kept', () => {
  const invalidCatalog = buildHintCatalog([
    { idCode: 'gNx@@eRmUPFDElZxxppVFAppUv\\\\WUw~xu`', message: 'broken' },
  ]);
  const analysis = analysePair(invalidCatalog, ethylAcetate, methylPropanoate);

  expect(analysis.traces.map((trace) => trace.status)).toStrictEqual([
    'invalid',
  ]);
  expect(analysis.hints).toBeUndefined();
  expect(analysis.error).toBe(invalidCatalog[0]?.fragment.error);
});

test('the matched atoms of a fragment are found', () => {
  const carbonyl = Molecule.fromIDCode('eFHBJD');

  expect(findMatchAtoms(carbonyl, ethylAcetate)).toStrictEqual([1, 2]);
});

test.each(PAIR_PRESETS)('the trace replays getNMRHints for $id', (preset) => {
  const analysis = analysePair(
    HINT_CATALOG,
    Molecule.fromSmiles(preset.correct),
    Molecule.fromSmiles(preset.proposed),
  );

  expect(analysis.error).toBeUndefined();
  expect(analysis.mismatch).toBeUndefined();
});
