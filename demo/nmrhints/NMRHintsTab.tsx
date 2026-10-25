import { Callout, Card } from '@blueprintjs/core';
import { useCallback, useMemo, useState } from 'react';

import { parseMolecule } from '../autolabel/applyRun.ts';
import { useDebouncedValue } from '../components/useDebouncedValue.ts';

import { ChecksTable } from './ChecksTable.tsx';
import { HintDetail } from './HintDetail.tsx';
import { PairInput } from './PairInput.tsx';
import { ReturnedHints } from './ReturnedHints.tsx';
import { TraceTable } from './TraceTable.tsx';
import { analysePair } from './analysePair.ts';
import { HINT_CATALOG } from './hintCatalog.ts';
import type { PairPreset } from './pairPresets.ts';
import { PAIR_PRESETS } from './pairPresets.ts';
import type { PairSide, PairState } from './pairState.ts';
import { drawSide, loadPreset, loadSide, swapSides } from './pairState.ts';

const MOLFILE_DEBOUNCE_MS = 250;
const INITIAL_PRESET =
  PAIR_PRESETS.find((preset) => preset.id === 'pyridine-benzene') ??
  PAIR_PRESETS[0];

const LEFT_COLUMN = { minWidth: 0 } as const;
const RIGHT_COLUMN = {
  position: 'sticky',
  top: 'var(--demo-gap)',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--demo-gap)',
} as const;

const INVALID_COUNT = HINT_CATALOG.filter((entry) =>
  entry.issues.some((issue) => issue.level === 'danger'),
).length;

/**
 * The NMR hints tab: a correct / proposed pair, what `getNMRHints` returns for
 * it, and why every possible hint fired or not.
 * @returns the whole tab
 */
export function NMRHintsTab() {
  const [pair, setPair] = useState<PairState>(() => loadPreset(INITIAL_PRESET));
  const [presetId, setPresetId] = useState(INITIAL_PRESET.id);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined,
  );

  const correctMolfile = useDebouncedValue(
    pair.correct.current,
    MOLFILE_DEBOUNCE_MS,
  );
  const proposedMolfile = useDebouncedValue(
    pair.proposed.current,
    MOLFILE_DEBOUNCE_MS,
  );
  const correct = useMemo(
    () => parseMolecule(correctMolfile),
    [correctMolfile],
  );
  const proposed = useMemo(
    () => parseMolecule(proposedMolfile),
    [proposedMolfile],
  );
  const analysis = useMemo(
    () => analysePair(HINT_CATALOG, correct.molecule, proposed.molecule),
    [correct.molecule, proposed.molecule],
  );
  const selectedTrace = analysis.traces.find(
    (trace) => trace.entry.index === selectedIndex,
  );

  function handlePreset(preset: PairPreset) {
    setPresetId(preset.id);
    setPair((previous) => loadPreset(preset, previous));
  }

  const handleLoad = useCallback((side: PairSide, molfile: string) => {
    setPresetId('');
    setPair((previous) => loadSide(previous, side, molfile));
  }, []);

  const handleDraw = useCallback((side: PairSide, molfile: string) => {
    setPair((previous) => drawSide(previous, side, molfile));
  }, []);

  function handleSwap() {
    setPresetId('');
    setPair(swapSides);
  }

  return (
    <div className="tab-body">
      <Card elevation={1}>
        <PairInput
          pair={pair}
          presetId={presetId}
          onPreset={handlePreset}
          onLoad={handleLoad}
          onDraw={handleDraw}
          onSwap={handleSwap}
        />
      </Card>

      {INVALID_COUNT === 0 ? null : (
        <Callout
          intent="danger"
          title="Some idCodes of the hint list cannot be decoded"
        >
          {`${INVALID_COUNT} hint(s) are marked invalid below; getNMRHints throws as soon as it reaches one of them.`}
        </Callout>
      )}
      {[correct, proposed].map((parsed, position) =>
        parsed.error === undefined ? null : (
          <Callout
            key={position === 0 ? 'correct' : 'proposed'}
            className="error-card"
            intent="danger"
            title={`Cannot read the ${position === 0 ? 'correct' : 'proposed'} structure`}
          >
            {parsed.error}
          </Callout>
        ),
      )}

      <div className="nmrhints-layout">
        <div style={LEFT_COLUMN}>
          <TraceTable
            traces={analysis.traces}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
          />
        </div>
        <div style={RIGHT_COLUMN}>
          <ReturnedHints
            analysis={analysis}
            ready={
              correct.molecule !== undefined && proposed.molecule !== undefined
            }
            onSelect={setSelectedIndex}
          />
          <ChecksTable analysis={analysis} />
          <HintDetail
            trace={selectedTrace}
            correct={correct.molecule}
            proposed={proposed.molecule}
          />
        </div>
      </div>
    </div>
  );
}
