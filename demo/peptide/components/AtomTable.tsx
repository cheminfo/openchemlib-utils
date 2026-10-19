import type { PeptideAtomLabel } from '../../../src/peptide/PeptideTypes.ts';

interface AtomTableProps {
  atoms: PeptideAtomLabel[];
  highlighted: number | null;
  onHover: (atom: number | null) => void;
}

/**
 * The list of labelled atoms, synchronised with the structure on hover.
 * @param props - the atoms to show and the hover handlers.
 * @returns the table.
 */
export function AtomTable(props: AtomTableProps) {
  const { atoms, highlighted, onHover } = props;

  if (atoms.length === 0) {
    return <p className="empty">No labelled atom.</p>;
  }

  return (
    <table className="atoms">
      <thead>
        <tr>
          <th>#</th>
          <th>El</th>
          <th>Res</th>
          <th>Name</th>
          <th>Label</th>
          <th>pro</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {atoms.map((atom) => (
          <tr
            key={atom.atom}
            className={atom.atom === highlighted ? 'highlighted' : undefined}
            onMouseEnter={() => onHover(atom.atom)}
            onMouseLeave={() => onHover(null)}
          >
            <td>{atom.atom}</td>
            <td>{atom.element}</td>
            <td>{atom.residueNumber}</td>
            <td>{atom.name}</td>
            <td className="mono">{atom.label}</td>
            <td>{atom.proChirality ?? ''}</td>
            <td className="flags">{atom.arbitrary ? 'arbitrary' : ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
