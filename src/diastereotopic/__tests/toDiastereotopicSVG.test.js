import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { toDiastereotopicSVG } from '../toDiastereotopicSVG';

describe('toDiastereotopicSVG', () => {
  it('CCC', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    const svg = toDiastereotopicSVG(molecule);
    expect(svg).toMatchSnapshot();
    expect(svg).toHaveLength(1091);
  });
});
