import { Button, HTMLTable, NonIdealState, Tag } from '@blueprintjs/core';
import type { ReactNode } from 'react';
import { MF } from 'react-mf';

import { StructureThumbnail } from '../components/StructureThumbnail.tsx';

import { EntryTableHeader } from './EntryTableHeader.tsx';
import { FamilyTag } from './FamilyTag.tsx';
import type { AutoLabelEntry } from './entries.ts';
import { AUTO_LABEL_ENTRIES } from './entries.ts';
import type { AutoLabelSort, AutoLabelSortColumn } from './searchEntries.ts';

interface EntryTableProps {
  /** Filtered and sorted entries, straight from `searchEntries`. */
  entries: AutoLabelEntry[];
  /** Ordering in force; its header carries the direction caret. */
  sort: AutoLabelSort | null;
  /** Called with the clicked column; headers are inert when it is omitted. */
  onSortChange?: (column: AutoLabelSortColumn) => void;
  /** `entry.index` of the row currently shown in the detail panel. */
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  /** Indices the structure filter matched; `null` or omitted when it is off. */
  structureHits?: ReadonlySet<number> | null;
  /** `entry.index` the last autoLabel run stopped on. */
  winnerIndex?: number;
  /** Resets the whole search state; also drives the empty-state button. */
  onClearFilters?: () => void;
  /** Filters shown in the header row, between the count and the reset button. */
  toolbar?: ReactNode;
}

/**
 * The scrollable list of database entries, one thumbnail per row.
 * @param props - the filtered entries plus the selection, match and reset wiring
 * @returns the entry table, or a non-ideal state when nothing passes the filters
 */
export function EntryTable(props: EntryTableProps) {
  const {
    entries,
    sort,
    onSortChange,
    selectedIndex,
    onSelect,
    structureHits,
    winnerIndex,
    onClearFilters,
    toolbar,
  } = props;
  const total = AUTO_LABEL_ENTRIES.length;

  return (
    <div className="panel">
      <div className="section-title">
        <span>{`showing ${entries.length} of ${total} entries`}</span>
        {toolbar}
        <Button
          size="small"
          variant="minimal"
          icon="reset"
          disabled={!onClearFilters}
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
      </div>
      {entries.length === 0 ? (
        <NonIdealState
          icon="search"
          title="No entry matches"
          description="No database entry passes the current text, weight, atom count, family, query feature and structure filters."
          action={
            <Button
              icon="reset"
              disabled={!onClearFilters}
              onClick={onClearFilters}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className="scroll-table fit-table" style={{ maxHeight: '70vh' }}>
          <HTMLTable compact striped interactive bordered>
            <EntryTableHeader sort={sort} onSortChange={onSortChange} />
            <tbody>
              {entries.map((entry) => (
                <EntryRow
                  key={entry.index}
                  entry={entry}
                  selected={entry.index === selectedIndex}
                  matched={structureHits?.has(entry.index) ?? false}
                  winner={entry.index === winnerIndex}
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

function EntryRow(props: {
  entry: AutoLabelEntry;
  selected: boolean;
  matched: boolean;
  winner: boolean;
  onSelect?: (index: number) => void;
}) {
  const { entry, selected, matched, winner, onSelect } = props;
  const partial = entry.labelledAtomCount < entry.atomCount;

  return (
    <tr
      className={selected ? 'selected' : undefined}
      onClick={() => onSelect?.(entry.index)}
    >
      <td className="mono align-right">{entry.index}</td>
      <td>
        <StructureThumbnail
          molecule={entry.target}
          width={96}
          height={74}
          noCarbonLabelWithCustomLabel
        />
      </td>
      <td>
        <div className="stack-cell">
          <b>{entry.label}</b>
          <span>
            <FamilyTag family={entry.family} />
          </span>
        </div>
      </td>
      <td>
        <div className="stack-cell">
          <MF mf={entry.mf} />
          <span className="muted">{`${entry.mw.toFixed(2)} Da`}</span>
        </div>
      </td>
      <td>
        <div className="stack-cell">
          <span>{entry.atomCount}</span>
          <span>
            <Tag minimal intent={partial ? 'warning' : undefined}>
              {`${entry.labelledAtomCount} / ${entry.atomCount}`}
            </Tag>
          </span>
        </div>
      </td>
      <td>
        <div className="chip-row">
          {entry.hasQueryFeatures && (
            <Tag minimal intent="warning">
              query
            </Tag>
          )}
          {matched && <Tag intent="success">match</Tag>}
          {winner && <Tag intent="primary">winner</Tag>}
        </div>
      </td>
    </tr>
  );
}
