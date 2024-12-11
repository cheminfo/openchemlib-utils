import { getNMRHints } from './getNMRHints.js';

/**
 *
 * @param {import('openchemlib').Molecule} correct
 * @param {import('openchemlib').Molecule} proposed
 * @param {Array} providedHints
 */
export function getNextNMRHint(correct, proposed, providedHints) {
  const hints = getNMRHints(correct, proposed);

  const possibleHints = hints.filter(
    (possibleHint) =>
      !providedHints.some(
        (providedHint) => possibleHint.hash === providedHint.hash,
      ),
  );

  if (possibleHints.length === 0) return undefined;
  return {
    ...possibleHints[0],
    idCode: proposed.getIDCode(),
  };
}
