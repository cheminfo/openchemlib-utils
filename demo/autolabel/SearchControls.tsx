import { Button, Card, Switch, Tag } from '@blueprintjs/core';
import type { Dispatch, SetStateAction } from 'react';

import { ToggleGroup } from '../components/ToggleGroup.tsx';

import { FamilyTag } from './FamilyTag.tsx';
import { AUTO_LABEL_ENTRIES, AUTO_LABEL_FAMILIES } from './entries.ts';
import { DIRECTION_OPTIONS } from './searchControlsData.ts';
import type { AutoLabelSearchState } from './searchEntries.ts';

interface SearchControlsProps {
  search: AutoLabelSearchState;
  /** Takes the `useState` setter of the tab, so every update stays functional. */
  onSearchChange: Dispatch<SetStateAction<AutoLabelSearchState>>;
  /** How many entries the structure filter matched; `undefined` until it ran. */
  structureHitCount?: number;
  /**
   * False when the shared input holds no parseable molecule.
   * @default true
   */
  hasMolecule?: boolean;
}

/**
 * Filter bar of the autoLabel tab: family and substructure direction. Text and
 * query features live in the entry table header, ordering in its columns.
 * @param props - the search state, its setter and the structure-filter status
 * @returns the controls card
 */
export function SearchControls(props: SearchControlsProps) {
  const { search, onSearchChange, structureHitCount } = props;
  const hasMolecule = props.hasMolecule ?? true;

  function update(patch: Partial<AutoLabelSearchState>) {
    onSearchChange((previous) => ({ ...previous, ...patch }));
  }
  function selectFamily(family: string) {
    update({ family: search.family === family ? null : family });
  }

  return (
    <Card elevation={0} className="filter-bar">
      <div className="filter-row">
        <span className="filter-label">families</span>
        <div className="chip-row">
          <Button
            size="small"
            active={search.family === null}
            onClick={() => update({ family: null })}
          >
            all
          </Button>
          {AUTO_LABEL_FAMILIES.map((family) => (
            <FamilyTag
              key={family}
              family={family}
              interactive
              muted={search.family !== family}
              onClick={() => selectFamily(family)}
            />
          ))}
        </div>
      </div>

      <div className="filter-row">
        <Switch
          checked={search.structureFilter}
          disabled={!hasMolecule}
          label="Filter by structure"
          style={{ marginBottom: 0 }}
          onChange={(event) =>
            update({ structureFilter: event.currentTarget.checked })
          }
        />
        <ToggleGroup
          size="small"
          options={DIRECTION_OPTIONS}
          disabled={!search.structureFilter || !hasMolecule}
          value={search.direction}
          onSelect={(direction) => update({ direction })}
        />
        {search.structureFilter && structureHitCount !== undefined && (
          <Tag
            minimal
            intent={structureHitCount > 0 ? 'success' : 'warning'}
          >{`${structureHitCount} / ${AUTO_LABEL_ENTRIES.length} entries match`}</Tag>
        )}
      </div>
    </Card>
  );
}
