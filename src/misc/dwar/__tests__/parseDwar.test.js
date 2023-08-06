import { readFileSync } from 'fs';
import { join } from 'path';

import { expect, it } from 'vitest';

import { parseDwar } from '../parseDwar.js';

it('parseDwar', () => {
  const text = readFileSync(join(__dirname, 'data/reactions.dwar'), 'utf8');
  const reactions = parseDwar(text);
  const data = reactions.data;
  expect(data).toHaveLength(3);
  expect(reactions).toMatchSnapshot();
});
