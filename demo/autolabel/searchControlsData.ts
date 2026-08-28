import type {
  AutoLabelSearchState,
  StructureDirection,
} from './searchEntries.ts';

/** The three-state query-feature filter. */
export type QueryMode = AutoLabelSearchState['queryFeatures'];

/** Query-feature filter toggles. */
export const QUERY_OPTIONS: Array<{ value: QueryMode; label: string }> = [
  { value: 'any', label: 'any' },
  { value: 'with', label: 'with' },
  { value: 'without', label: 'without' },
];

/** The two substructure directions the structure filter can run. */
export const DIRECTION_OPTIONS: Array<{
  value: StructureDirection;
  label: string;
}> = [
  { value: 'labelsMyMolecule', label: 'Entry labels my molecule' },
  { value: 'containsMySketch', label: 'Entry contains my sketch' },
];
