import {
  Button,
  Callout,
  HTMLTable,
  NonIdealState,
  NumericInput,
  Spinner,
  Tag,
} from '@blueprintjs/core';
import { useState } from 'react';

import type { HosesForPath } from '../../src/topic/getCanonizedHoseCodesForPaths.ts';
import { StructureThumbnail } from '../components/StructureThumbnail.tsx';
import { TableHead } from '../components/TableHead.tsx';
import { decodeIdCode } from '../components/decodeIdCode.ts';
import { errorMessage } from '../components/errorMessage.ts';
import { truncateIdCode } from '../components/truncateIdCode.ts';
import { useDeferredRun } from '../components/useDeferredRun.ts';

import { isSaturatedSphere } from './atomColumns.ts';
import type { DiastereotopicOk, DiastereotopicOptionsState } from './types.ts';

type PathState =
  | { status: 'idle' | 'running' }
  | { status: 'done'; entries: HosesForPath[]; ms: number }
  | { status: 'error'; message: string };

interface HosePanelProps {
  result: DiastereotopicOk;
  options: DiastereotopicOptionsState;
  selectedAtom: number | undefined;
  onOptionsChange: (partial: Partial<DiastereotopicOptionsState>) => void;
  onHoverAtom?: (atom: number | undefined) => void;
  onSelectAtom?: (atom: number) => void;
}

const MAX_PATH_ROWS = 400;
const OFF_NOTE =
  'They cost roughly as much as diaIDs again — 104 ms on cholesterol, 254 ms on cyclosporin — and the getter has no maxNbAtoms guard, so it runs even on a molecule the library has refused to analyse.';

/**
 * Per-sphere HOSE codes of the selected atom, the atom × sphere matrix and the
 * explicit `getHoseCodesForPath` runner.
 * @param props - the analysis result, the options and the atom hover / select wiring
 * @returns the HOSE panel
 */
