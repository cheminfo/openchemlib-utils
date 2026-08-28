import {
  Callout,
  Card,
  HTMLTable,
  NonIdealState,
  Tag,
} from '@blueprintjs/core';

import { TableHead } from '../components/TableHead.tsx';

import type { DiastereotopicOk } from './types.ts';

const PARITY_NAMES: Record<number, string | undefined> = {
  0: 'none',
  1: 'parity1',
  2: 'parity2',
  3: 'unknown',
};

const ESR_NAMES: Record<number, string | undefined> = {
  0: 'abs',
  1: 'and',
  2: 'or',
};

const CIP_NAMES: Record<number, string | undefined> = {
  0: 'none',
  1: 'R/M',
  2: 'S/P',
  3: 'problem',
};

const BOND_HEADERS = [
  'bond',
  'atom1',
  'atom2',
  'type',
  'added by ensure',
  'atom1 parity',
  'atom1 ESR type',
  'atom1 CIP',
];

interface StereoBondPanelProps {
  result: DiastereotopicOk;
  onHoverAtom?: (atom: number | undefined) => void;
  onSelectAtom?: (atom: number) => void;
}

/**
 * Stereo bonds of `moleculeWithH`, marking the ones `ensureHeterotopicChiralBonds` invented.
 * @param props - the successful analysis and the optional hover / selection wiring
 * @returns the stereo bond panel
 */
export function StereoBondPanel(props: StereoBondPanelProps) {
  const { result, onHoverAtom, onSelectAtom } = props;
  const { stereoBonds, chiralOrHeterotopicCarbons, chiralCarbonsError } =
    result;
  const addedCount = countAdded(stereoBonds);

  return (
    <div className="tab-body">
      <Callout intent="warning" icon="warning-sign">
        <code>ensureHeterotopicChiralBonds</code> adds an{' '}
        <strong>arbitrary</strong> up-bond plus{' '}
        <code>setAtomESR(atom, cESRTypeAnd, 0)</code> on every carbon whose four
        neighbours have four distinct symmetry ranks and which carries no stereo
        bond yet. On a pseudoasymmetric centre this invents a parity that
        destroys an internal mirror, so genuinely enantiotopic arms get
        different diaIDs. Rows marked <em>added</em> are the suspects.
      </Callout>

      <Card>
        <div className="section-title">
          <span>Stereo bonds of moleculeWithH ({stereoBonds.length})</span>
          <Tag minimal intent={addedCount > 0 ? 'warning' : undefined}>
            {addedCount} added by ensureHeterotopicChiralBonds
          </Tag>
        </div>
        {stereoBonds.length === 0 ? (
          <NonIdealState
            icon="graph"
            title="No stereo bond"
            description="Neither the drawn structure nor ensureHeterotopicChiralBonds put an up or down bond on this molecule."
          />
        ) : (
          <div className="scroll-table">
            <HTMLTable compact striped bordered interactive>
              <TableHead headers={BOND_HEADERS} />
              <tbody
                onMouseLeave={() => {
                  onHoverAtom?.(undefined);
                }}
              >
                {stereoBonds.map((row) => (
                  <tr
                    key={row.bond}
                    title="Click to select atom1 in the atom table"
                    onMouseEnter={() => {
                      onHoverAtom?.(row.atom1);
                    }}
                    onClick={() => {
                      onSelectAtom?.(row.atom1);
                    }}
                  >
                    <td className="mono">{row.bond}</td>
                    <td className="mono">{row.atom1}</td>
                    <td className="mono">{row.atom2}</td>
                    <td>{row.type}</td>
                    <td>
                      {row.addedByEnsure ? (
                        <Tag minimal intent="warning">
                          added
                        </Tag>
                      ) : (
                        <span className="muted">drawn</span>
                      )}
                    </td>
                    <td className="mono">
                      {describe(row.atom1Parity, PARITY_NAMES)}
                    </td>
                    <td className="mono">
                      {describe(row.atom1EsrType, ESR_NAMES)}
                    </td>
                    <td className="mono">
                      {describe(row.atom1CipParity, CIP_NAMES)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </HTMLTable>
          </div>
        )}
      </Card>

      <Card>
        <div className="section-title">
          <span>
            getChiralOrHeterotopicCarbons ({chiralOrHeterotopicCarbons.length})
          </span>
        </div>
        {chiralCarbonsError === undefined ? null : (
          <Callout intent="danger" compact>
            {chiralCarbonsError}
          </Callout>
        )}
        {chiralOrHeterotopicCarbons.length === 0 ? (
          <span className="muted">
            No carbon of this molecule is chiral or heterotopic.
          </span>
        ) : (
          <div
            className="chip-row"
            onMouseLeave={() => {
              onHoverAtom?.(undefined);
            }}
          >
            {chiralOrHeterotopicCarbons.map((carbon) => (
              <Tag
                key={carbon}
                minimal
                interactive
                intent="primary"
                onMouseEnter={() => {
                  onHoverAtom?.(carbon);
                }}
                onClick={() => {
                  onSelectAtom?.(carbon);
                }}
              >
                C{carbon}
              </Tag>
            ))}
          </div>
        )}
      </Card>

      <Callout
        intent="none"
        icon="info-sign"
        title="Two known library defects this panel is likely to surface"
      >
        <ul>
          <li>
            <code>
              toDiastereotopicSVG(molecule, {'{ heavyAtomHydrogen: true }'})
            </code>{' '}
            throws{' '}
            <code>
              TypeError: molecule.getGroupedDiastereotopicAtomIDs is not a
              function
            </code>{' '}
            — that prototype method no longer exists in openchemlib.
          </li>
          <li>
            openchemlib at 9.22–9.25 cannot represent the pseudoasymmetric
            descriptor: <code>C[C@H](O)[C@H](O)[C@@H](O)C</code> and{' '}
            <code>C[C@H](O)[C@@H](O)[C@@H](O)C</code> both parse to idCode{' '}
            <code>daxL@@IdfYjjiDfP@</code>. A wrong result on such a molecule is
            not a diaID bug.
          </li>
        </ul>
      </Callout>
    </div>
  );
}

function countAdded(stereoBonds: DiastereotopicOk['stereoBonds']): number {
  let count = 0;
  for (const stereoBond of stereoBonds) {
    if (stereoBond.addedByEnsure) count++;
  }
  return count;
}

function describe(
  value: number,
  names: Record<number, string | undefined>,
): string {
  return `${value} · ${names[value] ?? '?'}`;
}
