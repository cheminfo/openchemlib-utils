/**
 * Shortens an idCode for a table cell; the full value stays available as a tooltip.
 * @param value - the idCode, `undefined` above `maxNbAtoms`
 * @param length - how many characters are kept
 * @returns the shortened idCode, or an em dash when there is nothing to show
 */
export function truncateIdCode(value: string | undefined, length = 14): string {
  if (!value) return '—';
  return value.length > length ? `${value.slice(0, length)}…` : value;
}