export function HosePanel(props: HosePanelProps) {
  const { result, options, selectedAtom, onOptionsChange } = props;
  const { onHoverAtom, onSelectAtom } = props;
  const [minPathLength, setMinPathLength] = useState(2);
  const [maxPathLength, setMaxPathLength] = useState(3);
  const [paths, setPaths] = useState<PathState>({ status: 'idle' });
  const deferRun = useDeferredRun();

  function runPaths() {
    setPaths({ status: 'running' });
    deferRun(() => {
      const start = performance.now();
      try {
        const entries = result.topicMolecule.getHoseCodesForPath({
          minPathLength,
          maxPathLength: Math.min(maxPathLength, options.maxPathLength),
        });
        setPaths({ status: 'done', entries, ms: performance.now() - start });
      } catch (error) {
        setPaths({ status: 'error', message: errorMessage(error) });
      }
    });
  }

  const matrix = result.hoseCodes;
  if (!matrix) {
    return (
      <NonIdealState
        icon="calculator"
        title="HOSE codes are not computed"
        description={OFF_NOTE}
        action={
          <Button
            intent="primary"
            text="Compute HOSE codes"
            onClick={() => onOptionsChange({ computeHoseCodes: true })}
          />
        }
      />
    );
  }

  const codes = selectedAtom === undefined ? undefined : matrix[selectedAtom];
  const running = paths.status === 'running';
  const rows = flatten(paths.status === 'done' ? paths.entries : []);
  const shown = rows.filter(
    (row) => selectedAtom === undefined || row.atom === selectedAtom,
  );
  const bounds = { min: 0, max: options.maxPathLength, disabled: running };

  return (
    <div className="result-card">
      <div className="section-title">Spheres of atom {selectedAtom ?? '—'}</div>
      {!codes && (
        <Callout intent="none" compact icon="info-sign">
          Pick an atom in the table below. A greyed sphere is identical to the
          previous one — the code is saturated.
        </Callout>
      )}
      {codes && (
        <div className="chip-row">
          {result.spheres.map((sphere, index) => (
            <div key={sphere} className={`panel ${sat(codes, index) ?? ''}`}>
              <StructureThumbnail
                molecule={decodeIdCode(codes[index])}
                width={150}
                height={110}
              />
              <code className="mono">{fragmentSmiles(codes[index])}</code>
              <code className="mono">{`s${sphere} ${codes[index]}`}</code>
            </div>
          ))}
        </div>
      )}
      <div className="section-title">Atom × sphere matrix</div>
      <div className="scroll-table">
        <HTMLTable compact striped interactive bordered>
          <TableHead
            headers={[
              '#',
              'el',
              ...result.spheres.map((sphere) => `s${sphere}`),
            ]}
          />
          <tbody onMouseLeave={() => onHoverAtom?.(undefined)}>
            {result.rows.map((row) => (
              <tr
                key={row.atom}
                className={row.atom === selectedAtom ? 'selected' : undefined}
                onMouseEnter={() => onHoverAtom?.(row.atom)}
                onClick={() => onSelectAtom?.(row.atom)}
              >
                <td className="mono">{row.atom}</td>
                <td>{row.atomLabel}</td>
                {result.spheres.map((sphere, index) => (
                  <td key={sphere} className={sat(matrix[row.atom], index)}>
                    {truncateIdCode(matrix[row.atom]?.[index], 10)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </div>
      <div className="section-title">HOSE codes along paths</div>
      <Callout intent="warning" compact icon="warning-sign">
        The most expensive call in the API — measured <b>378 ms</b> on
        cholesterol and <b>4065 ms</b> on cyclosporin, even restricted to path
        lengths 2 to 3. It runs synchronously and freezes the page, so it is
        never started automatically.
      </Callout>
      <div className="chip-row">
        <span>minPathLength</span>
        <NumericInput
          value={minPathLength}
          {...bounds}
          onValueChange={(value) => setMinPathLength(clamp(value, options))}
        />
        <span>maxPathLength</span>
        <NumericInput
          value={maxPathLength}
          {...bounds}
          onValueChange={(value) => setMaxPathLength(clamp(value, options))}
        />
        <Button
          intent="primary"
          text={running ? 'Computing…' : 'Compute HOSE codes along paths'}
          disabled={running}
          icon={running ? <Spinner size={16} /> : 'play'}
          onClick={runPaths}
        />
        {paths.status === 'done' && (
          <Tag minimal>
            {shown.length} of {rows.length} paths · {paths.ms.toFixed(0)} ms
          </Tag>
        )}
      </div>
      {paths.status === 'error' && (
        <Callout intent="danger" title="getHoseCodesForPath failed">
          {paths.message}
        </Callout>
      )}
      {shown.length > 0 && (
        <div className="scroll-table">
          <HTMLTable compact striped bordered>
            <TableHead
              headers={['from', 'fromDiaID', 'toDiaID', 'len', 'path', 'hoses']}
            />
            <tbody>
              {shown.slice(0, MAX_PATH_ROWS).map((row) => (
                <tr key={`${row.atom}-${row.path.join('-')}`}>
                  <td className="mono">{row.atom}</td>
                  <td className="mono">{truncateIdCode(row.fromDiaID, 10)}</td>
                  <td className="mono">{truncateIdCode(row.toDiaID, 10)}</td>
                  <td>{row.pathLength}</td>
                  <td className="mono">{row.path.join(' ')}</td>
                  <td className="mono">
                    {row.hoses
                      .map((hose) => truncateIdCode(hose, 10))
                      .join(' | ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        </div>
      )}
    </div>
  );
}

function flatten(entries: HosesForPath[]) {
  return entries.flatMap((entry, atom) =>
    entry.paths.map((path) => ({
      atom,
      fromDiaID: entry.fromDiaID,
      ...path,
    })),
  );
}

function fragmentSmiles(idCode: string): string {
  const fragment = decodeIdCode(idCode)?.getCompactCopy();
  fragment?.setFragment(true);
  return fragment?.toIsomericSmiles() ?? '—';
}

function sat(codes: string[] | undefined, index: number) {
  return isSaturatedSphere(codes, index) ? 'hose-saturated' : undefined;
}

function clamp(value: number, options: DiastereotopicOptionsState): number {
  return Math.min(Math.max(value || 0, 0), options.maxPathLength);
}
