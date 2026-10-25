import { Molecule } from 'openchemlib';

import type { PossibleHint } from '../../src/util/getNMRHints.ts';
import { defaultPossibleHints } from '../../src/util/getNMRHints.ts';
import { errorMessage } from '../components/errorMessage.ts';

/** One idCode of the hint list, decoded once. */
export interface HintFragment {
  /** the idCode exactly as written in the hint list */
  idCode: string;
  /** the decoded fragment, absent when the idCode cannot be decoded */
  molecule?: Molecule;
  /** what OCL re-encodes the fragment to; differs from `idCode` when the list is not canonical */
  canonicalIdCode?: string;
  smarts?: string;
  /** why the idCode cannot be used */
  error?: string;
}

export interface HintIssue {
  /** `danger` makes `getNMRHints` throw or misbehave, `info` is cosmetic */
  level: 'danger' | 'warning' | 'info';
  label: string;
  message: string;
}

export interface HintCatalogEntry {
  /** position in the hint array, 0-based like `defaultPossibleHints[index]` */
  index: number;
  hint: PossibleHint;
  fragment: HintFragment;
  /** decoded `hint.anyMatches`, in order; empty when the hint has no gate */
  anyMatches: HintFragment[];
  issues: HintIssue[];
}

/**
 * Decodes every hint of a list and collects what is wrong with its idCodes.
 * @param hints - the possible hints, in the order `getNMRHints` walks them
 * @returns one entry per hint, in the same order
 */
export function buildHintCatalog(hints: PossibleHint[]): HintCatalogEntry[] {
  const firstIndexByKey = new Map<string, number>();
  const catalog: HintCatalogEntry[] = [];
  for (let index = 0; index < hints.length; index++) {
    const hint = hints[index];
    const fragment = decodeFragment(hint.idCode);
    const anyMatches = (hint.anyMatches ?? []).map(decodeFragment);
    const issues = [
      ...fragmentIssues(fragment, 'idCode'),
      ...anyMatches.flatMap((anyMatch, position) =>
        fragmentIssues(anyMatch, `anyMatches[${position}]`),
      ),
    ];
    const key = JSON.stringify([
      hint.idCode,
      hint.anyMatches ?? [],
      hint.message,
    ]);
    const firstIndex = firstIndexByKey.get(key);
    if (firstIndex === undefined) {
      firstIndexByKey.set(key, index);
    } else {
      issues.push({
        level: 'warning',
        label: `duplicate of #${firstIndex}`,
        message: `same idCode, anyMatches and message as hint #${firstIndex}`,
      });
    }
    catalog.push({ index, hint, fragment, anyMatches, issues });
  }
  return catalog;
}

/** The catalog of the hints `getNMRHints` uses by default; rebuilt on every hot reload of the list. */
export const HINT_CATALOG: HintCatalogEntry[] =
  buildHintCatalog(defaultPossibleHints);

/**
 * Decodes one idCode of the hint list.
 * @param idCode - the idCode as written in the list
 * @returns the decoded fragment, or the reason it cannot be used
 */
export function decodeFragment(idCode: string): HintFragment {
  let molecule: Molecule;
  try {
    molecule = Molecule.fromIDCode(idCode);
  } catch (error) {
    return { idCode, error: errorMessage(error) };
  }
  if (molecule.getAllAtoms() === 0) {
    return { idCode, error: 'decodes to an empty molecule' };
  }
  return {
    idCode,
    molecule,
    canonicalIdCode: molecule.getIDCode(),
    smarts: molecule.toSmarts(),
  };
}

function fragmentIssues(fragment: HintFragment, where: string): HintIssue[] {
  if (fragment.error !== undefined) {
    return [
      {
        level: 'danger',
        label: `invalid ${where}`,
        message: `${where} cannot be decoded: ${fragment.error}`,
      },
    ];
  }
  const issues: HintIssue[] = [];
  if (!fragment.molecule?.isFragment()) {
    issues.push({
      level: 'warning',
      label: `${where} not a fragment`,
      message: `${where} is not flagged as a fragment, which SSSearcher expects of what it searches for`,
    });
  }
  if (fragment.canonicalIdCode !== fragment.idCode) {
    issues.push({
      level: 'info',
      label: `${where} not canonical`,
      message: `${where} re-encodes to ${fragment.canonicalIdCode}`,
    });
  }
  return issues;
}
