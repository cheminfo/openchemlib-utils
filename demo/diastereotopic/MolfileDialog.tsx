import type { TabId } from '@blueprintjs/core';
import { Switch, Tab, Tabs } from '@blueprintjs/core';
import { useState } from 'react';

import { CodeBlock } from '../components/CodeBlock.tsx';
import { CodeDialog } from '../components/CodeDialog.tsx';
import type { ToggleOption } from '../components/ToggleGroup.tsx';
import { ToggleGroup } from '../components/ToggleGroup.tsx';

import type { DiastereotopicOk } from './types.ts';

type MolfileKey = 'molecule' | 'moleculeWithH' | 'moleculeWithoutH';
type MolfileVersion = 'v2000' | 'v3000';

const MOLFILE_KEYS: MolfileKey[] = [
  'molecule',
  'moleculeWithH',
  'moleculeWithoutH',
];

const VERSIONS: Array<ToggleOption<MolfileVersion>> = [
  { value: 'v2000', label: 'V2000' },
  { value: 'v3000', label: 'V3000' },
];

const DESCRIPTIONS: Record<MolfileKey, string> = {
  molecule:
    'The structure as drawn, after ensureHeterotopicChiralBonds. Implicit hydrogens are still implicit.',
  moleculeWithH:
    'Every hydrogen made explicit and appended after the heavy atoms; this is the index space of every ID array.',
  moleculeWithoutH:
    'Every explicit hydrogen removed again — a labelled hydrogen keeps its label on the parent atom.',
};

interface MolfileDialogProps {
  result: DiastereotopicOk;
}

/**
 * The three molfiles of the analysed molecule, in V2000 or V3000, before or after
 * labelling — behind a button so the raw text never takes room in the layout.
 * @param props - the successful analysis holding both molfile snapshots
 * @returns the button opening the molfile dialog
 */
export function MolfileDialog(props: MolfileDialogProps) {
  const { result } = props;
  const [which, setWhich] = useState<MolfileKey>('moleculeWithH');
  const [version, setVersion] = useState<MolfileVersion>('v2000');
  const [beforeLabelling, setBeforeLabelling] = useState(false);

  const snapshot = beforeLabelling
    ? result.molfilesBefore
    : result.molfilesAfter;
  const stage = beforeLabelling ? 'before labelling' : 'after labelling';

  return (
    <CodeDialog title="Molfiles" icon="document">
      <div className="result-card">
        <div className="filter-row">
          <ToggleGroup
            options={VERSIONS}
            value={version}
            onSelect={setVersion}
          />
          <Switch
            checked={beforeLabelling}
            label="before labelling"
            onChange={() => {
              setBeforeLabelling(!beforeLabelling);
            }}
          />
        </div>
        <Tabs
          id="molfile-kind"
          selectedTabId={which}
          renderActiveTabPanelOnly
          onChange={(tabId) => {
            if (isMolfileKey(tabId)) setWhich(tabId);
          }}
        >
          {MOLFILE_KEYS.map((key) => (
            <Tab
              key={key}
              id={key}
              title={key}
              panel={
                <div className="result-card">
                  <span className="muted">{DESCRIPTIONS[key]}</span>
                  <CodeBlock
                    code={snapshot[key][version]}
                    label={`${key} · ${version.toUpperCase()} · ${stage}`}
                    maxHeight={420}
                  />
                </div>
              }
            />
          ))}
        </Tabs>
      </div>
    </CodeDialog>
  );
}

function isMolfileKey(tabId: TabId): tabId is MolfileKey {
  return Object.hasOwn(DESCRIPTIONS, tabId);
}
