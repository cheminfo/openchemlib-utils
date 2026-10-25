import { Button, Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import type { ReactNode } from 'react';
import { useCallback, useRef } from 'react';
import type { CanvasEditorOnChangeMolecule } from 'react-ocl';
import { CanvasMoleculeEditor } from 'react-ocl';

import { PastePanel } from '../components/PastePanel.tsx';
import { useEditorFrameHeight } from '../components/useEditorFrameHeight.ts';

import type { PairPreset } from './pairPresets.ts';
import { PAIR_PRESETS } from './pairPresets.ts';
import type { EditorState, PairSide, PairState } from './pairState.ts';

interface PairInputProps {
  pair: PairState;
  /** id of the loaded pair, or an empty string once the user changed it */
  presetId: string;
  onPreset: (preset: PairPreset) => void;
  /** a structure pasted into one side */
  onLoad: (side: PairSide, molfile: string) => void;
  /** a structure drawn in one side */
  onDraw: (side: PairSide, molfile: string) => void;
  onSwap: () => void;
}

/**
 * Pair presets, then a paste panel and an editor for each of the two structures.
 * @param props - both editor states and their handlers
 * @returns the input card content
 */
export function PairInput(props: PairInputProps) {
  const { pair, presetId, onPreset, onLoad, onDraw, onSwap } = props;

  return (
    <div className="pair-input-layout">
      <div className="panel input-column pair-presets">
        <div className="section-title">
          <span>Pairs</span>
          <Button
            size="small"
            variant="minimal"
            icon="swap-horizontal"
            onClick={onSwap}
          >
            Swap
          </Button>
        </div>
        <PairPresetList presetId={presetId} onSelect={onPreset} />
      </div>
      <PairSideInput
        side="correct"
        title="Correct structure (the answer)"
        state={pair.correct}
        onLoad={onLoad}
        onDraw={onDraw}
      />
      <PairSideInput
        side="proposed"
        title="Proposed structure (what the student drew)"
        state={pair.proposed}
        onLoad={onLoad}
        onDraw={onDraw}
      />
    </div>
  );
}

function PairPresetList(props: {
  presetId: string;
  onSelect: (preset: PairPreset) => void;
}) {
  const { presetId, onSelect } = props;
  const children: ReactNode[] = [];
  let group = '';
  for (const preset of PAIR_PRESETS) {
    if (preset.group !== group) {
      group = preset.group;
      children.push(<MenuDivider key={group} title={group} />);
    }
    children.push(
      <MenuItem
        key={preset.id}
        roleStructure="listoption"
        selected={preset.id === presetId}
        text={preset.label}
        htmlTitle={`${preset.correct}  →  ${preset.proposed}`}
        onClick={() => onSelect(preset)}
      />,
    );
  }
  return (
    <Menu role="listbox" className="preset-list">
      {children}
    </Menu>
  );
}

function PairSideInput(props: {
  side: PairSide;
  title: string;
  state: EditorState;
  onLoad: (side: PairSide, molfile: string) => void;
  onDraw: (side: PairSide, molfile: string) => void;
}) {
  const { side, title, state, onLoad, onDraw } = props;
  const frameRef = useRef<HTMLDivElement>(null);
  const frameHeight = useEditorFrameHeight(frameRef, state.revision);
  const lastDrawnRef = useRef({ revision: -1, idCode: '' });

  // The editor is uncontrolled: an outside load remounts it through `revision`,
  // so no later render can reset the atom coordinates under the pen.
  const handleEditorChange = useCallback(
    (event: CanvasEditorOnChangeMolecule) => {
      const idCode = event.getIdcode().split(' ', 1)[0];
      const last = lastDrawnRef.current;
      if (last.revision === state.revision && last.idCode === idCode) return;
      lastDrawnRef.current = { revision: state.revision, idCode };
      onDraw(side, event.getMolfile());
    },
    [onDraw, side, state.revision],
  );

  return (
    <div className="pair-side">
      <div className="section-title">
        <span>{title}</span>
      </div>
      <div className="pair-side-body">
        <PastePanel
          molfile={state.current}
          maxHeight={frameHeight}
          onLoad={(molfile) => onLoad(side, molfile)}
        />
        <div
          className="editor-frame"
          ref={frameRef}
          style={{ height: frameHeight }}
        >
          <CanvasMoleculeEditor
            key={state.revision}
            inputFormat="molfile"
            inputValue={state.initial}
            onChange={handleEditorChange}
          />
        </div>
      </div>
    </div>
  );
}
