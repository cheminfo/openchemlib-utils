import { ensureString } from 'ensure-string';

import { getParts } from './utils/getParts';
import { parseColumnbProperties } from './utils/parseColumnbProperties';
import { parseData } from './utils/parseData';

/**
 * Convert a DataWarrior database into a JSON object
 * @param {string} text
 * @returns
 */
export function parseDwar(text) {
  text = ensureString(text);
  const parts = getParts(text);
  improveParts(parts);
  return parts;
}

export function getCamelCase(name) {
  return name.replace(/[ -][a-z]/g, (string) => string[1].toUpperCase());
}

function improveParts(parts) {
  for (const key in parts) {
    switch (key) {
      case 'columnProperties':
        parts[key] = parseColumnbProperties(parts[key]);
        break;
      case 'data':
        break;
      default:
        parts[key] = parseDefault(parts[key]);
    }
  }
  const data = parseData(parts.data, {
    columnProperties: parts.columnProperties,
  });
  parts.data = data.entries;
  parts.rawData = data.rawEntries;
}

function parseDefault(lines) {
  const result = {};
  for (const line of lines) {
    const [key, value] = line.slice(1, -1).split('=');
    result[key] = value.slice(1, -1);
  }
  return result;
}
