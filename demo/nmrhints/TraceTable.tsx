import { HTMLTable, NonIdealState, Tag } from '@blueprintjs/core';
import { memo, useState } from 'react';

import { StructureThumbnail } from '../components/StructureThumbnail.tsx';
import { TableHead } from '../components/TableHead.tsx';
import {
  scrollIntoViewOnAttach,
  useArrowSelection,
} from '../components/useArrowSelection.ts';

import { FoundTag, IssueTag, StatusTag } from './HintTags.tsx';
import type { HintFragment } from './hintCatalog.ts';
import { STATUS_INFO } from './statusInfo.ts';
import type { HintStatus, HintTrace } from './traceHints.ts';

const HEADERS = [
  '#',
  'Fragment',
  'Hint',
  'anyMatches gate',
  'In correct',
  'In proposed',
  'Status',
] as const;

const ALL_STATUSES = Object.keys(STATUS_INFO) as HintStatus[];

// The fragments never change between two pairs, so their depictions are kept.
const Thumbnail = memo(StructureThumbnail);

interface TraceTableProps {
  traces: HintTrace[];
  /** catalog index of the row shown in the detail panel */
  selectedIndex?: number;
  onSelect: (index: number) => void;
}

/**
 * Every possible hint with each step `getNMRHints` takes to keep or drop it.
 * @param props - the trace of the current pair and the selection wiring
 * @returns the trace table with its status filter
 */
export function TraceTable(props: TraceTableProps) {
  const { traces, selectedIndex, onSelect } = props;
  const [activeStatuses, setActiveStatuses] = useState<ReadonlySet<HintStatus>>(
    () => new Set(),
  );
  const [issuesOnly, setIssuesOnly] = useState(false);

  const counts = countStatuses(traces);
  const issueCount = traces.filter(
    (trace) => trace.entry.issues.length > 0,
  ).length;
  const visible = traces.filter(
    (trace) =>
      (activeStatuses.size === 0 || activeStatuses.has(trace.status)) &&
      (!issuesOnly || trace.entry.issues.length > 0),
  );
  const listRef = useArrowSelection(
    visible.map((trace) => trace.entry.index),
    selectedIndex,
    onSelect,
  );

  function toggleStatus(status: HintStatus) {
    setActiveStatuses((previous) => {
      const next = new Set(previous);
      if (!next.delete(status)) next.add(status);
      return next;
    });
  }

  return (
    <div className="panel">
      <div className="section-title">
        <span>{`Possible hints: showing ${visible.length} of ${traces.length}`}</span>
      </div>
      <div className="chip-row">
        <Tag
          interactive
          minimal={activeStatuses.size > 0}
          onClick={() => setActiveStatuses(new Set())}
        >
          {`all (${traces.length})`}
        </Tag>
        {ALL_STATUSES.filter((status) => counts.has(status)).map((status) => (
          <Tag
            key={status}
            interactive
            minimal={!activeStatuses.has(status)}
            intent={STATUS_INFO[status].intent}
            htmlTitle={STATUS_INFO[status].title}
            onClick={() => toggleStatus(status)}
          >
            {`${STATUS_INFO[status].label} (${counts.get(status)})`}
          </Tag>
        ))}
        <Tag
          interactive
          minimal={!issuesOnly}
          intent="warning"
          htmlTitle="only the hints whose idCodes have a problem"
          onClick={() => setIssuesOnly((previous) => !previous)}
        >
          {`idCode issues (${issueCount})`}
        </Tag>
      </div>
      {visible.length === 0 ? (
        <NonIdealState icon="filter" title="No hint passes the filter" />
      ) : (
        <div
          className="scroll-table fit-table"
          style={{ maxHeight: '75vh' }}
          ref={listRef}
        >
          <HTMLTable compact striped interactive bordered>
            <TableHead headers={HEADERS} />
            <tbody>
              {visible.map((trace) => (
                <TraceRow
                  key={trace.entry.index}
                  trace={trace}
                  selected={trace.entry.index === selectedIndex}
                  onSelect={onSelect}
                />
              ))}
            </tbody>
          </HTMLTable>
        </div>
      )}
    </div>
  );
}

function TraceRow(props: {
  trace: HintTrace;
  selected: boolean;
  onSelect: (index: number) => void;
}) {
  const { trace, selected, onSelect } = props;
  const { entry, gate, inCorrect, inProposed, status } = trace;

  return (
    <tr
      className={selected ? 'selected' : undefined}
      ref={selected ? scrollIntoViewOnAttach : undefined}
      onClick={() => onSelect(entry.index)}
    >
      <td className="mono align-right nowrap">{entry.index}</td>
      <td>
        <FragmentCell fragment={entry.fragment} width={90} height={66} />
      </td>
      <td>
        <div className="stack-cell">
          <span>{entry.hint.message}</span>
          {entry.fragment.smarts === undefined ? null : (
            <span className="mono muted" title="SMARTS of the fragment">
              {entry.fragment.smarts}
            </span>
          )}
          <span className="chip-row">
            {entry.hint.remarks === undefined ? null : (
              <Tag minimal>{entry.hint.remarks}</Tag>
            )}
            {entry.issues.map((issue) => (
              <IssueTag key={issue.label} issue={issue} />
            ))}
          </span>
        </div>
      </td>
      <td>
        {entry.anyMatches.length === 0 ? (
          <span className="muted">none</span>
        ) : (
          <div className="chip-row">
            {entry.anyMatches.map((anyMatch, position) => (
              <div key={anyMatch.idCode} className="stack-cell">
                <FragmentCell fragment={anyMatch} width={60} height={46} />
                <FoundTag found={gate[position]} />
              </div>
            ))}
          </div>
        )}
      </td>
      <td>
        <FoundTag found={inCorrect} />
      </td>
      <td>
        <FoundTag found={inProposed} />
      </td>
      <td>
        <StatusTag status={status} />
      </td>
    </tr>
  );
}

function FragmentCell(props: {
  fragment: HintFragment;
  width: number;
  height: number;
}) {
  const { fragment, width, height } = props;
  if (!fragment.molecule) {
    return (
      <Tag minimal intent="danger" htmlTitle={fragment.error}>
        invalid
      </Tag>
    );
  }
  return (
    <Thumbnail molecule={fragment.molecule} width={width} height={height} />
  );
}

function countStatuses(traces: HintTrace[]): Map<HintStatus, number> {
  const counts = new Map<HintStatus, number>();
  for (const trace of traces) {
    counts.set(trace.status, (counts.get(trace.status) ?? 0) + 1);
  }
  return counts;
}
