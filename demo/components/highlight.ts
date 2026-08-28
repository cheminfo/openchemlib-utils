/**
 * The empty highlight set. A fresh `[]` literal would make react-ocl's
 * `useHighlight` re-touch every atom node on every render, so every caller
 * shares this one.
 */
export const NO_ATOM_HIGHLIGHT: number[] = [];
