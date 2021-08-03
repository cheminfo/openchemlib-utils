import { ensureString } from 'ensure-string';

export default async function appendSmilesList(
  moleculesDB,
  text,
  options = {},
) {
  const { onStep } = options;
  text = ensureString(text);
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }
  const smilesArray = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line);
  for (let i = 0; i < smilesArray.length; i++) {
    const oneSmiles = smilesArray[i];
    moleculesDB.pushEntry(moleculesDB.OCL.Molecule.fromSmiles(oneSmiles));
    if (onStep) {
      await onStep(i + 1, smilesArray.length);
    }
  }
}
