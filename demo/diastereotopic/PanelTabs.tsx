import type { TabId } from '@blueprintjs/core';
import { Tab, Tabs } from '@blueprintjs/core';

import { AtomDetailCard } from './AtomDetailCard.tsx';
import { AtomTable } from './AtomTable.tsx';
import { GroupTable } from './GroupTable.tsx';
import { HosePanel } from './HosePanel.tsx';
import { StereoBondPanel } from './StereoBondPanel.tsx';
import { TimingsPanel } from './TimingsPanel.tsx';
import type { DiastereotopicOk, DiastereotopicOptionsState } from './types.ts';

interface PanelTabsProps {
  result: DiastereotopicOk;
  /** The options the result was computed with, not the possibly newer edited ones. */
  options: DiastereotopicOptionsState;
  panel: TabId;
  selectedAtom: number | undefined;
  onPanelChange: (panel: TabId) => void;
  onSelectAtom: (atom: number | undefined) => void;
  onHoverAtom: (atom: number | undefined) => void;
  onOptionsChange: (patch: Partial<DiastereotopicOptionsState>) => void;
  /** Display-space atoms of the group hovered or pinned in the group table. */
  onHighlightAtoms: (atoms: number[] | undefined) => void;
}

/**
 * The five analysis panels; only the active one is rendered so the HOSE panel never
 * forces its computation from a background tab.
 * @param props - the analysis result and the whole hover / selection / options wiring
 * @returns the nested tab strip
 */
export function PanelTabs(props: PanelTabsProps) {
  const { result, options, panel, selectedAtom } = props;
  const { onPanelChange, onSelectAtom, onHoverAtom } = props;
  const { onOptionsChange, onHighlightAtoms } = props;

  return (
    <Tabs
      id="dia-panels"
      selectedTabId={panel}
      onChange={onPanelChange}
      renderActiveTabPanelOnly
    >
      <Tab
        id="atoms"
        title={`Atoms (${result.rows.length})`}
        panel={
          <div className="tab-body">
            <AtomTable
              rows={result.rows}
              spheres={result.hoseCodes ? result.spheres : undefined}
              selectedAtom={selectedAtom}
              onSelectAtom={onSelectAtom}
              onHoverAtom={onHoverAtom}
            />
            <AtomDetailCard
              row={
                selectedAtom === undefined
                  ? undefined
                  : result.rows[selectedAtom]
              }
              rows={result.rows}
              distanceMatrix={result.distanceMatrix}
              includeEnantiotopic={options.includeEnantiotopic}
            />
          </div>
        }
      />
      <Tab
        id="groups"
        title={`Groups (${result.groups.length})`}
        panel={
          <GroupTable
            result={result}
            options={options}
            onHighlightAtoms={onHighlightAtoms}
          />
        }
      />
      <Tab
        id="hose"
        title="HOSE codes"
        panel={
          <HosePanel
            result={result}
            options={options}
            selectedAtom={selectedAtom}
            onOptionsChange={onOptionsChange}
            onHoverAtom={onHoverAtom}
            onSelectAtom={onSelectAtom}
          />
        }
      />
      <Tab
        id="stereo"
        title="Stereo bonds"
        panel={
          <StereoBondPanel
            result={result}
            onHoverAtom={onHoverAtom}
            onSelectAtom={onSelectAtom}
          />
        }
      />
      <Tab
        id="timings"
        title="Timings"
        panel={<TimingsPanel result={result} />}
      />
    </Tabs>
  );
}
