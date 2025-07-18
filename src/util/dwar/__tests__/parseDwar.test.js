import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, test } from 'vitest';

import { parseDwar } from '../parseDwar.js';

test('parseDwar', () => {
  const text = readFileSync(
    join(import.meta.dirname, 'data/reactions.dwar'),
    'utf8',
  );
  const reactions = parseDwar(text);
  const data = reactions.data;

  expect(data).toHaveLength(3);
  expect(reactions).toMatchSnapshot();
});

test('R group', () => {
  const text = readFileSync(join(import.meta.dirname, 'data/r.dwar'), 'utf8');
  const structures = parseDwar(text);
  const data = structures.data;

  expect(data).toHaveLength(1);
  expect(structures).toMatchSnapshot();
});
