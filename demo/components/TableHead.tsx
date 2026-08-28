interface TableHeadProps {
  /** One `<th>` per entry, in order; every header must be distinct. */
  headers: readonly string[];
}

/**
 * The single header row every plain table of the playground has.
 * @param props - the header labels
 * @returns the `<thead>`
 */
export function TableHead(props: TableHeadProps) {
  return (
    <thead>
      <tr>
        {props.headers.map((header) => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    </thead>
  );
}
