import type { PeptideNaming } from '../PeptideTypes.ts';

/**
 * The Roman counterpart of each Greek letter, recommended by IUPAC when Greek
 * letters are unavailable: `Cβ` is written `CB`, `Hγ12` `HG12` and `C′` `C'`.
 * The PDB spells a prime the same way, `H2′` and `H2″` of a deoxyribose being
 * `H2'` and `H2''`. Only a spelling — the identifiers themselves come from the
 * fragments.
 */
const ROMAN: Record<string, string> = {
  α: 'A',
  β: 'B',
  γ: 'G',
  δ: 'D',
  ε: 'E',
  ζ: 'Z',
  η: 'H',
  '′': "'",
  '″': "''",
};

/**
 * The backbone atoms the PDB does not prime, keyed by their IUPAC identifier
 * and giving the PDB descriptor: the carbonyl carbon `C′` is written `C`, the
 * carboxylate `O′` and `O″` are `O` and `OXT`, the acid hydrogen `H″` is `HXT`
 * and the amide `HN` is `H`. Every other atom is its Roman counterpart, which
 * is already the name the PDB uses.
 */
const PDB: Record<string, string> = {
  'C′': '',
  'O′': '',
  'O″': 'XT',
  'H″': 'XT',
  HN: '',
};

/**
 * Spell a descriptor in the alphabet the caller asked for.
 * @param element - the symbol of the atom carrying the descriptor.
 * @param descriptor - the IUPAC identifier without its element symbol.
 * @param naming - the alphabet to spell it in.
 * @returns the descriptor as it must be written, the element symbol excluded.
 */
export function spellDescriptor(
  element: string,
  descriptor: string,
  naming: PeptideNaming,
): string {
  if (naming === 'greek') return descriptor;
  if (naming === 'roman') return toRoman(descriptor);
  return PDB[element + descriptor] ?? toRoman(descriptor);
}

/**
 * Spell a descriptor with Roman letters.
 * @param descriptor - the identifier without its element symbol.
 * @returns the same identifier, Greek letters transliterated.
 */
function toRoman(descriptor: string): string {
  let roman = '';
  for (const character of descriptor) roman += ROMAN[character] ?? character;
  return roman;
}
