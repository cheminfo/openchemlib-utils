import type { Molecule } from 'openchemlib';

import type { NMRHint } from './getNMRHints.ts';
import { getNMRHints } from './getNMRHints.ts';

interface NMRHintWithIdCode extends NMRHint {
  idCode: string;
}

/**
 *
 * @param correct
 * @param proposed
 * @param providedHints
 */
export function getNextNMRHint(
  correct: Molecule,
  proposed: Molecule,
  providedHints: NMRHint[],
): NMRHintWithIdCode | undefined {
  const hints = getNMRHints(correct, proposed);

  const possibleHints = hints.filter(
    (possibleHint) =>
      !providedHints.some(
        (providedHint) => possibleHint.hash === providedHint.hash,
      ),
  );

  if (possibleHints.length === 0) return undefined;
  return {
    ...(possibleHints[0] as NMRHint),
    idCode: proposed.getIDCode(),
  };
}
