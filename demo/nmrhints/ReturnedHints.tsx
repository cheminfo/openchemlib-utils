import {
  Button,
  Callout,
  HTMLTable,
  NonIdealState,
  Tag,
} from '@blueprintjs/core';

import type { PossibleHint } from '../../src/util/getNMRHints.ts';
import { CopyableCode } from '../components/CopyableCode.tsx';
import { TableHead } from '../components/TableHead.tsx';

import type { PairAnalysis } from './analysePair.ts';

const HEADERS = ['#', 'Message', 'Source', 'hash'] as const;

interface ReturnedHintsProps {
  analysis: PairAnalysis;
  /** both structures are drawn, so `getNMRHints` ran */
  ready: boolean;
  onSelect: (index: number) => void;
}

/**
 * What `getNMRHints` actually returned for the pair.
 * @param props - the analysis of the pair and the row selection handler
 * @returns the result panel
 */
export function ReturnedHints(props: ReturnedHintsProps) {
  const { analysis, ready, onSelect } = props;
  const { hints, error, attribution, mismatch } = analysis;

  return (
    <div className="panel">
      <div className="section-title">
        <span>getNMRHints(correct, proposed)</span>
        {hints === undefined ? null : (
          <Tag minimal>{`${hints.length} hints`}</Tag>
        )}
      </div>
      {ready ? null : (
        <NonIdealState
          icon="draw"
          title="Two structures needed"
          description="Pick a pair, or draw or paste both the correct and the proposed structure."
        />
      )}
      {error === undefined ? null : (
        <Callout
          className="error-card"
          intent="danger"
          title="getNMRHints threw"
        >
          {error}
        </Callout>
      )}
      {mismatch === undefined ? null : (
        <Callout intent="warning" title="The trace disagrees with getNMRHints">
          {mismatch}. The trace table below no longer replays the library
          faithfully.
        </Callout>
      )}
      {hints?.length === 0 ? (
        <Callout intent="success" title="No hint">
          getNMRHints returned an empty array for this pair.
        </Callout>
      ) : null}
      {hints === undefined || hints.length === 0 ? null : (
        <>
          <span className="muted">
            In the order getNextNMRHint reveals them, one per call.
          </span>
          <HTMLTable compact striped bordered className="fit-table">
            <TableHead headers={HEADERS} />
            <tbody>
              {hints.map((hint, position) => {
                const index = attribution[position];
                const { remarks } = hint as Partial<PossibleHint>;
                return (
                  <tr key={hint.hash}>
                    <td className="align-right">{position + 1}</td>
                    <td>
                      <div className="stack-cell">
                        <span>{hint.message}</span>
                        {remarks === undefined ? null : (
                          <span>
                            <Tag minimal>{remarks}</Tag>
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {index === undefined ? (
                        <Tag
                          minimal
                          htmlTitle="formula, DBE, stereo, tautomer or symmetry"
                        >
                          global check
                        </Tag>
                      ) : (
                        <Button
                          size="small"
                          variant="minimal"
                          onClick={() => onSelect(index)}
                        >
                          {`fragment #${index}`}
                        </Button>
                      )}
                    </td>
                    <td>
                      <CopyableCode
                        value={String(hint.hash)}
                        label="hash"
                        length={10}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </HTMLTable>
        </>
      )}
    </div>
  );
}
