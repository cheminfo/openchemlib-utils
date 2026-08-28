import { Callout, H4, NonIdealState, Tag } from '@blueprintjs/core';
import { useMemo, useState } from 'react';
import { MF } from 'react-mf';

import { CodeBlock } from '../components/CodeBlock.tsx';
import { CodeDialog } from '../components/CodeDialog.tsx';
import { StructureThumbnail } from '../components/StructureThumbnail.tsx';
import type { ToggleOption } from '../components/ToggleGroup.tsx';
import { ToggleGroup } from '../components/ToggleGroup.tsx';
import { NO_ATOM_HIGHLIGHT } from '../components/highlight.ts';
import { useElementWidth } from '../components/useElementWidth.ts';

import { EntryLabelTable } from './EntryLabelTable.tsx';
import { FamilyTag } from './FamilyTag.tsx';
import type { AutoLabelEntry, EntryLabelMode } from './entries.ts';
import { getEntryDisplayMolecule } from './entries.ts';
import { KNOWN_ISSUES } from './knownIssues.ts';

interface EntryDetailProps {
  entry: AutoLabelEntry | undefined;
}

const LABEL_MODES: Array<ToggleOption<EntryLabelMode>> = [
  { value: 'stored', label: 'as stored' },
  { value: 'normalised', label: 'normalised' },
  { value: 'hidden', label: 'hidden' },
];

const DEPICTION_MIN_WIDTH = 330;
const DEPICTION_RATIO = 0.62;
const DEPICTION_MIN_HEIGHT = 300;
const DEPICTION_MAX_HEIGHT = 480;

const depictionBoxStyle = { width: '100%' } as const;

/**
 * Everything known about one database entry: depiction, per-atom custom labels,
 * known defects and the raw record.
 * @param props - the entry to inspect, or `undefined` when nothing is selected
 * @returns the detail panel
 */
export function EntryDetail(props: EntryDetailProps) {
  const { entry } = props;
  const [mode, setMode] = useState<EntryLabelMode>('stored');
  const [hoveredAtom, setHoveredAtom] = useState<number | undefined>(undefined);
  const [depictionRef, depictionWidth] = useElementWidth(DEPICTION_MIN_WIDTH);

  const highlight = useMemo(
    () => (hoveredAtom === undefined ? NO_ATOM_HIGHLIGHT : [hoveredAtom]),
    [hoveredAtom],
  );

  if (!entry) {
    return (
      <NonIdealState
        icon="th-list"
        title="No entry selected"
        description="Pick a row in the table to inspect its structure, its custom labels and its known defects."
      />
    );
  }

  const issues = KNOWN_ISSUES[entry.label];
  const width = Math.max(depictionWidth, DEPICTION_MIN_WIDTH);
  const height = Math.min(
    Math.max(Math.round(width * DEPICTION_RATIO), DEPICTION_MIN_HEIGHT),
    DEPICTION_MAX_HEIGHT,
  );

  return (
    <div className="result-card">
      <div>
        <H4>{entry.label}</H4>
        <div className="chip-row">
          <FamilyTag family={entry.family} />
          <Tag minimal>#{entry.index}</Tag>
          <Tag minimal>
            <MF mf={entry.mf} />
          </Tag>
          <Tag minimal>{entry.mw.toFixed(3)} Da</Tag>
          <Tag minimal>{entry.atomCount} atoms</Tag>
          <Tag
            minimal
            intent={
              entry.labelledAtomCount < entry.atomCount ? 'warning' : 'success'
            }
          >
            {entry.labelledAtomCount} / {entry.atomCount} labelled
          </Tag>
          {entry.hasQueryFeatures ? (
            <Tag minimal intent="warning">
              query features
            </Tag>
          ) : null}
          <CodeDialog
            title={`#${entry.index} ${entry.label} — raw record`}
            buttonText="Raw record"
          >
            <div className="result-card">
              <CodeBlock label="idCode" code={entry.idCode} maxHeight={120} />
              <CodeBlock
                label="coordinates"
                code={entry.coordinates}
                maxHeight={120}
              />
              <CodeBlock
                label="shipped entry"
                code={toJson(entry)}
                maxHeight={320}
              />
            </div>
          </CodeDialog>
        </div>
      </div>

      <div className="panel">
        <div className="filter-row">
          <span className="filter-label">labels</span>
          <ToggleGroup
            size="small"
            options={LABEL_MODES}
            value={mode}
            onSelect={setMode}
          />
        </div>
        <div ref={depictionRef} style={depictionBoxStyle}>
          <StructureThumbnail
            molecule={getEntryDisplayMolecule(entry, mode)}
            width={width}
            height={height}
            atomHighlight={highlight}
            onAtomEnter={setHoveredAtom}
          />
        </div>
      </div>

      <EntryLabelTable
        entry={entry}
        hoveredAtom={hoveredAtom}
        onHoverAtom={setHoveredAtom}
      />

      {issues ? (
        <Callout intent="warning" title="Known issues">
          <ul>
            {issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        </Callout>
      ) : null}
    </div>
  );
}

function toJson(entry: AutoLabelEntry): string {
  return JSON.stringify(
    {
      idCode: entry.idCode,
      coordinates: entry.coordinates,
      mf: entry.mf,
      mw: entry.mw,
      label: entry.label,
    },
    null,
    2,
  );
}
