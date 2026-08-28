import {
  Button,
  HTMLTable,
  InputGroup,
  NonIdealState,
  Tag,
} from '@blueprintjs/core';
import { useMemo, useState } from 'react';

import { CopyableCode } from '../components/CopyableCode.tsx';
import { TableHead } from '../components/TableHead.tsx';
import { ToggleGroup } from '../components/ToggleGroup.tsx';
import { truncateIdCode } from '../components/truncateIdCode.ts';

import type { AtomQuickFilter } from './atomColumns.ts';
import {
  ATOM_QUICK_FILTERS,
  TOPICITY_TAGS,
  filterAtomRows,
  isSaturatedSphere,
} from './atomColumns.ts';
import type { AtomRow } from './types.ts';

const FIXED_HEADERS = [
  'atom',
  'parent',
  'rank',
  'diaID',
  'topicity',
  'label',
  'nEquiv',
  'att. H',
];

interface AtomTableProps {
  /** One row per `moleculeWithH` atom. */
  rows: AtomRow[];
  /** Sphere numbers of `row.hoseCodes`; `undefined` hides the HOSE columns. */
  spheres: number[] | undefined;
  selectedAtom: number | undefined;
  onSelectAtom: (atom: number | undefined) => void;
  onHoverAtom: (atom: number | undefined) => void;
}

/**
 * Every identifier the analysis produced, one row per `moleculeWithH` atom.
 * @param props - the rows, the HOSE spheres and the hover / selection wiring
 * @returns the filterable atom table
 */
export function AtomTable(props: AtomTableProps) {
  const { rows, spheres, selectedAtom, onSelectAtom, onHoverAtom } = props;
  const [query, setQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<AtomQuickFilter>('all');

  const shownRows = useMemo(
    () => filterAtomRows(rows, query, quickFilter),
    [rows, query, quickFilter],
  );
  const headers = useMemo(
    () => [...FIXED_HEADERS, ...(spheres ?? []).map((sphere) => `s${sphere}`)],
    [spheres],
  );

  function clearFilters() {
    setQuery('');
    setQuickFilter('all');
  }

  return (
    <div className="result-card">
      <div className="chip-row">
        <InputGroup
          leftIcon="search"
          placeholder="# · element · diaID · enantioID · label"
          value={query}
          onValueChange={setQuery}
          rightElement={
            query === '' ? undefined : (
              <Button
                icon="cross"
                variant="minimal"
                size="small"
                onClick={() => setQuery('')}
              />
            )
          }
        />
        <ToggleGroup
          options={ATOM_QUICK_FILTERS}
          value={quickFilter}
          onSelect={setQuickFilter}
        />
        <Tag minimal>
          {shownRows.length} / {rows.length} atoms
        </Tag>
      </div>

      {shownRows.length === 0 ? (
        <NonIdealState
          icon="filter-remove"
          title="No atom matches"
          description={`showing 0 of ${rows.length} atoms`}
          action={<Button onClick={clearFilters}>Clear filters</Button>}
        />
      ) : (
        <div className="scroll-table" style={{ maxHeight: '60vh' }}>
          <HTMLTable compact striped interactive bordered>
            <TableHead headers={headers} />
            <tbody onMouseLeave={() => onHoverAtom(undefined)}>
              {shownRows.map((row) => {
                const topicity = TOPICITY_TAGS[row.topicity];
                return (
                  <tr
                    key={row.atom}
                    className={
                      selectedAtom === row.atom ? 'selected' : undefined
                    }
                    onMouseEnter={() => onHoverAtom(row.atom)}
                    onClick={() =>
                      onSelectAtom(
                        selectedAtom === row.atom ? undefined : row.atom,
                      )
                    }
                  >
                    <td>
                      <div className="stack-cell">
                        <span className="mono">
                          {row.atom} {row.atomLabel}
                        </span>
                        <span className="muted">
                          {row.inMolecule ? 'in mol' : '+H'} · map {row.mapNo}
                        </span>
                      </div>
                    </td>
                    <td className="mono">
                      {row.parent === undefined ? (
                        '—'
                      ) : (
                        <Button
                          variant="minimal"
                          size="small"
                          title="select the parent heavy atom"
                          onClick={(event) => {
                            event.stopPropagation();
                            onSelectAtom(row.parent);
                          }}
                        >
                          {row.parent}
                        </Button>
                      )}
                    </td>
                    <td>
                      <div className="stack-cell mono">
                        <span title="symRank">{row.symRank ?? '—'}</span>
                        <span className="muted" title="finalRank">
                          {row.finalRank ?? '—'}
                        </span>
                      </div>
                    </td>
                    <IdCodeCell
                      diaID={row.diaID}
                      enantioID={row.enantioID}
                      differs={row.diaDiffersFromEnantio}
                    />
                    <td>
                      <div className="stack-cell">
                        {topicity ? (
                          <span>
                            <Tag minimal intent={topicity.intent}>
                              {topicity.label}
                            </Tag>
                          </span>
                        ) : null}
                        {row.prochirality === undefined ? null : (
                          <strong>{row.prochirality}</strong>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="stack-cell">
                        <span>{row.labelled ? '✓' : ''}</span>
                        <span className="mono">{row.customLabel ?? ''}</span>
                      </div>
                    </td>
                    <td className="mono">{row.nbEquivalentAtoms ?? '—'}</td>
                    <td className="mono">
                      {row.attachedHydrogens
                        ? `[${row.attachedHydrogens.join(', ')}]`
                        : '—'}
                    </td>
                    {spheres?.map((sphere, index) => (
                      <td
                        key={sphere}
                        className={
                          isSaturatedSphere(row.hoseCodes, index)
                            ? 'mono hose-saturated'
                            : 'mono'
                        }
                        title={row.hoseCodes?.[index]}
                      >
                        {truncateIdCode(row.hoseCodes?.[index], 10)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </HTMLTable>
        </div>
      )}
    </div>
  );
}

function IdCodeCell(props: {
  diaID: string | undefined;
  enantioID: string | undefined;
  differs: boolean;
}) {
  const { diaID, enantioID, differs } = props;
  if (!diaID) {
    return <td className="mono muted">—</td>;
  }
  return (
    <td>
      <div className="stack-cell">
        <CopyableCode value={diaID} label="diaID" length={12} />
        {differs && enantioID ? (
          <span className="chip-row">
            <Tag minimal intent="primary">
              ≠
            </Tag>
            <CopyableCode
              value={enantioID}
              label="enantioID"
              length={12}
              muted
            />
          </span>
        ) : null}
      </div>
    </td>
  );
}
