import { ensureString } from 'ensure-string';
import Papa from 'papaparse';

import getMoleculeCreators from './getMoleculeCreators';

const defaultCSVOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
};

export default async function appendCSV(moleculesDB, csv, options = {}) {
  const { onStep } = options;
  csv = ensureString(csv);
  const moleculeCreators = getMoleculeCreators(moleculesDB.OCL.Molecule);

  if (typeof csv !== 'string') {
    throw new TypeError('csv must be a string');
  }
  options = { ...defaultCSVOptions, ...options };

  const parsed = Papa.parse(csv, options);
  const fields = parsed.meta.fields;
  const stats = new Array(fields.length);
  const firstElement = parsed.data[0];
  let moleculeCreator, moleculeField;
  for (let i = 0; i < fields.length; i++) {
    stats[i] = {
      label: fields[i],
      isNumeric: typeof firstElement[fields[i]] === 'number',
    };
    const lowerField = fields[i].toLowerCase();
    if (moleculeCreators.has(lowerField)) {
      moleculeCreator = moleculeCreators.get(lowerField);
      moleculeField = fields[i];
    }
  }
  if (!moleculeCreator) {
    throw new Error('this document does not contain any molecule field');
  }
  moleculesDB.statistics = stats;

  for (let i = 0; i < parsed.data.length; i++) {
    moleculesDB.pushEntry(
      moleculeCreator(parsed.data[i][moleculeField]),
      parsed.data[i],
    );
    if (onStep) {
      await onStep(i + 1, parsed.data.length);
    }
  }
}
