import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { combineSmiles } from '../combineSmiles';

describe('combineSmiles', () => {
  it('real case', async () => {
    const fragments = [
      { smiles: 'CC(=O)[R]', R1: true, R2: false, R3: true, R4: true },
      { smiles: 'OC[R]', R1: true, R2: true, R3: false, R4: true },
      { smiles: 'CNC[R]', R1: true, R2: false, R3: false, R4: false },
      { smiles: 'CCOC[R]', R1: false, R2: false, R3: true, R4: true },
      { smiles: 'c1cccc([R])c1', R1: false, R2: true, R3: true, R4: false },
      { smiles: '[R]CC', R1: true, R2: false, R3: false, R4: false },
      { smiles: '[R]CCC', R1: true, R2: false, R3: false, R4: false },
      { smiles: '[H][R]', R1: false, R2: true, R3: true, R4: false },
    ];
    const core = 'c1nc([R1])c([R2])c([R3])c([R4])1';
    const results = await combineSmiles(core, fragments, OCL);
    expect(results).toHaveLength(180);
    expect(results[0].mw).toBe(137.18134);
    expect(results[0].mf).toBe('C8H11NO');
  });

  it('onStep', async () => {
    let counter = 0;
    const fragments = [
      { smiles: 'CC(=O)[R]', R1: true, R2: false, R3: true, R4: true },
      { smiles: 'OC[R]', R1: true, R2: true, R3: false, R4: true },
    ];
    const core = 'c1nc([R1])c([R2])c([R3])c([R4])1';
    const results = await combineSmiles(core, fragments, OCL, {
      onStep: () => counter++,
    });
    expect(results).toHaveLength(4);
    expect(counter).toBe(4);
  });

  it('complexity', async () => {
    const fragments = [
      { smiles: 'CC(=O)[R]', R1: true, R2: false, R3: true, R4: true },
      { smiles: 'OC[R]', R1: true, R2: true, R3: false, R4: true },
    ];
    const core = 'c1nc([R1])c([R2])c([R3])c([R4])1';
    const results = await combineSmiles(core, fragments, OCL, {
      complexity: true,
    });
    expect(results).toBe(4);
  });
});
