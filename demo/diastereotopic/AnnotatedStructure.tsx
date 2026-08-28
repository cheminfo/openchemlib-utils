import { Card, Tag } from '@blueprintjs/core';
import { useMemo } from 'react';

import { StructureThumbnail } from '../components/StructureThumbnail.tsx';
import { NO_ATOM_HIGHLIGHT } from '../components/highlight.ts';

import { fromDisplayAtom, toDisplayAtom } from './topicity.ts';
import type {
  AtomRow,
  DiastereotopicOk,
  DiastereotopicOptionsState,
  HighlightMode,
} from './types.ts';

const STRUCTURE_WIDTH = 430;
const STRUCTURE_HEIGHT = 360;

const HIGHLIGHT_COLORS = {
  hover: '#ffb366',
  selection: '#ffc940',
  diastereotopic: '#a3e635',
  enantiotopic: '#7dd3fc',
  prochiral: '#c4b5fd',
};

const LEGEND: Array<{ color: string; label: string }> = [
  { color: HIGHLIGHT_COLORS.diastereotopic, label: 'diastereotopic' },
  { color: HIGHLIGHT_COLORS.enantiotopic, label: 'enantiotopic' },
  { color: HIGHLIGHT_COLORS.prochiral, label: 'prochiral (r/s)' },
];

interface AnnotatedStructureProps {
  result: DiastereotopicOk;
  options: DiastereotopicOptionsState;
  /** `moleculeWithH` index of the atom under the pointer, in the table or in the drawing. */
  hoveredAtom: number | undefined;
  /** `moleculeWithH` index of the pinned atom; its sibling hydrogens light up with it. */
  selectedAtom: number | undefined;
  /**
   * Atoms of the group hovered or pinned in the group table, already in the index
   * space of the rendered molecule.
   */
  groupAtoms?: number[];
  onHoverAtom: (atom: number | undefined) => void;
  /** Called with `undefined` when the already selected atom is clicked again. */
  onSelectAtom: (atom: number | undefined) => void;
}

/**
 * The rendered structure with the hover, selection and highlight-mode sets.
 * @param props - the analysis result, the options and the hover/selection wiring
 * @returns the structure card
 */
export function AnnotatedStructure(props: AnnotatedStructureProps) {
  const {
    result,
    options,
    hoveredAtom,
    selectedAtom,
    groupAtoms,
    onHoverAtom,
    onSelectAtom,
  } = props;
  const { rows, summary, moleculeForDisplay } = result;
  const { showHydrogens, showAtomNumber, highlightMode } = options;

  const highlight = useMemo(
    () =>
      resolveHighlight({
        rows,
        atomCountMolecule: summary.atomCountMolecule,
        showHydrogens,
        highlightMode,
        hoveredAtom,
        selectedAtom,
        groupAtoms,
      }),
    [
      rows,
      summary.atomCountMolecule,
      showHydrogens,
      highlightMode,
      hoveredAtom,
      selectedAtom,
      groupAtoms,
    ],
  );

  return (
    <Card elevation={0} className="result-card">
      <StructureThumbnail
        molecule={moleculeForDisplay}
        width={STRUCTURE_WIDTH}
        height={STRUCTURE_HEIGHT}
        showAtomNumber={showAtomNumber}
        atomHighlight={highlight.atoms}
        atomHighlightColor={highlight.color}
        atomHighlightOpacity={highlight.opacity}
        onAtomEnter={(atom) => {
          onHoverAtom(atom === undefined ? undefined : fromDisplayAtom(atom));
        }}
        onAtomClick={(atom) => {
          const clicked = fromDisplayAtom(atom);
          onSelectAtom(selectedAtom === clicked ? undefined : clicked);
        }}
      />

      <div className="legend-row">
        {LEGEND.map((entry) => (
          <Tag
            key={entry.label}
            minimal
            style={{ backgroundColor: entry.color }}
          >
            {entry.label}
          </Tag>
        ))}
        <Tag minimal style={{ backgroundColor: HIGHLIGHT_COLORS.selection }}>
          selected
        </Tag>
      </div>

      <div className="muted">
        {`${highlight.source} — ${highlight.atoms.length} atom(s) highlighted`}
        {showHydrogens
          ? ''
          : ' · hydrogens hidden, a hydrogen highlight falls back to its parent heavy atom'}
      </div>
    </Card>
  );
}

interface HighlightInput {
  rows: AtomRow[];
  atomCountMolecule: number;
  showHydrogens: boolean;
  highlightMode: HighlightMode;
  hoveredAtom: number | undefined;
  selectedAtom: number | undefined;
  groupAtoms: number[] | undefined;
}

interface ResolvedHighlight {
  atoms: number[];
  color: string;
  opacity: number;
  source: string;
}

function resolveHighlight(input: HighlightInput): ResolvedHighlight {
  const {
    rows,
    atomCountMolecule,
    showHydrogens,
    highlightMode,
    hoveredAtom,
    selectedAtom,
    groupAtoms,
  } = input;

  function display(atoms: number[]): number[] {
    return toDisplaySet(atoms, rows, atomCountMolecule, showHydrogens);
  }

  if (hoveredAtom !== undefined) {
    return {
      atoms: display([hoveredAtom]),
      color: HIGHLIGHT_COLORS.hover,
      opacity: 0.75,
      source: `hovering atom ${hoveredAtom}`,
    };
  }

  if (groupAtoms !== undefined && groupAtoms.length > 0) {
    return {
      atoms: groupAtoms,
      color: HIGHLIGHT_COLORS.selection,
      opacity: 0.6,
      source: `diaID group of ${groupAtoms.length} atom(s)`,
    };
  }

  if (selectedAtom !== undefined) {
    const siblings = rows[selectedAtom]?.siblings ?? [];
    return {
      atoms: display([selectedAtom, ...siblings]),
      color: HIGHLIGHT_COLORS.selection,
      opacity: 0.65,
      source: `atom ${selectedAtom} and its ${siblings.length} sibling H`,
    };
  }

  if (highlightMode === 'none') {
    return {
      atoms: NO_ATOM_HIGHLIGHT,
      color: HIGHLIGHT_COLORS.selection,
      opacity: 0.45,
      source: 'no highlight',
    };
  }

  const atoms: number[] = [];
  for (const row of rows) {
    if (matchesMode(row, highlightMode)) atoms.push(row.atom);
  }
  return {
    atoms: display(atoms),
    color: HIGHLIGHT_COLORS[highlightMode],
    opacity: 0.45,
    source: `${highlightMode} H`,
  };
}

function matchesMode(row: AtomRow, mode: HighlightMode): boolean {
  if (mode === 'prochiral') return row.prochirality !== undefined;
  return row.topicity === mode;
}

// Highlights are matched by atom id against the *rendered* molecule, so a set built in
// `moleculeWithH` space must be mapped and deduplicated before it reaches react-ocl.
function toDisplaySet(
  atoms: number[],
  rows: AtomRow[],
  atomCountMolecule: number,
  showHydrogens: boolean,
): number[] {
  const displayed = [
    ...new Set(
      atoms
        .map((atom) =>
          toDisplayAtom(atom, rows, atomCountMolecule, showHydrogens),
        )
        .filter((atom) => atom !== undefined),
    ),
  ];
  return displayed.length > 0 ? displayed : NO_ATOM_HIGHLIGHT;
}
