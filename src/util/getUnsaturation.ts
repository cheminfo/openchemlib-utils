const unsaturationsObject: Record<string, number> = {
  O: 0,
  N: 1,
  H: -1,
  C: 2,
  F: -1,
  Si: 2,
  Cl: -1,
  Br: -1,
  I: -1,
};

/**
 * Simplified version of the calculation in mf-parser
 * @param mf
 * @returns
 */
export function getUnsaturation(mf: string): number | undefined {
  // split a molecular formula into its elements
  const elements = mf.match(/[A-Z][a-z]*\d*/g);
  if (!elements || elements.length === 0) return undefined;
  let unsaturation = 0;
  for (const element of elements) {
    const matches = element.match(/([A-Z][a-z]?)(\d*)/) as RegExpMatchArray;
    const symbol = matches[1];
    const count = matches[2] ? Number.parseInt(matches[2], 10) : 1;
    const elementObject = unsaturationsObject[symbol];
    if (elementObject === undefined) {
      return undefined;
    }
    unsaturation += elementObject * count;
  }
  return unsaturation / 2 + 1;
}
