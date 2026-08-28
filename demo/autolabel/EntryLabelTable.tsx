import { HTMLTable, Switch } from '@blueprintjs/core';
import { useMemo, useState } from 'react';

import { TableHead } from '../components/TableHead.tsx';

import type { AutoLabelEntry } from './entries.ts';
import { normalizeLabel } from './entries.ts';

interface EntryLabelTableProps {
  entry: AutoLabelEntry;
  /** Atom the pointer is on, wherever it entered from. */
  hoveredAtom: number | undefined;
  onHoverAtom: (atom: number | undefined) => void;
}

interface LabelRow {
  atom: number;
  element: string;
  raw: string | null;
  normalised: string;
  hydrogens: number;
  neighbours: number[];
}

const HEADERS = ['atom', 'label', 'nH', 'neighbours'];
const COLUMN_WIDTHS = ['4.5em', 'auto', '3em', '38%'];

/**
 * The custom label of every atom of one entry, hovering in step with the depiction.
 * @param props - the entry and the hover wiring it shares with the structure
 * @returns the label table
 */
export function EntryLabelTable(props: EntryLabelTableProps) {
  const { entry, hoveredAtom, onHoverAtom } = props;
  const [labelledOnly, setLabelledOnly] = useState(true);

  const rows = useMemo(() => buildLabelRows(entry), [entry]);
  const shownRows = labelledOnly ? rows.filter((row) => row.raw) : rows;

  return (
    <>
      <div className="section-title">
        <span>Custom labels</span>
        <Switch
          checked={labelledOnly}
          label="labelled atoms only"
          onChange={(event) => setLabelledOnly(event.currentTarget.checked)}
        />
      </div>
      <div className="scroll-table fit-table">
        <HTMLTable compact striped bordered>
          <colgroup>
            {COLUMN_WIDTHS.map((width, index) => (
              <col key={HEADERS[index]} style={{ width }} />
            ))}
          </colgroup>
          <TableHead headers={HEADERS} />
          <tbody onMouseLeave={() => onHoverAtom(undefined)}>
            {shownRows.map((row) => (
              <tr
                key={row.atom}
                className={hoveredAtom === row.atom ? 'selected' : undefined}
                onMouseEnter={() => onHoverAtom(row.atom)}
              >
                <td>
                  <div className="stack-cell">
                    <span>{row.atom}</span>
                    <span className="muted">{row.element}</span>
                  </div>
                </td>
                <td>
                  {row.raw ? (
                    <div className="stack-cell">
                      <span className="mono">{row.raw}</span>
                      {row.normalised === row.raw ? null : (
                        <span className="mono muted">{row.normalised}</span>
                      )}
                    </div>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
                <td>{row.hydrogens}</td>
                <td className="mono">{row.neighbours.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      </div>
    </>
  );
}

function buildLabelRows(entry: AutoLabelEntry): LabelRow[] {
  const molecule = entry.target;
  const rows: LabelRow[] = [];
  for (let atom = 0; atom < entry.atomCount; atom++) {
    const connCount = molecule.getConnAtoms(atom);
    const neighbours = new Array<number>(connCount);
    for (let index = 0; index < connCount; index++) {
      neighbours[index] = molecule.getConnAtom(atom, index);
    }
    const raw = entry.rawLabels[atom];
    rows.push({
      atom,
      element: molecule.getAtomLabel(atom),
      raw,
      normalised: raw ? normalizeLabel(raw) : '',
      hydrogens: molecule.getAllHydrogens(atom),
      neighbours,
    });
  }
  return rows;
}
