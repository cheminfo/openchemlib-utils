import { Callout } from '@blueprintjs/core';
import type { Molecule } from 'openchemlib';
import { useMemo, useState } from 'react';

import { errorMessage } from '../components/errorMessage.ts';
import { useDebouncedValue } from '../components/useDebouncedValue.ts';
import type { TabProps } from '../tabProps.ts';

import { ApplyToMolecule } from './ApplyToMolecule.tsx';
import { EntryDetail } from './EntryDetail.tsx';
import { EntrySearchBar } from './EntrySearchBar.tsx';
import { EntryTable } from './EntryTable.tsx';
import { SearchControls } from './SearchControls.tsx';
import { execute, findEntry, parseMolecule } from './applyRun.ts';
import { AUTO_LABEL_ENTRIES, AUTO_LABEL_ENTRY_ERRORS } from './entries.ts';
import { DEFAULT_RUN_OPTIONS } from './runAutoLabel.ts';
import type {
  AutoLabelSearchState,
  AutoLabelSort,
  AutoLabelSortColumn,
  StructureDirection,
} from './searchEntries.ts';
import {
  DEFAULT_SEARCH_STATE,
  findEntriesContainingQuery,
  findEntriesMatchingMolecule,
  searchEntries,
} from './searchEntries.ts';

const MOLFILE_DEBOUNCE_MS = 250;

const FULL_WIDTH = { gridColumn: '1 / -1' } as const;
const LEFT_COLUMN = { minWidth: 0 } as const;
const RIGHT_COLUMN = {
  position: 'sticky',
  top: 'var(--demo-gap)',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--demo-gap)',
} as const;

/** A run that matched something is what the user came for, so it moves on top. */
const MATCH_FIRST = { order: -1 } as const;

const IDLE_FILTER_TEXT =
  'Draw, paste or pick a structure in the input above to filter the 65 templates by substructure. Every entry stays listed until then.';

interface StructureFilter {
  /** Indices the substructure search matched, or `null` when it did not run. */
  hits: ReadonlySet<number> | null;
  error?: string;
}

/**
 * The autoLabel database tab: filter bar, entry list, and the detail plus
 * runner column.
 * @param props - the shared molfile
 * @returns the whole tab
 */
export function AutoLabelTab(props: TabProps) {
  const { molfile } = props;
  const [search, setSearch] =
    useState<AutoLabelSearchState>(DEFAULT_SEARCH_STATE);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined,
  );

  const settledMolfile = useDebouncedValue(molfile, MOLFILE_DEBOUNCE_MS);
  const parsed = useMemo(() => parseMolecule(settledMolfile), [settledMolfile]);
  const molecule = parsed.molecule;

  const structure = useMemo(
    () =>
      search.structureFilter
        ? runStructureFilter(molecule, search.direction)
        : { hits: null },
    [molecule, search.structureFilter, search.direction],
  );

  const entries = useMemo(
    () => searchEntries(AUTO_LABEL_ENTRIES, search, structure.hits),
    [search, structure.hits],
  );

  const winnerIndex = useMemo(
    () =>
      molecule
        ? execute(molecule, DEFAULT_RUN_OPTIONS).result?.winnerIndex
        : undefined,
    [molecule],
  );

  const selectedEntry = findEntry(selectedIndex);
  const filterIsIdle = search.structureFilter && structure.hits === null;

  function handleClearFilters() {
    setSearch(DEFAULT_SEARCH_STATE);
  }

  function handleSortChange(column: AutoLabelSortColumn) {
    setSearch((previous) => ({
      ...previous,
      sort: nextSort(previous.sort, column),
    }));
  }

  return (
    <div className="tab-body autolabel-layout">
      <div style={FULL_WIDTH}>
        <SearchControls
          search={search}
          onSearchChange={setSearch}
          structureHitCount={structure.hits?.size}
          hasMolecule={molecule !== undefined}
        />
      </div>

      {AUTO_LABEL_ENTRY_ERRORS.length > 0 && (
        <div style={FULL_WIDTH}>
          <Callout intent="danger" title="Some entries could not be decoded">
            <ul>
              {AUTO_LABEL_ENTRY_ERRORS.map((entryError) => (
                <li key={entryError.index}>
                  #{entryError.index} {entryError.label} — {entryError.message}
                </li>
              ))}
            </ul>
          </Callout>
        </div>
      )}

      {structure.error !== undefined && (
        <div style={FULL_WIDTH}>
          <Callout intent="danger" title="The structure filter failed">
            {structure.error}
          </Callout>
        </div>
      )}

      {filterIsIdle && structure.error === undefined && (
        <div style={FULL_WIDTH}>
          <Callout intent="warning" title="The structure filter is idle">
            {parsed.error === undefined
              ? IDLE_FILTER_TEXT
              : `The molecule in the input above cannot be read: ${parsed.error}`}
          </Callout>
        </div>
      )}

      <div style={LEFT_COLUMN}>
        <EntryTable
          entries={entries}
          sort={search.sort}
          onSortChange={handleSortChange}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          structureHits={structure.hits}
          winnerIndex={winnerIndex}
          onClearFilters={handleClearFilters}
          toolbar={
            <EntrySearchBar search={search} onSearchChange={setSearch} />
          }
        />
      </div>

      <div style={RIGHT_COLUMN}>
        {(molecule !== undefined || parsed.error !== undefined) && (
          <div style={winnerIndex === undefined ? undefined : MATCH_FIRST}>
            <ApplyToMolecule
              molfile={settledMolfile}
              parsed={parsed}
              selectedEntry={selectedEntry}
              onSelectEntry={setSelectedIndex}
            />
          </div>
        )}
        <EntryDetail entry={selectedEntry} />
      </div>
    </div>
  );
}

/**
 * Cycles one header through its three states: ascending, descending, then back
 * to the database order.
 * @param sort - the ordering in force
 * @param column - the clicked column
 * @returns the next ordering, `null` for the autoLabel priority order
 */
function nextSort(
  sort: AutoLabelSort | null,
  column: AutoLabelSortColumn,
): AutoLabelSort | null {
  if (sort?.column !== column) {
    return { column, descending: false };
  }
  return sort.descending ? null : { column, descending: true };
}

function runStructureFilter(
  molecule: Molecule | undefined,
  direction: StructureDirection,
): StructureFilter {
  if (!molecule) return { hits: null };
  try {
    const hits =
      direction === 'labelsMyMolecule'
        ? findEntriesMatchingMolecule(molecule)
        : findEntriesContainingQuery(molecule);
    return { hits };
  } catch (error) {
    return { hits: null, error: errorMessage(error) };
  }
}
