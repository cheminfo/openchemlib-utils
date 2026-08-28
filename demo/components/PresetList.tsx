import { Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import type { ReactNode } from 'react';

import type { Preset } from '../presets.ts';
import { PRESETS_BY_TAB } from '../presets.ts';
import type { RouteId } from '../useHashRoute.ts';

interface PresetListProps {
  /** only the presets of that tab are offered */
  tab: RouteId;
  /** id of the loaded preset, or an empty string when none was loaded */
  presetId: string;
  onSelect: (preset: Preset) => void;
}

/**
 * The presets of the active tab, grouped by section and loaded on a single click.
 * @param props - the active tab, the loaded preset id and the selection handler
 * @returns the preset list
 */
export function PresetList(props: PresetListProps) {
  const { tab, presetId, onSelect } = props;
  const children: ReactNode[] = [];
  let group = '';
  for (const preset of PRESETS_BY_TAB[tab]) {
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
        htmlTitle={preset.smiles}
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
