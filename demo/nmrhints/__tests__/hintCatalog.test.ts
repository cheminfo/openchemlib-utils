import { expect, test } from 'vitest';

import { defaultPossibleHints } from '../../../src/util/getNMRHints.ts';
import {
  HINT_CATALOG,
  buildHintCatalog,
  decodeFragment,
} from '../hintCatalog.ts';

// what `\\` inside String.raw produces: two backslashes instead of one
const DOUBLED_BACKSLASH = 'gNx@@eRmUPFDElZxxppVFAppUv\\\\WUw~xu`';

test('the default catalog has one entry per default hint, in order', () => {
  expect(HINT_CATALOG).toHaveLength(defaultPossibleHints.length);
  expect(HINT_CATALOG.map((entry) => entry.index)).toStrictEqual(
    defaultPossibleHints.map((_, index) => index),
  );
});

test('every idCode of the default hint list can be decoded', () => {
  const invalid = HINT_CATALOG.filter((entry) =>
    entry.issues.some((issue) => issue.level === 'danger'),
  ).map((entry) => entry.index);

  expect(invalid).toStrictEqual([]);
});

test('a canonical fragment has no issue', () => {
  const [entry] = buildHintCatalog([{ idCode: 'eFHBJD', message: 'carbonyl' }]);

  expect(entry?.issues).toStrictEqual([]);
  expect(entry?.fragment.smarts).toBe('C=O');
  expect(entry?.fragment.canonicalIdCode).toBe('eFHBJD');
});

test('a non-canonical idCode is reported with its canonical form', () => {
  const [entry] = buildHintCatalog([
    { idCode: String.raw`eF@Hp\pcB`, message: 'ring bond' },
  ]);

  expect(entry?.issues).toStrictEqual([
    {
      level: 'info',
      label: 'idCode not canonical',
      message: 'idCode re-encodes to eF@Hp\\p`',
    },
  ]);
  expect(entry?.fragment.smarts).toBe('C@C');
});

test('a truncated idCode cannot be decoded', () => {
  const [entry] = buildHintCatalog([
    { idCode: 'gFp@DiTt@@CqB^JoV[m', message: 'truncated' },
  ]);

  expect(entry?.fragment.molecule).toBeUndefined();
  expect(
    entry?.issues.map((issue) => [issue.level, issue.label]),
  ).toStrictEqual([['danger', 'invalid idCode']]);
});

test('an idCode with a doubled backslash cannot be decoded', () => {
  const [entry] = buildHintCatalog([
    { idCode: DOUBLED_BACKSLASH, message: 'x' },
  ]);

  expect(entry?.fragment.molecule).toBeUndefined();
  expect(
    entry?.issues.map((issue) => [issue.level, issue.label]),
  ).toStrictEqual([['danger', 'invalid idCode']]);
});

test('a one-character idCode cannot be decoded', () => {
  expect(decodeFragment('g')).toStrictEqual({
    idCode: 'g',
    error: expect.stringContaining('IDCodeParser: unexpected end of ID code'),
  });
});

test('an idCode that decodes to no atom is invalid', () => {
  expect(decodeFragment('')).toStrictEqual({
    idCode: '',
    error: 'decodes to an empty molecule',
  });
});

test('an undecodable anyMatches idCode and a duplicate hint are reported', () => {
  const hint = { idCode: 'eFHBJD', message: 'carbonyl', anyMatches: ['x'] };
  const catalog = buildHintCatalog([hint, { ...hint }]);

  expect(
    catalog.map((entry) => entry.issues.map((issue) => issue.label)),
  ).toStrictEqual([
    ['invalid anyMatches[0]'],
    ['invalid anyMatches[0]', 'duplicate of #0'],
  ]);
});
