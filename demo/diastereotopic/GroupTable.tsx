import {
  Callout,
  HTMLTable,
  Icon,
  NonIdealState,
  Switch,
  Tag,
  Tooltip,
} from '@blueprintjs/core';
import { useMemo, useState } from 'react';

import { CopyableCode } from '../components/CopyableCode.tsx';
import { StructureThumbnail } from '../components/StructureThumbnail.tsx';
import { TableHead } from '../components/TableHead.tsx';
import type { ToggleOption } from '../components/ToggleGroup.tsx';
import { ToggleGroup } from '../components/ToggleGroup.tsx';
import { decodeIdCode } from '../components/decodeIdCode.ts';

import type {
  DiastereotopicOk,
  DiastereotopicOptionsState,
  GroupRow,
} from './types.ts';

type GroupSort = 'count' | 'element' | 'diaID';

interface GroupTableProps {
  result: DiastereotopicOk;
  options: DiastereotopicOptionsState;
  /** Atoms of the hovered group, of the pinned one on leave, `undefined` when neither. */
  onHighlightAtoms?: (atoms: number[] | undefined) => void;
}

const SORTS: Array<ToggleOption<GroupSort>> = [
  { value: 'count', label: 'n desc' },
  { value: 'element', label: 'element' },
  { value: 'diaID', label: 'diaID' },
];

const NONE =
  'getGroupedDiastereotopicAtomIDs() returned nothing for this filter.';

const HEADERS = [
  'diaID',
  'structure',
  'el',
  'n',
  'atoms',
  'existingAtoms (drawn)',
  'existingAtoms (withH)',
  'parent C',
  'att. H',
  'labels',
  'parent labels',
  'H labels',
  'pro',
  'enantioIDs',
];

/** The columns `monoCells` fills, between the fixed head and `enantioIDs`. */
const FIRST_MONO_COLUMN = 4;

/**
 * One row per distinct diaID, with the two `existingAtoms` index spaces side by side.
 * @param props - the analysis result, the current options and the highlight callback
 * @returns the group panel
 */
export function GroupTable(props: GroupTableProps) {
  const { result, options, onHighlightAtoms } = props;
  const [hydrogensOnly, setHydrogensOnly] = useState(false);
  const [sort, setSort] = useState<GroupSort>('count');
  const [pinned, setPinned] = useState<string | undefined>(undefined);

  const groups = hydrogensOnly ? result.hydrogenGroups : result.groups;
  const sorted = useMemo(() => sortGroups(groups, sort), [groups, sort]);
  const pinnedGroup = sorted.find((group) => group.oclID === pinned);

  function highlightOf(group: GroupRow) {
    return options.showHydrogens ? group.atoms : group.existingAtoms;
  }

  function handleClick(group: GroupRow) {
    const next = pinned === group.oclID ? undefined : group;
    setPinned(next?.oclID);
    onHighlightAtoms?.(next && highlightOf(next));
  }

  return (
    <div className="result-card">
      <Callout intent="none" compact icon="info-sign">
        <code>getDiaIDsObject()</code> reports <code>existingAtoms</code> in the{' '}
        <b>drawn</b> molecule (an implicit hydrogen falls back to its parent
        carbon); <code>getGroupedDiastereotopicAtomIDs()</code> reports them in{' '}
        <b>moleculeWithH</b>. Highlight with the first when hydrogens are
        hidden, with the second when they are shown.
      </Callout>
      <div className="chip-row">
        <Switch
          checked={hydrogensOnly}
          label="H groups only"
          onChange={(event) => setHydrogensOnly(event.currentTarget.checked)}
        />
        <ToggleGroup options={SORTS} value={sort} onSelect={setSort} />
        <Tag minimal>
          {sorted.length} of {result.groups.length} groups
        </Tag>
      </div>
      {sorted.length === 0 && (
        <NonIdealState
          icon="graph-remove"
          title="No group"
          description={NONE}
        />
      )}
      {sorted.length > 0 && (
        <div
          className="scroll-table"
          onMouseLeave={() =>
            onHighlightAtoms?.(pinnedGroup && highlightOf(pinnedGroup))
          }
        >
          <HTMLTable compact striped interactive bordered>
            <TableHead headers={HEADERS} />
            <tbody>
              {sorted.map((group) => (
                <tr
                  key={group.oclID}
                  className={group.oclID === pinned ? 'selected' : undefined}
                  style={
                    group.mixedProchirality
                      ? { backgroundColor: 'rgb(205 66 70 / 25%)' }
                      : undefined
                  }
                  onMouseEnter={() => onHighlightAtoms?.(highlightOf(group))}
                  onClick={() => handleClick(group)}
                >
                  <td>
                    {group.mixedProchirality && (
                      <Tooltip content="this group mixes r and s — the algorithm is wrong">
                        <Icon icon="warning-sign" intent="danger" />
                      </Tooltip>
                    )}{' '}
                    <CopyableCode value={group.oclID} label="diaID" />
                  </td>
                  <td>
                    <StructureThumbnail
                      molecule={decodeIdCode(group.oclID)}
                      width={120}
                      height={90}
                      noCarbonLabelWithCustomLabel
                    />
                  </td>
                  <td>{group.atomLabel}</td>
                  <td>{group.counter}</td>
                  {monoCells(group).map((cell, index) => (
                    <td
                      key={HEADERS[FIRST_MONO_COLUMN + index]}
                      className="mono"
                    >
                      {cell}
                    </td>
                  ))}
                  <td>{group.distinctEnantioIDs}</td>
                </tr>
              ))}
            </tbody>
          </HTMLTable>
        </div>
      )}
      {pinnedGroup && (
        <div className="panel">
          <span className="mono">{pinnedGroup.oclID}</span>
          <StructureThumbnail
            molecule={decodeIdCode(pinnedGroup.oclID)}
            width={260}
            height={200}
            noCarbonLabelWithCustomLabel
          />
        </div>
      )}
    </div>
  );
}

function monoCells(group: GroupRow): string[] {
  return [
    list(group.atoms),
    list(group.existingAtoms),
    list(group.groupedExistingAtoms),
    list(group.heavyAtoms),
    list(group.attachedHydrogens),
    labels(group.customLabels),
    labels(group.heavyAtomsCustomLabels),
    labels(group.attachedHydrogensCustomLabels),
    group.prochiralities.map((pro) => pro ?? '–').join(' ') || '—',
  ];
}

function sortGroups(groups: GroupRow[], sort: GroupSort): GroupRow[] {
  if (sort === 'diaID') {
    return groups.toSorted((a, b) => a.oclID.localeCompare(b.oclID));
  }
  if (sort === 'element') {
    return groups.toSorted(
      (a, b) => a.atomLabel.localeCompare(b.atomLabel) || b.counter - a.counter,
    );
  }
  return groups.toSorted(
    (a, b) => b.counter - a.counter || a.atomLabel.localeCompare(b.atomLabel),
  );
}

function list(atoms: number[]): string {
  return atoms.length === 0 ? '—' : atoms.join(' ');
}

function labels(customLabels: string[]): string {
  const kept = customLabels.filter(Boolean);
  return kept.length === 0 ? '—' : kept.join(' ');
}
