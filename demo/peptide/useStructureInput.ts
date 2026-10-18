import type { Molecule } from 'openchemlib';
import { useRef, useState } from 'react';
import type { StructureEditorChange } from 'react-cheminfo/structure';
import { isEmptyIdCode, splitIdCode } from 'react-cheminfo/structure';

import type { InputMode } from './moleculeFromInput.ts';
import { moleculeFromInput } from './moleculeFromInput.ts';

export interface EditorSeed {
  /** Structure the editor is loaded with. */
  molfile: string;
  /** Canonical idcode of `molfile`. */
  idCode: string;
  /** Bumped on every load; the editor reloads `molfile` when it changes. */
  revision: number;
}

export interface StructureInput {
  /** The text of the textarea. */
  input: string;
  mode: InputMode;
  editorSeed: EditorSeed;
  /** Replace the text, typed or picked from the examples; the editor follows once it parses. */
  setText: (value: string) => void;
  setMode: (mode: InputMode) => void;
  /** Write a drawn structure into the text, in the format `mode` asks for. */
  handleEditorChange: (change: StructureEditorChange) => void;
}

/**
 * Keep the text and the drawing of one structure in step: text that parses is
 * loaded in the editor, and a drawing is written back as text. The editor is
 * never reloaded by its own changes, so the atoms stay where they were drawn.
 * @param initial - the text shown first.
 * @returns the text, the editor seed and their handlers.
 */
export function useStructureInput(initial: string): StructureInput {
  const [input, setInput] = useState(initial);
  const [mode, setModeState] = useState<InputMode>('auto');
  const [editorSeed, setEditorSeed] = useState<EditorSeed>(() =>
    seedFrom(tryParse(initial, 'auto'), 0),
  );
  // What the editor holds right now, so a load that changes nothing is skipped.
  const editorIdCodeRef = useRef(editorSeed.idCode);

  function load(value: string, nextMode: InputMode) {
    const molecule = tryParse(value, nextMode);
    if (!molecule) return;
    const idCode = molecule.getIDCode();
    if (idCode === editorIdCodeRef.current) return;
    editorIdCodeRef.current = idCode;
    setEditorSeed((seed) => seedFrom(molecule, seed.revision + 1));
  }

  function handleEditorChange(change: StructureEditorChange) {
    if (change.mode !== 'molecule') return;
    const { idCode } = splitIdCode(change.idCode);
    if (idCode === editorIdCodeRef.current) return;
    editorIdCodeRef.current = idCode;
    setInput(drawnText(change, mode, idCode));
  }

  return {
    input,
    mode,
    editorSeed,
    setText: (value) => {
      setInput(value);
      load(value, mode);
    },
    setMode: (nextMode) => {
      setModeState(nextMode);
      load(input, nextMode);
    },
    handleEditorChange,
  };
}

function tryParse(value: string, mode: InputMode): Molecule | null {
  try {
    return moleculeFromInput(value, mode);
  } catch {
    return null;
  }
}

function seedFrom(molecule: Molecule | null, revision: number): EditorSeed {
  if (!molecule) return { molfile: '', idCode: '', revision };
  return {
    molfile: molecule.toMolfile(),
    idCode: molecule.getIDCode(),
    revision,
  };
}

function drawnText(
  change: StructureEditorChange,
  mode: InputMode,
  idCode: string,
): string {
  if (isEmptyIdCode(idCode)) return '';
  if (mode === 'smiles') return change.smiles;
  if (mode === 'molfile') return change.molfile;
  return idCode;
}
