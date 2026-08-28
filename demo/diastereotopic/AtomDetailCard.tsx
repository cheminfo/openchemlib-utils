import { Callout, Card, Tag } from '@blueprintjs/core';
import type { Molecule } from 'openchemlib';
import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';

import { StructureThumbnail } from '../components/StructureThumbnail.tsx';
import { decodeIdCode } from '../components/decodeIdCode.ts';

import { TOPICITY_TAGS } from './atomColumns.ts';
import type { AtomRow } from './types.ts';

interface AtomDetailCardProps {
  /** The selected row; nothing is rendered when no atom is selected. */
  row: AtomRow | undefined;
  /** Every row, so the siblings of the selected atom can be looked up. */
  rows: AtomRow[];
  /** `topicMolecule.distanceMatrix`, in `moleculeWithH` space. */
  distanceMatrix: number[][];
  /** The option `setProchiralHydrogenLabels` ran with. */
  includeEnantiotopic: boolean;
}

const CARD_ROW: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--demo-gap)',
  alignItems: 'flex-start',
};

/**
 * The decoded diaID and enantioID of the selected atom, the verdict that follows
 * from them, and the two sibling environments when the atom is one of two hydrogens.
 * @param props - the selected row, the other rows, the distance matrix and the labelling option
 * @returns the detail cards, or nothing when no atom is selected
 */
export function AtomDetailCard(props: AtomDetailCardProps) {
  const { row, rows, distanceMatrix, includeEnantiotopic } = props;
  const diaMolecule = decodeIdCode(row?.diaID);
  const enantioMolecule = decodeIdCode(row?.enantioID);
  const diaSmiles = useMemo(() => isomericSmilesOf(diaMolecule), [diaMolecule]);
  const enantioSmiles = useMemo(
    () => isomericSmilesOf(enantioMolecule),
    [enantioMolecule],
  );

  if (!row) return null;

  const sibling = row.siblings.length === 1 ? rows[row.siblings[0]] : undefined;
  const identical = row.diaID !== undefined && row.diaID === row.enantioID;
  const topicity = TOPICITY_TAGS[row.topicity];

  const facts: Array<[string, ReactNode]> = [
    [
      'topicity',
      topicity ? (
        <Tag minimal intent={topicity.intent}>
          {topicity.label}
        </Tag>
      ) : (
        row.topicity
      ),
    ],
    ['pro descriptor', <strong key="pro">{row.prochirality ?? '—'}</strong>],
    ['sibling H', row.siblings.length > 0 ? row.siblings.join(', ') : '—'],
    ['sibling diaID equal?', answer(row, rows, 'diaID')],
    ['sibling enantioID equal?', answer(row, rows, 'enantioID')],
    ['symRank', row.symRank ?? '—'],
    ['finalRank', row.finalRank ?? '—'],
    ['custom label', row.customLabel ?? '—'],
    ['distance to sibling', distances(row, distanceMatrix)],
  ];

  return (
    <div className="result-card">
      <div style={CARD_ROW}>
        <Card className="result-card">
          <div className="section-title">
            <span>diaID</span>
            <Tag minimal>atom {row.atom}</Tag>
          </div>
          <StructureThumbnail
            molecule={diaMolecule}
            width={220}
            height={180}
            noCarbonLabelWithCustomLabel
          />
          <code className="mono">{diaSmiles ?? '—'}</code>
          <code className="mono muted">{row.diaID ?? '—'}</code>
          <div className="muted">
            the interrogated atom is tagged — a heavy atom by mass +5 (
            <code className="mono">[5CH2]</code>), a hydrogen by the pseudo-atom{' '}
            <code className="mono">[X]</code>.
          </div>
        </Card>

        <Card className={identical ? 'result-card muted' : 'result-card'}>
          <div className="section-title">
            <span>enantioID</span>
            {identical ? null : (
              <Tag minimal intent="primary">
                ≠ diaID
              </Tag>
            )}
          </div>
          <StructureThumbnail
            molecule={enantioMolecule}
            width={220}
            height={180}
            noCarbonLabelWithCustomLabel
          />
          <code className="mono">{enantioSmiles ?? '—'}</code>
          <code className="mono muted">{row.enantioID ?? '—'}</code>
          {identical ? (
            <div className="muted">
              identical to diaID — this environment is not chirality-sensitive
            </div>
          ) : null}
        </Card>

        <Card className="result-card">
          <div className="section-title">
            <span>Verdict</span>
          </div>
          <div className="detail-grid">
            {facts.map(([label, value]) => (
              <Fact key={label} label={label} value={value} />
            ))}
          </div>
          {row.topicity === 'enantiotopic' && !includeEnantiotopic ? (
            <Callout intent="primary" compact>
              <code className="mono">setProchiralHydrogenLabels()</code> skips
              this hydrogen by default; turn on{' '}
              <code className="mono">includeEnantiotopic</code> to label it.
            </Callout>
          ) : null}
        </Card>
      </div>

      {sibling ? (
        <Card className="result-card">
          <div className="section-title">
            <span>
              The two hydrogens of atom {row.parent ?? '—'}, side by side
            </span>
            <Tag
              minimal
              intent={row.diaID === sibling.diaID ? 'none' : 'success'}
            >
              {row.diaID === sibling.diaID
                ? 'same diaID'
                : 'different diaIDs — diastereotopic'}
            </Tag>
          </div>
          <div style={CARD_ROW}>
            <SiblingCard row={row} />
            <SiblingCard row={sibling} />
          </div>
        </Card>
      ) : null}
    </div>
  );
}

function Fact(props: { label: string; value: ReactNode }) {
  return (
    <>
      <span className="muted">{props.label}</span>
      <span className="mono">{props.value}</span>
    </>
  );
}

function SiblingCard(props: { row: AtomRow }) {
  const { row } = props;
  return (
    <div className="panel">
      <div className="section-title">
        <span>H {row.atom}</span>
        <Tag minimal>{row.prochirality ?? 'no descriptor'}</Tag>
      </div>
      <StructureThumbnail
        molecule={decodeIdCode(row.diaID)}
        width={220}
        height={180}
        noCarbonLabelWithCustomLabel
      />
      <code className="mono">{row.diaID ?? '—'}</code>
      <span className="mono muted">{row.customLabel ?? 'not labelled'}</span>
    </div>
  );
}

function isomericSmilesOf(molecule: Molecule | undefined): string | undefined {
  if (!molecule) return undefined;
  // The decoded molecule is shared by the whole page, so the copy is mandatory:
  // toIsomericSmiles ensures the helper arrays of whatever it is given.
  return molecule.getCompactCopy().toIsomericSmiles();
}

function answer(
  row: AtomRow,
  rows: AtomRow[],
  key: 'diaID' | 'enantioID',
): string {
  if (row.siblings.length === 0) return '—';
  const reference = row[key];
  if (reference === undefined) return '—';
  for (const siblingAtom of row.siblings) {
    if (rows[siblingAtom]?.[key] !== reference) return 'no';
  }
  return 'yes';
}

function distances(row: AtomRow, distanceMatrix: number[][]): string {
  if (row.siblings.length === 0) return '—';
  const values: string[] = [];
  for (const siblingAtom of row.siblings) {
    const distance = distanceMatrix[row.atom]?.[siblingAtom];
    values.push(distance === undefined ? '?' : String(distance));
  }
  return values.join(', ');
}
