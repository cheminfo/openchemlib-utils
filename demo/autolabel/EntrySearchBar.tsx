import { Button, InputGroup } from '@blueprintjs/core';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useRef, useState } from 'react';

import { ToggleGroup } from '../components/ToggleGroup.tsx';

import { QUERY_OPTIONS } from './searchControlsData.ts';
import type { AutoLabelSearchState } from './searchEntries.ts';

const TEXT_DEBOUNCE_MS = 150;

interface EntrySearchBarProps {
  search: AutoLabelSearchState;
  /** Takes the `useState` setter of the tab, so every update stays functional. */
  onSearchChange: Dispatch<SetStateAction<AutoLabelSearchState>>;
}

/**
 * Text and query-feature filters, shown in the header of the entry table.
 * @param props - the search state and its setter
 * @returns the query-feature toggles followed by the text input
 */
export function EntrySearchBar(props: EntrySearchBarProps) {
  const { search, onSearchChange } = props;
  const [text, setText] = useState(search.text);
  const [pushedText, setPushedText] = useState(search.text);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  if (search.text !== pushedText) {
    setPushedText(search.text);
    setText(search.text);
  }
  function commitText(value: string) {
    setPushedText(value);
    onSearchChange((previous) => ({ ...previous, text: value }));
  }
  function handleTextChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setText(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      commitText(value);
    }, TEXT_DEBOUNCE_MS);
  }
  function handleClearText() {
    setText('');
    clearTimeout(timer.current);
    commitText('');
  }

  return (
    <div className="filter-group">
      <span className="filter-label">query features</span>
      <ToggleGroup
        size="small"
        options={QUERY_OPTIONS}
        value={search.queryFeatures}
        onSelect={(queryFeatures) =>
          onSearchChange((previous) => ({ ...previous, queryFeatures }))
        }
      />
      <InputGroup
        fill
        className="filter-grow"
        leftIcon="search"
        placeholder="label, formula or locant — try 18, flav, O"
        value={text}
        onChange={handleTextChange}
        rightElement={
          text ? (
            <Button
              icon="cross"
              variant="minimal"
              aria-label="Clear the text filter"
              onClick={handleClearText}
            />
          ) : undefined
        }
      />
    </div>
  );
}
