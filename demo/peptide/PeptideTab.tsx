import './styles.css';
import { useMemo, useState } from 'react';
import { StructureEditor } from 'react-cheminfo/structure';
import { SvgRenderer } from 'react-ocl';

import type { PeptideNaming } from '../../src/peptide/PeptideTypes.ts';

import { AtomTable } from './components/AtomTable.tsx';
import { ResidueLibrary } from './components/ResidueLibrary.tsx';
import { EXAMPLES } from './examples.ts';
import { labelForDemo } from './labelling.ts';
import type { InputKind, InputMode } from './moleculeFromInput.ts';
import { moleculeFromInput } from './moleculeFromInput.ts';
import { useStructureInput } from './useStructureInput.ts';

const INPUT_KINDS: InputKind[] = ['smiles', 'idcode', 'molfile'];

/**
 * The peptide tab: a drawing and its text, the labelling options, the labelled
 * structure and the table of identifiers.
 * @returns the page.
 */
export function PeptideTab() {
  const { input, mode, editorSeed, setText, setMode, handleEditorChange } =
    useStructureInput(EXAMPLES[0].value);
  const [showResidues, setShowResidues] = useState(false);
  const [naming, setNaming] = useState<PeptideNaming>('greek');
  const [showNames, setShowNames] = useState(false);
  const [hideHydrogens, setHideHydrogens] = useState(false);
  const [hideCarbon, setHideCarbon] = useState(true);
  const [highlighted, setHighlighted] = useState<number | null>(null);

  const result = useMemo(() => {
    try {
      const molecule = moleculeFromInput(input, mode);
      // Nothing typed or drawn yet: nothing to label, nothing to warn about.
      if (molecule.getAllAtoms() === 0) return noResult(null);
      return {
        ...labelForDemo(molecule, {
          naming,
          labelStyle: showNames ? ('name' as const) : ('superscript' as const),
          hideHydrogens,
        }),
        error: null as string | null,
      };
    } catch (error) {
      return noResult(error instanceof Error ? error.message : String(error));
    }
  }, [input, mode, naming, showNames, hideHydrogens]);

  const drawnHighlight =
    highlighted === null ? undefined : result.drawnAtom.get(highlighted);
  const fromDrawn = (drawn: number) => {
    for (const [atom, index] of result.drawnAtom) {
      if (index === drawn) return atom;
    }
    return drawn;
  };

  return (
    <div className="peptide-tab">
      <header>
        <h1>openchemlib-utils — peptide labelling</h1>
        <p>
          Draw a peptide, or paste an idcode, a SMILES or a molfile; the drawing
          and the text follow each other. Every atom gets its IUPAC identifier
          as an openchemlib custom label, rendered by <code>react-ocl</code>. To
          start from an abbreviation such as <code>HAlaGlyOH</code>, build it
          with <code>sequence-to-molecule</code> and paste the idcode.
        </p>
      </header>

      <section className="controls">
        <label>
          Example
          <select
            value=""
            onChange={(event) => {
              const example = EXAMPLES.find(
                (item) => item.label === event.target.value,
              );
              if (example) setText(example.value);
            }}
          >
            <option value="">choose…</option>
            {EXAMPLES.map((example) => (
              <option key={example.label} value={example.label}>
                {example.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Input
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as InputMode)}
          >
            <option value="auto">auto</option>
            {INPUT_KINDS.map((inputKind) => (
              <option key={inputKind} value={inputKind}>
                {inputKind}
              </option>
            ))}
          </select>
        </label>

        <label>
          Names
          <select
            value={naming}
            onChange={(event) => setNaming(event.target.value as PeptideNaming)}
          >
            <option value="greek">Greek — Cβ, C′</option>
            <option value="roman">{"Roman — CB, C'"}</option>
            <option value="pdb">PDB — CB, C, OXT</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={showNames}
            onChange={(event) => setShowNames(event.target.checked)}
          />
          Full name instead of superscript
        </label>

        <label>
          <input
            type="checkbox"
            checked={showResidues}
            onChange={(event) => setShowResidues(event.target.checked)}
          />
          Show the labelled residues
        </label>

        <label>
          <input
            type="checkbox"
            checked={hideHydrogens}
            onChange={(event) => setHideHydrogens(event.target.checked)}
          />
          Hide hydrogens
        </label>

        <label>
          <input
            type="checkbox"
            checked={hideCarbon}
            onChange={(event) => setHideCarbon(event.target.checked)}
          />
          Hide C on labelled carbons
        </label>
      </section>

      <section className="structure-input">
        <StructureEditor
          className="structure-editor"
          inputFormat="molfile"
          value={editorSeed.molfile}
          revision={editorSeed.revision}
          minHeight={420}
          onChange={handleEditorChange}
        />
        <textarea
          value={input}
          aria-label="idcode, SMILES or molfile"
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          onChange={(event) => setText(event.target.value)}
        />
      </section>

      {result.error ? <p className="error">{result.error}</p> : null}
      {result.warnings.map((warning) => (
        <p key={warning} className="warning">
          {warning}
        </p>
      ))}
      {result.residueCount > 0 ? (
        <p className="summary">
          {result.residueCount} residues ({result.codes.join(' ')}) —{' '}
          {result.atoms.length} labelled atoms
        </p>
      ) : null}

      {showResidues ? <ResidueLibrary /> : null}

      <section className="panels">
        <div className="structure">
          {result.molecule ? (
            <SvgRenderer
              molecule={result.molecule}
              width={700}
              height={560}
              autoCrop
              autoCropMargin={20}
              suppressChiralText
              noStereoProblem
              noCarbonLabelWithCustomLabel={hideCarbon}
              noImplicitHydrogen={hideHydrogens}
              atomHighlight={
                drawnHighlight === undefined ? undefined : [drawnHighlight]
              }
              atomHighlightColor="#fbb360"
              atomHighlightOpacity={0.6}
              onAtomEnter={(atom) => setHighlighted(fromDrawn(atom))}
              onAtomLeave={() => setHighlighted(null)}
            />
          ) : null}
        </div>
        <div className="table">
          <AtomTable
            atoms={result.atoms}
            highlighted={highlighted}
            onHover={setHighlighted}
          />
        </div>
      </section>
    </div>
  );
}

function noResult(error: string | null) {
  return {
    molecule: null,
    atoms: [],
    drawnAtom: new Map<number, number>(),
    residueCount: 0,
    codes: [],
    warnings: [],
    error,
  };
}
