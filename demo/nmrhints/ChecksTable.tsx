import { Callout, HTMLTable, Tag } from '@blueprintjs/core';
import type { ReactNode } from 'react';
import { MF } from 'react-mf';

import { CopyableCode } from '../components/CopyableCode.tsx';
import { TableHead } from '../components/TableHead.tsx';

import type { PairAnalysis } from './analysePair.ts';
import type { MoleculeFacts } from './moleculeFacts.ts';

const HEADERS = ['Check', 'Correct', 'Proposed', 'Compared'] as const;

interface CheckRow {
  label: string;
  /** which hint the comparison drives */
  title: string;
  render: (facts: MoleculeFacts) => ReactNode;
  value: (facts: MoleculeFacts) => unknown;
}

const ROWS: CheckRow[] = [
  {
    label: 'Molecular formula',
    title: 'a different formula gives "check the molecular formula"',
    render: (facts) => <MF mf={facts.mf} />,
    value: (facts) => facts.mf,
  },
  {
    label: 'DBE',
    title: 'compared only when the formulas differ',
    render: (facts) => String(facts.dbe ?? '—'),
    value: (facts) => facts.dbe,
  },
  {
    label: 'idCode',
    title: 'identical idCodes skip the stereo and tautomer checks',
    render: (facts) => <CopyableCode value={facts.idCode} label="idCode" />,
    value: (facts) => facts.idCode,
  },
  {
    label: 'idCode without stereo',
    title:
      'equal while the idCodes differ: "only a problem with stereochemistry"',
    render: (facts) => (
      <CopyableCode value={facts.noStereoIdCode} label="no-stereo idCode" />
    ),
    value: (facts) => facts.noStereoIdCode,
  },
  {
    label: 'tautomer idCode',
    title:
      'equal while the stereo-free idCodes differ: "the expected tautomer"',
    render: (facts) => (
      <CopyableCode value={facts.tautomerIdCode} label="tautomer idCode" />
    ),
    value: (facts) => facts.tautomerIdCode,
  },
  {
    label: 'distinct diaIDs',
    title:
      'compared only when the formulas are equal: "too symmetric" / "not symmetric enough"',
    render: (facts) => String(facts.diaIDCount),
    value: (facts) => facts.diaIDCount,
  },
];

interface ChecksTableProps {
  analysis: PairAnalysis;
}

/**
 * The values behind the global checks of `getNMRHints`, side by side.
 * @param props - the analysis of the pair
 * @returns the checks panel, or nothing before both structures are drawn
 */
export function ChecksTable(props: ChecksTableProps) {
  const { facts, factsError } = props.analysis;
  if (factsError !== undefined) {
    return (
      <Callout
        className="error-card"
        intent="danger"
        title="Cannot compute the global checks"
      >
        {factsError}
      </Callout>
    );
  }
  if (!facts) return null;

  return (
    <div className="panel">
      <div className="section-title">
        <span>Global checks</span>
      </div>
      <HTMLTable compact striped bordered className="fit-table">
        <TableHead headers={HEADERS} />
        <tbody>
          {ROWS.map((row) => {
            const same = row.value(facts.correct) === row.value(facts.proposed);
            return (
              <tr key={row.label} title={row.title}>
                <td>{row.label}</td>
                <td>{row.render(facts.correct)}</td>
                <td>{row.render(facts.proposed)}</td>
                <td>
                  <Tag minimal intent={same ? 'success' : 'warning'}>
                    {same ? 'same' : 'differs'}
                  </Tag>
                </td>
              </tr>
            );
          })}
        </tbody>
      </HTMLTable>
    </div>
  );
}
