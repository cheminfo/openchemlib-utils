import { Icon } from '@blueprintjs/core';

import type { AutoLabelSort, AutoLabelSortColumn } from './searchEntries.ts';

interface EntryColumn {
  key: string;
  width: string;
  /** @default false */
  right?: boolean;
  /** Header labels; those with a `sort` are the buttons that reorder the table. */
  titles: Array<{ title: string; sort?: AutoLabelSortColumn }>;
}

interface EntryTableHeaderProps {
  /** Ordering in force; its header carries the direction caret. */
  sort: AutoLabelSort | null;
  /** Headers are inert labels when it is omitted. */
  onSortChange?: (column: AutoLabelSortColumn) => void;
}

const COLUMNS: EntryColumn[] = [
  {
    key: 'index',
    width: '44px',
    right: true,
    titles: [{ title: '#', sort: 'index' }],
  },
  { key: 'structure', width: '104px', titles: [{ title: 'structure' }] },
  { key: 'entry', width: 'auto', titles: [{ title: 'entry', sort: 'label' }] },
  { key: 'formula', width: 'auto', titles: [{ title: 'formula', sort: 'mw' }] },
  {
    key: 'atoms',
    width: 'auto',
    titles: [
      { title: 'atoms', sort: 'atomCount' },
      { title: 'labelled', sort: 'labelledAtomCount' },
    ],
  },
  { key: 'flags', width: 'auto', titles: [{ title: 'flags' }] },
];

/**
 * Column widths and the sortable header row of the entry table.
 * @param props - the ordering in force and the sort handler
 * @returns the `<colgroup>` and the `<thead>`
 */
export function EntryTableHeader(props: EntryTableHeaderProps) {
  const { sort, onSortChange } = props;

  return (
    <>
      <colgroup>
        {COLUMNS.map((column) => (
          <col key={column.key} style={{ width: column.width }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {COLUMNS.map((column) => (
            <HeaderCell
              key={column.key}
              column={column}
              sort={sort}
              onSortChange={onSortChange}
            />
          ))}
        </tr>
      </thead>
    </>
  );
}

function HeaderCell(props: {
  column: EntryColumn;
  sort: AutoLabelSort | null;
  onSortChange?: (column: AutoLabelSortColumn) => void;
}) {
  const { column, sort, onSortChange } = props;
  const active =
    sort !== null && column.titles.some((title) => title.sort === sort.column);

  return (
    <th
      className={column.right ? 'align-right' : undefined}
      aria-sort={
        active && sort !== null
          ? sort.descending
            ? 'descending'
            : 'ascending'
          : undefined
      }
    >
      <div className={column.right ? 'header-cell align-right' : 'header-cell'}>
        {column.titles.map(({ title, sort: sortColumn }) =>
          sortColumn === undefined || onSortChange === undefined ? (
            <span key={title}>{title}</span>
          ) : (
            <button
              key={title}
              type="button"
              className={
                sort?.column === sortColumn
                  ? 'sort-header sort-header-active'
                  : 'sort-header'
              }
              onClick={() => onSortChange(sortColumn)}
            >
              {title}
              <Icon
                size={12}
                icon={
                  sort?.column !== sortColumn
                    ? 'double-caret-vertical'
                    : sort.descending
                      ? 'chevron-down'
                      : 'chevron-up'
                }
              />
            </button>
          ),
        )}
      </div>
    </th>
  );
}
