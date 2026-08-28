import type { Molecule } from 'openchemlib';
import type { PointerEvent } from 'react';
import { SvgRenderer } from 'react-ocl';

import { NO_ATOM_HIGHLIGHT } from './highlight.ts';

const ATOM_MARKER = ':Atom:';

interface StructureThumbnailProps {
  molecule: Molecule | undefined;
  width: number;
  height: number;
  atomHighlight?: number[];
  atomHighlightColor?: string;
  atomHighlightOpacity?: number;
  showAtomNumber?: boolean;
  noCarbonLabelWithCustomLabel?: boolean;
  /** Called with the atom index on enter, and with `undefined` once the pointer leaves every atom. */
  onAtomEnter?: (atom: number | undefined) => void;
  onAtomClick?: (atom: number) => void;
}

/**
 * Renders a molecule with the house depictor defaults and a reliable hover-leave guard.
 * @param props - the molecule, its box and the optional highlight / hover wiring
 * @returns the rendered structure, or a dash when there is no molecule
 */
export function StructureThumbnail(props: StructureThumbnailProps) {
  const {
    molecule,
    width,
    height,
    atomHighlight = NO_ATOM_HIGHLIGHT,
    atomHighlightColor = '#ffc940',
    atomHighlightOpacity = 0.65,
    showAtomNumber = false,
    noCarbonLabelWithCustomLabel = false,
    onAtomEnter,
    onAtomClick,
  } = props;

  if (!molecule) return <span className="muted">—</span>;

  // `onAtomLeave` is unusable: lighting an atom up rewrites the whole SVG, which
  // takes with it the circle the pointer stands on, so its `mouseout` never fires.
  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!isAtomMarker(event.target)) onAtomEnter?.(undefined);
  }

  return (
    <div
      className="thumb-cell"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => onAtomEnter?.(undefined)}
    >
      <SvgRenderer
        molecule={molecule}
        width={width}
        height={height}
        autoCrop
        autoCropMargin={12}
        suppressChiralText
        suppressESR
        suppressCIPParity
        noStereoProblem
        showAtomNumber={showAtomNumber}
        noCarbonLabelWithCustomLabel={noCarbonLabelWithCustomLabel}
        atomHighlight={atomHighlight}
        atomHighlightColor={atomHighlightColor}
        atomHighlightOpacity={atomHighlightOpacity}
        onAtomEnter={(atom) => onAtomEnter?.(atom)}
        onAtomClick={(atom) => onAtomClick?.(atom)}
      />
    </div>
  );
}

function isAtomMarker(target: EventTarget | null): boolean {
  return target instanceof SVGElement && target.id.includes(ATOM_MARKER);
}
