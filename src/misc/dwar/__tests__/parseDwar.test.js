import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { expect, it } from 'vitest';

import { parseDwar } from '../parseDwar.js';

it('parseDwar', () => {
  const text = readFileSync(join(__dirname, 'data/reactions.dwar'), 'utf8');
  const reactions = parseDwar(text);
  const data = reactions.data;
  expect(data).toHaveLength(3);
  expect(reactions).toMatchSnapshot();
});

it('R group', () => {
  const text = readFileSync(join(__dirname, 'data/r.dwar'), 'utf8');
  const structures = parseDwar(text);
  const data = structures.data;
  expect(data).toHaveLength(1);
  expect(structures).toMatchSnapshot();
});
