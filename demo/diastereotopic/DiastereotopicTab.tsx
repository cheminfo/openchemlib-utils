import type { TabId } from '@blueprintjs/core';
import { Button, Callout, NonIdealState } from '@blueprintjs/core';
import { Molecule } from 'openchemlib';
import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';

import { useDebouncedValue } from '../components/useDebouncedValue.ts';
import { useDeferredRun } from '../components/useDeferredRun.ts';
import type { TabProps } from '../tabProps.ts';

import { AnnotatedStructure } from './AnnotatedStructure.tsx';
import { MolfileDialog } from './MolfileDialog.tsx';
import { OptionsBar } from './OptionsBar.tsx';
import { PanelTabs } from './PanelTabs.tsx';
import { AnalysisError, LoggerCard } from './ResultStates.tsx';
import { SummaryCard } from './SummaryCard.tsx';
import { computeDiastereotopic } from './computeDiastereotopic.ts';
import type {
  DiastereotopicOptionsState,
  DiastereotopicResult,
} from './types.ts';
import { DEFAULT_DIASTEREOTOPIC_OPTIONS } from './types.ts';

interface ComputeRequest {
  molfile: string;
  options: DiastereotopicOptionsState;
}

const AUTO_COMPUTE_ATOM_LIMIT = 120;
const EMPTY_RESULT: DiastereotopicResult = { kind: 'empty' };
const DIM: CSSProperties = { opacity: 0.55 };
const STICKY: CSSProperties = {
  position: 'sticky',
  top: 12,
  alignSelf: 'start',
};

/**
 * Owns the options, the hovered / selected atom and the five analysis panels.
 * @param props - the molfile of the shared molecule input
 * @returns the diastereotopic tab
 */
export function DiastereotopicTab(props: TabProps) {
  const { molfile } = props;
  const debouncedMolfile = useDebouncedValue(molfile, 300);
  const [options, setOptions] = useState(DEFAULT_DIASTEREOTOPIC_OPTIONS);
  const [committed, setCommitted] = useState<ComputeRequest | undefined>(
    undefined,
  );
  const [panel, setPanel] = useState<TabId>('atoms');
  const [hoveredAtom, setHoveredAtom] = useState<number | undefined>(undefined);
  const [selectedAtom, setSelectedAtom] = useState<number | undefined>(
    undefined,
  );
  const [groupAtoms, setGroupAtoms] = useState<number[] | undefined>(undefined);
  const [pending, setPending] = useState(false);
  const deferRun = useDeferredRun();

  const atomEstimate = useMemo(
    () => estimateAtomCount(debouncedMolfile),
    [debouncedMolfile],
  );
  const oversized = atomEstimate > AUTO_COMPUTE_ATOM_LIMIT;
  const auto = options.autoCompute && !oversized;

  const activeMolfile = auto ? debouncedMolfile : committed?.molfile;
  const activeOptions = auto ? options : committed?.options;

  const result = useMemo(
    () =>
      activeMolfile === undefined || activeOptions === undefined
        ? EMPTY_RESULT
        : computeDiastereotopic(activeMolfile, activeOptions),
    [activeMolfile, activeOptions],
  );

  const usedOptions = activeOptions ?? options;
  const stale =
    !auto && (activeMolfile !== debouncedMolfile || activeOptions !== options);

  function commit() {
    setPending(true);
    deferRun(() => {
      setPending(false);
      setCommitted({ molfile: debouncedMolfile, options });
    });
  }

  function handleOptionsChange(patch: Partial<DiastereotopicOptionsState>) {
    setOptions((current) => ({ ...current, ...patch }));
  }

  if (!molfile.trim()) {
    return (
      <NonIdealState
        icon="draw"
        title="No structure"
        description="Draw a structure above, paste a SMILES or molfile, or pick a preset."
      />
    );
  }

  return (
    <div className="tab-body">
      <div className="diastereotopic-layout">
        <div className="result-card" style={STICKY}>
          <OptionsBar
            options={options}
            onChange={handleOptionsChange}
            onComputeNow={commit}
            onReset={() => {
              setOptions(DEFAULT_DIASTEREOTOPIC_OPTIONS);
            }}
          />

          {oversized && (
            <Callout
              intent="warning"
              icon="warning-sign"
              title="Over the auto-compute size guard"
            >
              {`${atomEstimate} atoms with hydrogens, over ${AUTO_COMPUTE_ATOM_LIMIT}. The whole analysis runs synchronously on the main thread: diaIDs alone cost 105 ms at 74 atoms and 842 ms at 196.`}
              <div className="chip-row">
                <Button
                  intent="warning"
                  icon="play"
                  size="small"
                  loading={pending}
                  onClick={commit}
                >
                  Compute anyway
                </Button>
              </div>
            </Callout>
          )}

          {stale && !oversized && (
            <Callout intent="primary" icon="refresh" title="Options are stale">
              autoCompute is off, so the panels still show the previous
              analysis.
              <div className="chip-row">
                <Button
                  intent="primary"
                  icon="play"
                  size="small"
                  loading={pending}
                  onClick={commit}
                >
                  Compute now
                </Button>
              </div>
            </Callout>
          )}

          {result.kind === 'ok' && (
            <>
              <AnnotatedStructure
                result={result}
                options={usedOptions}
                hoveredAtom={hoveredAtom}
                selectedAtom={selectedAtom}
                groupAtoms={panel === 'groups' ? groupAtoms : undefined}
                onHoverAtom={setHoveredAtom}
                onSelectAtom={setSelectedAtom}
              />
              <div className="chip-row">
                <MolfileDialog result={result} />
              </div>
              <SummaryCard
                result={result}
                options={usedOptions}
                pending={pending}
              />
              {result.logs.length > 0 && <LoggerCard logs={result.logs} />}
            </>
          )}
        </div>

        <div style={stale ? DIM : undefined}>
          {result.kind === 'error' && <AnalysisError error={result} />}

          {result.kind === 'empty' && (
            <NonIdealState
              icon={pending ? 'calculator' : 'play'}
              title={pending ? 'Analysing…' : 'Nothing computed yet'}
              description="autoCompute is off or the molecule is over the size guard — press Compute to run the analysis."
            />
          )}

          {result.kind === 'ok' && (
            <PanelTabs
              result={result}
              options={usedOptions}
              panel={panel}
              selectedAtom={selectedAtom}
              onPanelChange={setPanel}
              onSelectAtom={setSelectedAtom}
              onHoverAtom={setHoveredAtom}
              onOptionsChange={handleOptionsChange}
              onHighlightAtoms={setGroupAtoms}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// The size guard needs the hydrogen-expanded atom count before the expensive
// analysis runs, so the molfile is parsed a second time on a throw-away copy.
function estimateAtomCount(molfile: string): number {
  if (!molfile.trim()) return 0;
  try {
    const molecule = Molecule.fromMolfile(molfile).getCompactCopy();
    molecule.addImplicitHydrogens();
    return molecule.getAllAtoms();
  } catch {
    return 0;
  }
}
