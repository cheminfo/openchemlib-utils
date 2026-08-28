import { Tag } from '@blueprintjs/core';

import { getFamilyStyle } from './familyColors.ts';

interface FamilyTagProps {
  family: string;
  /**
   * Draws the chip as an outline over its own colour instead of filling it,
   * which is how an unselected family reads in the filter bar.
   * @default false
   */
  muted?: boolean;
  /**
   * Makes the chip clickable.
   * @default false
   */
  interactive?: boolean;
  onClick?: () => void;
}

/**
 * The one family chip of the tab, shown in the filter bar, in the entry table
 * and in every detail panel so a colour always means the same family.
 * @param props - the family, and how the chip should read
 * @returns the coloured tag
 */
export function FamilyTag(props: FamilyTagProps) {
  const { family, muted = false, interactive = false, onClick } = props;
  const style = getFamilyStyle(family);

  return (
    <Tag
      interactive={interactive}
      onClick={onClick}
      style={tagStyle(style, muted)}
    >
      {family}
    </Tag>
  );
}

function tagStyle(style: ReturnType<typeof getFamilyStyle>, muted: boolean) {
  if (!muted) {
    return { backgroundColor: style.background, color: style.text };
  }
  return {
    backgroundColor: `color-mix(in srgb, ${style.background} 15%, transparent)`,
    color: '#1c2127',
    boxShadow: `inset 0 0 0 1px ${style.background}`,
  };
}
