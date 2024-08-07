export function parseData(lines, options = {}) {
  lines = lines.filter((line) => !line.match(/^\s*$/));
  const { columnProperties = {} } = options;
  const headers = lines
    .shift()
    .split('\t')
    .map((header) => {
      if (columnProperties[header]) {
        return { label: header, ...columnProperties[header] };
      }
      return { label: header };
    });
  const entries = [];
  const rawEntries = [];

  for (const line of lines) {
    const fields = line.split('\t');
    const rawEntry = {};
    for (const [index, header] of headers.entries()) {
      rawEntry[header.label] = fields[index];
    }
    rawEntries.push(rawEntry);
    const entry = {};
    for (const header of headers) {
      if (header.parent) continue;
      entry[header.label] = valueEhnhancer(header, rawEntry);
    }
    entries.push(entry);
  }

  return { entries, rawEntries };
}

function valueEhnhancer(header, rawEntry) {
  if (header?.specialType === 'rxncode') {
    return `${rawEntry[header.label]}#${rawEntry[header.related.atomMapping]}#${
      rawEntry[header.related.idcoordinates2D]
    }`;
  }

  return rawEntry[header.label];
}

/*
entry.rxnCode =
*/
