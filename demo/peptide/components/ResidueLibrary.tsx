import { Molecule } from 'openchemlib';
import { useState } from 'react';
import { SvgRenderer } from 'react-ocl';

import { LABELLED_RESIDUES } from '../../../src/peptide/residues.ts';

/**
 * Every fragment `labelPeptide` matches, drawn with the identifier each atom
 * carries. This is the whole of the naming data: when a residue is labelled
 * wrongly, the fragment shown here is what to correct.
 * @returns the residue library.
 */
export function ResidueLibrary() {
  const [selected, setSelected] = useState(LABELLED_RESIDUES[0]?.code ?? '');
  const residue =
    LABELLED_RESIDUES.find((entry) => entry.code === selected) ??
    LABELLED_RESIDUES[0];
  if (!residue) return null;

  const fragment = Molecule.fromIDCode(residue.idCode);
  fragment.ensureHelperArrays(Molecule.cHelperNeighbours);
  const names: string[] = [];
  for (let atom = 0; atom < fragment.getAllAtoms(); atom++) {
    const label = fragment.getAtomCustomLabel(atom);
    names.push(fragment.getAtomLabel(atom) + (label ? label.slice(1) : ''));
  }

  return (
    <section className="residues">
      <h2>Labelled residues</h2>
      <p>
        The naming data, in full. Each fragment is a residue core — backbone{' '}
        <code>N</code>, <code>Cα</code>, <code>C′</code>, <code>O</code> and the
        heavy side chain — carrying its IUPAC identifier on every atom.
        Hydrogens are absent: openchemlib drops them from a query, so they are
        named afterwards from the atom they hang on.
      </p>

      <div className="residue-tabs" role="tablist">
        {LABELLED_RESIDUES.map((entry) => (
          <button
            key={entry.code}
            type="button"
            role="tab"
            aria-selected={entry.code === residue.code}
            className={entry.code === residue.code ? 'active' : undefined}
            onClick={() => setSelected(entry.code)}
          >
            {entry.code}
          </button>
        ))}
      </div>

      <div className="residue-panel">
        <SvgRenderer
          molecule={fragment}
          width={460}
          height={320}
          autoCrop
          autoCropMargin={24}
          suppressChiralText
          noStereoProblem
        />
        <div className="residue-meta">
          <h3>
            {residue.code}{' '}
            <span className="residue-count">
              {fragment.getAllAtoms()} heavy atoms
            </span>
          </h3>
          <p className="residue-names">{names.join(' · ')}</p>
          <details>
            <summary>idcode</summary>
            <code>{residue.idCode}</code>
          </details>
        </div>
      </div>
    </section>
  );
}
