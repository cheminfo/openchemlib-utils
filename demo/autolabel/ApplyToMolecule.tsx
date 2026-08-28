import {
  Button,
  Callout,
  HTMLSelect,
  InputGroup,
  NonIdealState,
  Switch,
  Tag,
} from '@blueprintjs/core';
import { useMemo, useState } from 'react';

import { RunResult } from './RunResult.tsx';
import type { Algorithm, ParsedMolecule, RunView } from './applyRun.ts';
import {
  ALGORITHMS,
  ALGORITHM_HELP,
  describeFailure,
  execute,
  makeRunKey,
} from './applyRun.ts';
import type { AutoLabelEntry } from './entries.ts';
import type { RunAutoLabelOptions } from './runAutoLabel.ts';

interface ApplyToMoleculeProps {
  /** The settled molfile of the shared input; it identifies a run, nothing more. */
  molfile: string;
  /** That molfile, already parsed by the tab. */
  parsed: ParsedMolecule;
  selectedEntry: AutoLabelEntry | undefined;
  onSelectEntry: (index: number) => void;
}

/**
 * Runs the `autoLabel` loop on the shared molecule and reports which entry won,
 * what it shadowed and whether the result carries duplicate locants.
 * @param props - the molfile, the entry selected in the table and the selection callback
 * @returns the runner panel
 */
export function ApplyToMolecule(props: ApplyToMoleculeProps) {
  const { molfile, parsed, selectedEntry, onSelectEntry } = props;
  const [algorithm, setAlgorithm] = useState<Algorithm>('separated');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [autoRun, setAutoRun] = useState(true);
  const [manual, setManual] = useState<RunView | undefined>(undefined);

  const options = useMemo<RunAutoLabelOptions>(
    () => ({ algorithm, prefix, suffix }),
    [algorithm, prefix, suffix],
  );
  const runKey = makeRunKey(molfile, options);
  const autoView = useMemo<RunView | undefined>(() => {
    const { molecule } = parsed;
    if (!autoRun || !molecule) return undefined;
    return { source: 'auto', key: runKey, ...execute(molecule, options) };
  }, [autoRun, parsed, options, runKey]);

  const stale = manual !== undefined && manual.key !== runKey;
  const view = manual && (!autoRun || !stale) ? manual : autoView;
  const failure = describeFailure(parsed, view);

  function handleRunAll() {
    const { molecule } = parsed;
    if (!molecule) return;
    setManual({ source: 'all', key: runKey, ...execute(molecule, options) });
  }

  function handleRunSelected() {
    const { molecule } = parsed;
    if (!molecule || !selectedEntry) return;
    setManual({
      source: 'single',
      key: runKey,
      ...execute(molecule, options, selectedEntry.index),
    });
  }

  // Nothing to apply anything to: the whole card goes away rather than showing
  // controls that cannot run.
  if (!parsed.molecule && !parsed.error) return null;

  return (
    <div className="result-card">
      <div className="section-title">
        <span>Apply to the molecule above</span>
        {view?.source === 'single' ? (
          <Tag intent="primary">single entry</Tag>
        ) : null}
        {stale && !autoRun ? (
          <Tag intent="warning">the molecule changed since this run</Tag>
        ) : null}
      </div>

      <div className="chip-row">
        <HTMLSelect
          value={algorithm}
          options={ALGORITHMS}
          onChange={(event) =>
            setAlgorithm(event.currentTarget.value as Algorithm)
          }
        />
        <InputGroup
          value={prefix}
          placeholder="prefix"
          onValueChange={setPrefix}
        />
        <InputGroup
          value={suffix}
          placeholder="suffix"
          onValueChange={setSuffix}
        />
        <Switch
          checked={autoRun}
          label="run automatically"
          onChange={(event) => setAutoRun(event.currentTarget.checked)}
        />
        {autoRun ? null : (
          <Button intent="primary" onClick={handleRunAll}>
            Run
          </Button>
        )}
        <Button
          variant="minimal"
          disabled={selectedEntry === undefined}
          onClick={handleRunSelected}
        >
          Apply only the selected entry
        </Button>
      </div>
      {failure ? (
        <Callout intent="danger" title={failure.title}>
          {failure.message}
        </Callout>
      ) : null}
      {view || failure ? null : (
        <NonIdealState
          icon="play"
          title="Nothing has been run yet"
          description="Automatic runs are off: press Run, or apply the selected entry."
        />
      )}
      {view?.result ? (
        <RunResult
          result={view.result}
          single={view.source === 'single'}
          onSelectEntry={onSelectEntry}
        />
      ) : null}
      <Callout compact>{ALGORITHM_HELP}</Callout>
    </div>
  );
}
