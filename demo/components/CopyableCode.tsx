import { copyText } from './copyText.ts';
import { truncateIdCode } from './truncateIdCode.ts';

interface CopyableCodeProps {
  /** The full value; it is what gets copied, however short the cell shows it. */
  value: string;
  /** Names the value in the tooltip, e.g. `diaID`. */
  label: string;
  /**
   * Characters kept on screen.
   * @default 14
   */
  length?: number;
  /** @default false */
  muted?: boolean;
}

/**
 * A truncated idCode that copies itself in full when clicked, without selecting
 * the row it sits in.
 * @param props - the value, how to name it and how much of it to show
 * @returns the code cell
 */
export function CopyableCode(props: CopyableCodeProps) {
  const { value, label, length = 14, muted = false } = props;

  return (
    <button
      type="button"
      className={muted ? 'mono muted code-button' : 'mono code-button'}
      title={`${label}: ${value} — click to copy`}
      onClick={(event) => {
        event.stopPropagation();
        copyText(value);
      }}
    >
      {truncateIdCode(value, length)}
    </button>
  );
}
