import type { Molecule } from 'openchemlib';

import type { NMRHint } from '../../src/util/getNMRHints.ts';
import { getNMRHints } from '../../src/util/getNMRHints.ts';
import { errorMessage } from '../components/errorMessage.ts';

import type { HintCatalogEntry } from './hintCatalog.ts';
import type { MoleculeFacts } from './moleculeFacts.ts';
import { getMoleculeFacts } from './moleculeFacts.ts';
import type { HintTrace } from './traceHints.ts';
import { attributeHints, findTraceMismatch, traceHints } from './traceHints.ts';

export interface PairAnalysis {
  traces: HintTrace[];
  /** what `getNMRHints` returned, in the order `getNextNMRHint` reveals them */
  hints?: NMRHint[];
  /** message of what `getNMRHints` threw */
  error?: string;
  /** per returned hint, the catalog index it comes from, `undefined` for a global check */
  attribution: Array<number | undefined>;
  /** set when the trace and `getNMRHints` disagree */
  mismatch?: string;
  facts?: Record<'correct' | 'proposed', MoleculeFacts>;
  factsError?: string;
}

/**
 * Runs `getNMRHints` on a pair and explains its result.
 * @param catalog - the decoded hint list, also passed to `getNMRHints`
 * @param correct - the expected structure
 * @param proposed - the structure to judge
 * @returns the real result next to its trace; only the idle trace without both structures
 */
export function analysePair(
  catalog: HintCatalogEntry[],
  correct: Molecule | undefined,
  proposed: Molecule | undefined,
): PairAnalysis {
  const traces = traceHints(catalog, correct, proposed);
  if (!correct || !proposed) return { traces, attribution: [] };

  const analysis: PairAnalysis = { traces, attribution: [] };
  try {
    const hints = getNMRHints(correct, proposed, {
      possibleHints: catalog.map((entry) => entry.hint),
    });
    analysis.hints = hints;
    analysis.attribution = attributeHints(hints, traces);
    analysis.mismatch = findTraceMismatch(hints, traces);
  } catch (error) {
    analysis.error = errorMessage(error);
  }
  try {
    analysis.facts = {
      correct: getMoleculeFacts(correct),
      proposed: getMoleculeFacts(proposed),
    };
  } catch (error) {
    analysis.factsError = errorMessage(error);
  }
  return analysis;
}
