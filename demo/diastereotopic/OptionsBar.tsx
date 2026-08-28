import {
  Button,
  ButtonGroup,
  Callout,
  Card,
  NumericInput,
  Switch,
  Tooltip,
} from '@blueprintjs/core';

import type { ToggleOption } from '../components/ToggleGroup.tsx';
import { ToggleGroup } from '../components/ToggleGroup.tsx';

import type { DiastereotopicOptionsState, HighlightMode } from './types.ts';
import { DEFAULT_DIASTEREOTOPIC_OPTIONS } from './types.ts';

type NumericOptionKey =
  'maxPathLength' | 'maxNbAtoms' | 'minSphereSize' | 'maxSphereSize';

type SwitchOptionKey =
  | 'includeEnantiotopic'
  | 'showHydrogens'
  | 'showAtomNumber'
  | 'computeHoseCodes'
  | 'autoCompute';

interface NumericControl {
  key: NumericOptionKey;
  label: string;
  min: number;
  max: number;
  step: number;
  help: string;
}

const NUMERIC_CONTROLS: NumericControl[] = [
  {
    key: 'maxPathLength',
    label: 'maxPathLength',
    min: 1,
    max: 8,
    step: 1,
    help: 'Longest path TopicMolecule explores between two atoms, and the ceiling of getHoseCodesForPath.',
  },
  {
    key: 'maxNbAtoms',
    label: 'maxNbAtoms',
    min: 1,
    max: 5000,
    step: 50,
    help: 'Above this atom count in moleculeWithH the library refuses to evaluate heterotopicity and every ID array comes back empty.',
  },
  {
    key: 'minSphereSize',
    label: 'minSphereSize',
    min: 0,
    max: 8,
    step: 1,
    help: 'First HOSE sphere kept.',
  },
  {
    key: 'maxSphereSize',
    label: 'maxSphereSize',
    min: 0,
    max: 8,
    step: 1,
    help: 'Last HOSE sphere kept: hoseCodes[i].length === maxSphereSize - minSphereSize + 1.',
  },
];

const SWITCHES: Array<{ key: SwitchOptionKey; label: string; help: string }> = [
  {
    key: 'includeEnantiotopic',
    label: 'includeEnantiotopic',
    help: 'Passed to setProchiralHydrogenLabels; off, only diastereotopic hydrogens are labelled.',
  },
  {
    key: 'showHydrogens',
    label: 'showHydrogens',
    help: 'Render moleculeWithH instead of the hydrogen-collapsed molecule. Off, a hydrogen highlight falls back to its parent heavy atom.',
  },
  {
    key: 'showAtomNumber',
    label: 'showAtomNumber',
    help: 'Print the atom index next to every atom, so the table and the drawing share one numbering.',
  },
  {
    key: 'computeHoseCodes',
    label: 'computeHoseCodes',
    help: 'Reads the hoseCodes getter. It costs about as much as diaIDs again and has no maxNbAtoms guard.',
  },
  {
    key: 'autoCompute',
    label: 'autoCompute',
    help: 'Recompute as soon as the structure or an option changes.',
  },
];

const HIGHLIGHT_MODES: Array<ToggleOption<HighlightMode>> = [
  { value: 'none', label: 'none' },
  { value: 'diastereotopic', label: 'diastereotopic H' },
  { value: 'enantiotopic', label: 'enantiotopic H' },
  { value: 'prochiral', label: 'prochiral H' },
];

const NUMBER_BOX = { width: 110 };

interface OptionsBarProps {
  options: DiastereotopicOptionsState;
  /** Merges a partial into the option object owned by the tab. */
  onChange: (patch: Partial<DiastereotopicOptionsState>) => void;
  onComputeNow: () => void;
  /** Defaults to restoring `DEFAULT_DIASTEREOTOPIC_OPTIONS` through `onChange`. */
  onReset?: () => void;
}

/**
 * The ten TopicMolecule controls, the compute/reset actions and the mutation warning.
 * @param props - the current options, the merge callback and the two actions
 * @returns the options card
 */
export function OptionsBar(props: OptionsBarProps) {
  const { options, onChange, onComputeNow, onReset } = props;

  function handleNumberChange(key: NumericOptionKey, raw: number) {
    const control = NUMERIC_CONTROLS.find((entry) => entry.key === key);
    if (!control || !Number.isFinite(raw)) return;
    const value = clamp(Math.round(raw), control.min, control.max);
    if (value === options[key]) return;
    // A sphere range must never invert: hoseCodes would then have a negative length.
    if (key === 'minSphereSize' && value > options.maxSphereSize) {
      onChange({ minSphereSize: value, maxSphereSize: value });
    } else if (key === 'maxSphereSize' && value < options.minSphereSize) {
      onChange({ minSphereSize: value, maxSphereSize: value });
    } else {
      onChange({ [key]: value });
    }
  }

  function handleReset() {
    if (onReset) {
      onReset();
    } else {
      onChange(DEFAULT_DIASTEREOTOPIC_OPTIONS);
    }
  }

  return (
    <Card elevation={0} className="result-card">
      <div className="section-title">
        <span>TopicMolecule options</span>
        <ButtonGroup>
          <Button
            size="small"
            intent="primary"
            icon="play"
            disabled={options.autoCompute}
            onClick={onComputeNow}
          >
            Compute now
          </Button>
          <Button size="small" icon="reset" onClick={handleReset}>
            Reset options
          </Button>
        </ButtonGroup>
      </div>

      <div className="chip-row">
        {NUMERIC_CONTROLS.map((control) => (
          <div key={control.key} className="chip-row">
            <Tooltip compact content={control.help}>
              <span className="muted mono">{control.label}</span>
            </Tooltip>
            <div style={NUMBER_BOX}>
              <NumericInput
                fill
                clampValueOnBlur
                size="small"
                min={control.min}
                max={control.max}
                stepSize={control.step}
                value={options[control.key]}
                onValueChange={(value) => {
                  handleNumberChange(control.key, value);
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="chip-row">
        {SWITCHES.map((entry) => (
          <Tooltip key={entry.key} compact content={entry.help}>
            <Switch
              checked={options[entry.key]}
              label={entry.label}
              style={{ marginBottom: 0 }}
              onChange={(event) => {
                onChange({ [entry.key]: event.currentTarget.checked });
              }}
            />
          </Tooltip>
        ))}
      </div>

      <div className="chip-row">
        <span className="muted">highlight</span>
        <ToggleGroup
          size="small"
          options={HIGHLIGHT_MODES}
          value={options.highlightMode}
          onSelect={(highlightMode) => {
            onChange({ highlightMode });
          }}
        />
      </div>

      <Callout compact icon="info-sign">
        <code>TopicMolecule</code> never mutates the molecule you hand it — it
        works on <code>getCompactCopy()</code>.{' '}
        <code>getDiastereotopicAtomIDs</code>,{' '}
        <code>getGroupedDiastereotopicAtomIDs</code>,{' '}
        <code>ensureHeterotopicChiralBonds</code>,{' '}
        <code>getHoseCodesFromDiastereotopicID</code>, <code>tagAtom</code>,{' '}
        <code>makeRacemic</code> and <code>toggleHydrogens</code>{' '}
        <strong>do</strong> mutate their argument.
      </Callout>
    </Card>
  );
}

function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
