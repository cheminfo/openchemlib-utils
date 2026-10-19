import type { TabId } from '@blueprintjs/core';
import { Card, Tab, Tabs, Tag } from '@blueprintjs/core';
import { useState } from 'react';

import { AutoLabelTab } from './autolabel/AutoLabelTab.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { MoleculeInput } from './components/MoleculeInput.tsx';
import { DiastereotopicTab } from './diastereotopic/DiastereotopicTab.tsx';
import { PeptideTab } from './peptide/PeptideTab.tsx';
import { useHashRoute } from './useHashRoute.ts';

const REPOSITORY = 'https://github.com/cheminfo/openchemlib-utils';

/**
 * The playground shell: shared molecule input, hash-routed tabs.
 * @returns the whole application
 */
export function App() {
  const [molfile, setMolfile] = useState<string>('');
  const [route, setRoute] = useHashRoute();

  function handleTabChange(id: TabId) {
    setRoute(id === 'autolabel' || id === 'peptide' ? id : 'diastereotopic');
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>openchemlib-utils debug playground</h1>
        <Tag minimal>v{APP_VERSION}</Tag>
        <Tabs
          id="playground"
          size="large"
          selectedTabId={route}
          onChange={handleTabChange}
        >
          <Tab id="diastereotopic" title="Diastereotopic protons" />
          <Tab id="autolabel" title="autoLabel database" />
          <Tab id="peptide" title="Peptide labelling" />
        </Tabs>
        <a href={REPOSITORY} target="_blank" rel="noreferrer">
          cheminfo/openchemlib-utils
        </a>
      </header>

      {route === 'peptide' ? null : (
        <Card elevation={1}>
          <MoleculeInput
            molfile={molfile}
            tab={route}
            onMolfileChange={setMolfile}
          />
        </Card>
      )}

      <div
        role="tabpanel"
        id="playground-panel-diastereotopic"
        hidden={route !== 'diastereotopic'}
      >
        <ErrorBoundary title="The diastereotopic tab failed to render">
          <DiastereotopicTab molfile={molfile} />
        </ErrorBoundary>
      </div>
      <div
        role="tabpanel"
        id="playground-panel-autolabel"
        hidden={route !== 'autolabel'}
      >
        <ErrorBoundary title="The autoLabel tab failed to render">
          <AutoLabelTab molfile={molfile} />
        </ErrorBoundary>
      </div>
      <div
        role="tabpanel"
        id="playground-panel-peptide"
        hidden={route !== 'peptide'}
      >
        <ErrorBoundary title="The peptide tab failed to render">
          <PeptideTab />
        </ErrorBoundary>
      </div>
    </div>
  );
}
