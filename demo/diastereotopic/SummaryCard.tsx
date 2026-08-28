import { Card, Spinner, Tag } from '@blueprintjs/core';

import type { DiastereotopicOk, DiastereotopicOptionsState } from './types.ts';

interface SummaryCardProps {
  result: DiastereotopicOk;
  /** The options the result was computed with, not the possibly newer edited ones. */
  options: DiastereotopicOptionsState;
  /** A compute is queued; the figures below are still the previous ones. */
  pending: boolean;
}

interface SummaryBadge {
  text: string;
  intent: 'warning' | 'danger' | 'primary';
}

/**
 * The counts of the analysis and the badges that qualify them.
 * @param props - the successful analysis, the options it ran with and the pending flag
 * @returns the summary card
 */
export function SummaryCard(props: SummaryCardProps) {
  const { result, options, pending } = props;

  return (
    <Card elevation={0} className="result-card">
      <div className="section-title">
        <span>Summary</span>
        {pending && <Spinner size={20} />}
      </div>
      {summaryFacts(result).map((fact) => (
        <div key={fact} className="mono">
          {fact}
        </div>
      ))}
      <div className="chip-row">
        {summaryBadges(result, options).map((badge) => (
          <Tag key={badge.text} minimal intent={badge.intent}>
            {badge.text}
          </Tag>
        ))}
      </div>
    </Card>
  );
}

function summaryFacts(result: DiastereotopicOk): string[] {
  const { summary } = result;
  return [
    `molecule ${summary.atomCountMolecule} atoms`,
    `moleculeWithH ${summary.atomCountMoleculeWithH} atoms`,
    `${summary.distinctDiaIDs} distinct diaIDs`,
    `${summary.distinctEnantioIDs} distinct enantioIDs`,
    `${summary.groupCount} diaID groups`,
    `${summary.prochiralHydrogens} prochiral H (${summary.diastereotopicHydrogens} diastereotopic, ${summary.enantiotopicHydrogens} enantiotopic)`,
    `labelled by setProchiralHydrogenLabels(): ${summary.labelledCount}`,
  ];
}

function summaryBadges(
  result: DiastereotopicOk,
  options: DiastereotopicOptionsState,
): SummaryBadge[] {
  const badges: SummaryBadge[] = [];
  if (result.overMaxNbAtoms) {
    badges.push({
      intent: 'warning',
      text: `over maxNbAtoms — ${result.summary.atomCountMoleculeWithH} > ${options.maxNbAtoms}, all IDs empty`,
    });
  }
  if (!options.computeHoseCodes) {
    badges.push({ intent: 'warning', text: 'hoseCodes disabled' });
  }
  for (const group of result.groups) {
    if (group.mixedProchirality) {
      badges.push({ intent: 'danger', text: 'mixed r/s inside a diaID group' });
      break;
    }
  }
  if (options.includeEnantiotopic) {
    badges.push({ intent: 'primary', text: 'includeEnantiotopic' });
  }
  return badges;
}
