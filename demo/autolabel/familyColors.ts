import { ENTRY_FAMILIES, FALLBACK_FAMILY } from './families.ts';

/** Background of a family chip and the foreground that reads on it. */
export interface FamilyStyle {
  background: string;
  text: string;
}

/**
 * Paul Tol's colour-blind-safe "muted" qualitative palette. It carries exactly
 * as many hues as the database has named families; grey stays for the fallback,
 * which is what the palette reserves it for.
 */
const PALETTE = [
  '#332288', // indigo
  '#88ccee', // cyan
  '#44aa99', // teal
  '#117733', // green
  '#999933', // olive
  '#ddcc77', // sand
  '#cc6677', // rose
  '#882255', // wine
  '#aa4499', // purple
];

const NEUTRAL = '#c9cfd6';
const DARK_TEXT = '#1c2127';
const LIGHT_TEXT = '#ffffff';

const NAMED_FAMILIES = [...new Set(Object.values(ENTRY_FAMILIES))]
  .filter((family) => family !== FALLBACK_FAMILY)
  .toSorted();

const STYLES = buildStyles();

/**
 * Colour given to a natural-product family, the same everywhere it is shown.
 * @param family - family name, e.g. `Steroids`
 * @returns its background and text colour
 */
export function getFamilyStyle(family: string): FamilyStyle {
  return STYLES.get(family) ?? withText(NEUTRAL);
}

function buildStyles(): Map<string, FamilyStyle> {
  const styles = new Map<string, FamilyStyle>();
  for (let index = 0; index < NAMED_FAMILIES.length; index++) {
    styles.set(
      NAMED_FAMILIES[index],
      withText(PALETTE[index % PALETTE.length]),
    );
  }
  styles.set(FALLBACK_FAMILY, withText(NEUTRAL));
  return styles;
}

function withText(background: string): FamilyStyle {
  return {
    background,
    text: luminance(background) > 0.5 ? DARK_TEXT : LIGHT_TEXT,
  };
}

function luminance(hex: string): number {
  const value = Number.parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 0xff;
  const green = (value >> 8) & 0xff;
  const blue = value & 0xff;
  return (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
}
