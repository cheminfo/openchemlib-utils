import OCL from 'openchemlib';

import { initOCL } from '../../OCL';
import { toDiastereotopicSVG } from '../toDiastereotopicSVG';

initOCL(OCL);
describe('toDiastereotopicSVG', () => {
  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    let svg = toDiastereotopicSVG(molecule);
    expect(svg).toHaveLength(996);
    expect(svg).toMatchSnapshot();
  });
});
