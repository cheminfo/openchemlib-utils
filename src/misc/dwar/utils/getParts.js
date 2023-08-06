import { getCamelCase } from '../parseDwar';

export function getParts(text) {
  const lines = text.split(/\r?\n/);
  const parts = { data: [] };
  let currentPart = parts.data;
  let currentLabel = '';
  for (const line of lines) {
    if (line.startsWith('</')) {
      // close existing part
      if (!currentLabel === line.slice(2, -1)) {
        throw new Error('This should not happen');
      }
      currentLabel = '';
      currentPart = parts.data;
    } else if (line.startsWith('<') && !line.includes('=')) {
      // open new part
      if (currentLabel) {
        throw new Error('This should not happen');
      }
      currentLabel = line.slice(1, -1);
      const target = getCamelCase(currentLabel);
      parts[target] = [];
      currentPart = parts[target];
    } else if (currentLabel) {
      // add line to current part
      currentPart.push(line);
    } else {
      //data lines
      currentPart.push(line);
    }
  }
  return parts;
}
