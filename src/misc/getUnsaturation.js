import { unsaturationsObject } from 'chemical-elements/src/unsaturationsObject.js';

/**
 * Simplified version of the calculation in mf-parser
 * @param {string} mf
 * @returns
 */
export function getUnsaturation(mf) {
  // split a molecular formula into its elements
  const elements = mf.match(/[A-Z][a-z]*\d*/g);
  let unsaturation = 0;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const matches = element.match(/([A-Z][a-z]?)(\d*)/);
    const symbol = matches[1];
    const count = matches[2] ? parseInt(matches[2], 10) : 1;
    const elementObject = unsaturationsObject[symbol];
    if (elementObject === undefined) {
      return undefined;
    }
    unsaturation += unsaturationsObject[symbol] * count;
  }
  return unsaturation / 2 + 1;
}
