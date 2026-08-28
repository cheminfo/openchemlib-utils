import { Button, ButtonGroup } from '@blueprintjs/core';

/** One choice offered by a `ToggleGroup`. */
export interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

interface ToggleGroupProps<T extends string> {
  options: ReadonlyArray<ToggleOption<T>>;
  /** The choice currently in force; its button is the active one. */
  value: T;
  onSelect: (value: T) => void;
  /**
   * Greys out every button of the group.
   * @default false
   */
  disabled?: boolean;
  /** @default 'medium' */
  size?: 'small' | 'medium' | 'large';
}

/**
 * Row of toggle buttons over a fixed set of choices — every mode, filter and
 * format switch of the playground is one of these.
 * @param props - the options, the active value and the select handler
 * @returns the button group
 */
export function ToggleGroup<T extends string>(props: ToggleGroupProps<T>) {
  const { options, value, onSelect, disabled = false, size = 'medium' } = props;

  return (
    <ButtonGroup>
      {options.map((option) => (
        <Button
          key={option.value}
          size={size}
          disabled={disabled}
          active={option.value === value}
          onClick={() => {
            onSelect(option.value);
          }}
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}
