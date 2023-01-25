import OCL from 'openchemlib';

import { toDiastereotopicSVG } from '../toDiastereotopicSVG';

describe('toDiastereotopicSVG', () => {
  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    let svg = toDiastereotopicSVG(molecule);
    expect(svg).toMatchSnapshot();
    expect(svg).toHaveLength(1028);
  });
});
