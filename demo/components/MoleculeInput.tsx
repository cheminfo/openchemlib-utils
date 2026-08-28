import { Callout } from '@blueprintjs/core';
import { useCallback, useRef, useState } from 'react';
import type { CanvasEditorOnChangeMolecule } from 'react-ocl';
import { CanvasMoleculeEditor } from 'react-ocl';

import type { Preset } from '../presets.ts';
import { presetToMolfile } from '../presets.ts';
import type { RouteId } from '../useHashRoute.ts';

import { PastePanel } from './PastePanel.tsx';
import { PresetList } from './PresetList.tsx';
import { errorMessage } from './errorMessage.ts';
import { useEditorFrameHeight } from './useEditorFrameHeight.ts';

interface MoleculeInputProps {
  molfile: string;
  /** active tab, which decides the presets that are offered */
  tab: RouteId;
  onMolfileChange: (molfile: string) => void;
}

/**
 * Preset / paste / draw input, side by side. Its single output is a V2000
 * molfile string.
 * @param props - the current molfile, the active tab and the change handler
 * @returns the input panel
 */
export function MoleculeInput(props: MoleculeInputProps) {
  const { molfile, tab, onMolfileChange } = props;
  const [editorKey, setEditorKey] = useState(0);
  const [initialValue, setInitialValue] = useState(molfile);
  const [presetId, setPresetId] = useState('');
  const [presetError, setPresetError] = useState<string | null>(null);
  const lastIdCodeRef = useRef('');
  const frameRef = useRef<HTMLDivElement>(null);
  const frameHeight = useEditorFrameHeight(frameRef, editorKey);

  // The editor is uncontrolled: a new structure is loaded by remounting it, so
  // that no later render can reset the atom coordinates under the pen.
  const loadMolfile = useCallback(
    (next: string) => {
      lastIdCodeRef.current = '';
      setInitialValue(next);
      setEditorKey((key) => key + 1);
      onMolfileChange(next);
    },
    [onMolfileChange],
  );

  const handleEditorChange = useCallback(
    (event: CanvasEditorOnChangeMolecule) => {
      const idCode = event.getIdcode().split(' ', 1)[0];
      if (idCode === lastIdCodeRef.current) return;
      lastIdCodeRef.current = idCode;
      onMolfileChange(event.getMolfile());
    },
    [onMolfileChange],
  );

  function handlePreset(preset: Preset) {
    setPresetId(preset.id);
    try {
      loadMolfile(presetToMolfile(preset));
      setPresetError(null);
    } catch (error) {
      setPresetError(errorMessage(error));
    }
  }

  return (
    <div className="result-card">
      <div className="molecule-input-layout">
        <div className="panel input-column" style={{ maxHeight: frameHeight }}>
          <div className="section-title">Presets</div>
          <PresetList tab={tab} presetId={presetId} onSelect={handlePreset} />
        </div>

        <PastePanel
          molfile={molfile}
          maxHeight={frameHeight}
          onLoad={loadMolfile}
        />

        <div
          className="editor-frame"
          ref={frameRef}
          style={{ height: frameHeight }}
        >
          <CanvasMoleculeEditor
            key={editorKey}
            inputFormat="molfile"
            inputValue={initialValue}
            onChange={handleEditorChange}
          />
        </div>
      </div>

      {presetError === null ? null : (
        <Callout
          className="error-card"
          intent="danger"
          title="Cannot load the preset"
        >
          {presetError}
        </Callout>
      )}
    </div>
  );
}
