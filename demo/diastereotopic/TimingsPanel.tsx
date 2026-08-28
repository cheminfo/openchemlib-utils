import { Callout, Card, HTMLTable } from '@blueprintjs/core';
import { useMemo } from 'react';

import { TableHead } from '../components/TableHead.tsx';

import type { DiastereotopicOk } from './types.ts';

const BAR_COLOR = '#2d72d2';

interface ReferenceRow {
  molecule: string;
  atoms: number;
  diaIDs: string;
  enantioIDs: string;
  hoseCodes: string;
}

const REFERENCE_ROWS: ReferenceRow[] = [
  {
    molecule: 'ethanol',
    atoms: 9,
    diaIDs: '3 ms',
    enantioIDs: '0.7 ms',
    hoseCodes: '9 ms',
  },
  {
    molecule: 'glucose',
    atoms: 24,
    diaIDs: '12 ms',
    enantioIDs: '4.5 ms',
    hoseCodes: '34 ms',
  },
  {
    molecule: 'cholesterol',
    atoms: 74,
    diaIDs: '105 ms',
    enantioIDs: '38 ms',
    hoseCodes: '104 ms',
  },
  {
    molecule: 'cyclosporin',
    atoms: 196,
    diaIDs: '842 ms',
    enantioIDs: '313 ms',
    hoseCodes: '254 ms',
  },
];

const REFERENCE_HEADERS = [
  'molecule',
  'atoms w/ H',
  'diaIDs',
  'enantioIDs',
  'hoseCodes',
];
const STEP_HEADERS = ['step', 'ms', 'share'];

interface TimingsPanelProps {
  result: DiastereotopicOk;
}

/**
 * Per-step cost of the analysis, with the reference figures of four known molecules.
 * @param props - the successful analysis holding the measured steps
 * @returns the timings panel
 */
export function TimingsPanel(props: TimingsPanelProps) {
  const { result } = props;
  const { timings } = result;
  const { maxMs, totalMs } = useMemo(() => summarize(timings), [timings]);

  return (
    <div className="tab-body">
      <Callout intent="none" icon="info-sign" title="Reference figures">
        <HTMLTable compact>
          <TableHead headers={REFERENCE_HEADERS} />
          <tbody>
            {REFERENCE_ROWS.map((row) => (
              <tr key={row.molecule}>
                <td>{row.molecule}</td>
                <td className="mono">{row.atoms}</td>
                <td className="mono">{row.diaIDs}</td>
                <td className="mono">{row.enantioIDs}</td>
                <td className="mono">{row.hoseCodes}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
        <p>
          <code>getHoseCodesForPath</code> is in another class entirely: 378 ms
          on cholesterol and 4065 ms on cyclosporin, which is why the HOSE panel
          only runs it on an explicit click.
        </p>
      </Callout>

      <Card>
        <div className="section-title">
          <span>Steps ({timings.length})</span>
          <span className="mono">{formatMs(totalMs)} ms total</span>
        </div>
        {timings.length === 0 ? (
          <span className="muted">
            Nothing was measured for this structure.
          </span>
        ) : (
          <div className="scroll-table">
            <HTMLTable compact striped>
              <TableHead headers={STEP_HEADERS} />
              <tbody>
                {timings.map((timing) => (
                  <tr key={timing.step}>
                    <td className="mono">{timing.step}</td>
                    <td className="mono">{formatMs(timing.ms)}</td>
                    <td style={{ width: '50%' }}>
                      <div
                        style={{
                          height: 8,
                          borderRadius: 2,
                          backgroundColor: BAR_COLOR,
                          width: `${maxMs === 0 ? 0 : (timing.ms / maxMs) * 100}%`,
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>total</th>
                  <th className="mono">{formatMs(totalMs)}</th>
                  <th />
                </tr>
              </tfoot>
            </HTMLTable>
          </div>
        )}
      </Card>
    </div>
  );
}

function summarize(timings: DiastereotopicOk['timings']): {
  maxMs: number;
  totalMs: number;
} {
  let maxMs = 0;
  let totalMs = 0;
  for (const { ms } of timings) {
    totalMs += ms;
    if (ms > maxMs) maxMs = ms;
  }
  return { maxMs, totalMs };
}

function formatMs(ms: number): string {
  return ms.toFixed(ms >= 100 ? 0 : 1);
}
