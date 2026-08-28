import { Molecule } from 'openchemlib';

const cache = new Map<string, Molecule>();

/**
 * Decodes an idCode into a `Molecule`, memoized for the lifetime of the page.
 * A decode costs about 90 µs and the atom table asks for hundreds of them.
 * @param idCode - the idCode to decode
 * @returns the decoded molecule, or `undefined` when there is nothing to decode
 */
export function decodeIdCode(idCode: string | undefined): Molecule | undefined {
  if (!idCode) return undefined;
  const cached = cache.get(idCode);
  if (cached) return cached;
  try {
    const molecule = Molecule.fromIDCode(idCode);
    if (molecule.getAllAtoms() === 0) return undefined;
    cache.set(idCode, molecule);
    return molecule;
  } catch {
    return undefined;
  }
}
