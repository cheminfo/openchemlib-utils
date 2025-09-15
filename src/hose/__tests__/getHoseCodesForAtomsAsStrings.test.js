import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { getHoseCodesForAtomsAsStrings } from '../getHoseCodesForAtomsAsStrings.js';

test('tagged ethyl vinyl ether', () => {
  const taggedMolecule = Molecule.fromIDCode('gGQHLIeIUjdA~dPHeT');

  expect(taggedMolecule.toSmiles()).toBe('C=COCC[X]');

  const hoses = getHoseCodesForAtomsAsStrings(taggedMolecule, {});

  expect(hoses).toStrictEqual([
    'fHdrA\u007FRaDj`',
    'eFBBYcAuSzm\u007FRPQJh',
    'eMBBYRZCie_MkozRBIU@',
    'gCaHLIeIZ`NmEN_ZZms\u007FiDBIU@',
    String.raw`gJQHLIeIVj@zLTyKxsUn\w~dPHeT`,
  ]);
});
