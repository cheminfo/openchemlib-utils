import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { fragmentAcyclicSingleBonds } from '../fragmentAcyclicSingleBonds';

describe('fragmentAcyclicSingleBonds', () => {
  it('CCc1ccccc1', () => {
    const molecule = OCL.Molecule.fromSmiles('CCc1ccccc1');
    const fragments = fragmentAcyclicSingleBonds(molecule);
    expect(fragments).toStrictEqual([
      { atomMap: [0], idCode: 'eFBAYc@@', mf: 'CH3' },
      { atomMap: [1], idCode: 'eMAAYUeIh@', mf: 'CH2' },
      {
        atomMap: [2, 3, 4, 5, 6, 7],
        idCode: 'gOpH@liLkW@@@@',
        mf: 'C6H5',
      },
    ]);
  });
});
