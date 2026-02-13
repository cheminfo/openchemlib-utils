import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { toDiastereotopicSVG } from '../toDiastereotopicSVG';

describe('toDiastereotopicSVG', () => {
  it('CCC', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    const svg = toDiastereotopicSVG(molecule);

    expect(svg).toMatchSnapshot();
  });
});
