import { readFileSync } from 'fs';
import { join } from 'path';

import { parseDwar } from '../parseDwar.js';

test('parseDwar', () => {
  const text = readFileSync(join(__dirname, 'data/reactions.dwar'), 'utf8');
  const reactions = parseDwar(text);
  const data = reactions.data;
  expect(data).toHaveLength(3);
  expect(reactions).toMatchSnapshot();
});
