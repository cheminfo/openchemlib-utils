import { Button, Callout, TextArea } from '@blueprintjs/core';
import { Molecule } from 'openchemlib';
import { useState } from 'react';

import type { ToggleOption } from './ToggleGroup.tsx';
import { ToggleGroup } from './ToggleGroup.tsx';
import { copyText } from './copyText.ts';
import { errorMessage } from './errorMessage.ts';

type PasteFormat = 'smiles' | 'molfile' | 'idcode';

interface PastePanelProps {
  /** the current molfile, copied out as SMILES */
  molfile: string;
  /** height of the drawing frame, so the column never makes the row taller */
  maxHeight: number;
  onLoad: (molfile: string) => void;
}

const FORMATS: Array<ToggleOption<PasteFormat>> = [
  { value: 'smiles', label: 'SMILES' },
  { value: 'molfile', label: 'Molfile' },
  { value: 'idcode', label: 'idCode' },
];

/**
 * Loads a structure pasted as SMILES, molfile or idCode.
 * @param props - the current molfile, the column height and the load handler
 * @returns the paste panel
 */
export function PastePanel(props: PastePanelProps) {
  const { molfile, maxHeight, onLoad } = props;
  const [text, setText] = useState('');
  const [format, setFormat] = useState<PasteFormat>('smiles');
  const [parseError, setParseError] = useState<string | null>(null);

  function handleLoadFromText() {
    try {
      onLoad(parseText(text, format).toMolfile());
      setParseError(null);
    } catch (error) {
      setParseError(errorMessage(error));
    }
  }

  function handleCopyCurrent() {
    copyText(molfileToSmiles(molfile));
  }

  return (
    <div className="panel input-column" style={{ maxHeight }}>
      <div className="section-title">Paste</div>
      <ToggleGroup options={FORMATS} value={format} onSelect={setFormat} />
      <TextArea
        fill
        className="paste-text"
        value={text}
        onChange={(event) => setText(event.currentTarget.value)}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
      />
      <div className="chip-row">
        <Button intent="primary" onClick={handleLoadFromText}>
          Load
        </Button>
        <Button variant="minimal" onClick={handleCopyCurrent}>
          Copy as SMILES
        </Button>
      </div>
      {parseError === null ? null : (
        <Callout
          className="error-card"
          intent="danger"
          title="Cannot parse structure"
        >
          {parseError}
        </Callout>
      )}
    </div>
  );
}

function molfileToSmiles(molfile: string): string {
  if (!molfile.trim()) return '';
  try {
    return Molecule.fromMolfile(molfile).toIsomericSmiles();
  } catch {
    return '';
  }
}

// Only `fromSmiles` throws on garbage; the other two return a 0-atom molecule.
function parseText(text: string, format: PasteFormat): Molecule {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('nothing to parse');
  if (format === 'smiles') return Molecule.fromSmiles(trimmed);
  const molecule =
    format === 'molfile'
      ? Molecule.fromMolfile(text)
      : Molecule.fromIDCode(trimmed);
  if (molecule.getAllAtoms() === 0) {
    throw new Error(`the ${format} parsed to an empty molecule`);
  }
  return molecule;
}
