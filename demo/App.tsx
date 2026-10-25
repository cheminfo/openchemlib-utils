import type { TabId } from '@blueprintjs/core';
import { Card, Tab, Tabs, Tag } from '@blueprintjs/core';
import { useState } from 'react';

import { AutoLabelTab } from './autolabel/AutoLabelTab.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import { MoleculeInput } from './components/MoleculeInput.tsx';
import { DiastereotopicTab } from './diastereotopic/DiastereotopicTab.tsx';
import { NMRHintsTab } from './nmrhints/NMRHintsTab.tsx';
import { PeptideTab } from './peptide/PeptideTab.tsx';
import { toRouteId, useHashRoute } from './useHashRoute.ts';

const REPOSITORY = 'https://github.com/cheminfo/openchemlib-utils';

/**
 * The playground shell: shared molecule input, hash-routed tabs.
 * @returns the whole application
 */
export function App() {
  const [molfile, setMolfile] = useState<string>('');
  const [route, setRoute] = useHashRoute();

  function handleTabChange(id: TabId) {
    setRoute(toRouteId(String(id)));
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
          <Tab id="nmrhints" title="NMR hints" />
        </Tabs>
        <a href={REPOSITORY} target="_blank" rel="noreferrer">
          cheminfo/openchemlib-utils
        </a>
      </header>

      {/* The peptide and NMR hints tabs bring their own input. */}
      {route === 'peptide' || route === 'nmrhints' ? null : (
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
      <div
        role="tabpanel"
        id="playground-panel-nmrhints"
        hidden={route !== 'nmrhints'}
      >
        <ErrorBoundary title="The NMR hints tab failed to render">
          <NMRHintsTab />
        </ErrorBoundary>
      </div>
    </div>
  );
}
