import { readFileSync } from 'fs';
import { join } from 'path';

import { Molecule } from 'openchemlib';

import { getHoseCodes } from '../getHoseCodes.js';

describe('getHoseCodes', () => {
  it('methane', () => {
    const molecule = Molecule.fromSmiles('C');
    const hoseCodes = getHoseCodes(molecule, { maxSphereSize: 1 });
    expect(hoseCodes).toStrictEqual([
      ['fH@NJ`\x7FRapj`', 'fH@FJ`\x7FRapj`'],
      ['fHdrA\x7FRaDj`', 'eFBBYcA\x7FRPQJh'],
      ['fHdrA\x7FRaDj`', 'eFBBYcA\x7FRPQJh'],
      ['fHdrA\x7FRaDj`', 'eFBBYcA\x7FRPQJh'],
      ['fHdrA\x7FRaDj`', 'eFBBYcA\x7FRPQJh'],
    ]);
  });

  it('ethanol', () => {
    const molecule = Molecule.fromSmiles('CCO');
    const hoseCodes = getHoseCodes(molecule, {
      atomLabels: ['C', 'O'],
      maxSphereSize: 0,
    });
    expect(hoseCodes).toStrictEqual([
      ['fH@NJ`\x7FRapj`'],
      ['fH@NJ`\x7FRapj`'],
      ['fI@GEP_iP~UP'],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });

  it('cyclosporin', () => {
    const molfile = readFileSync(
      join(__dirname, '../../diastereotopic/__tests/data/cyclosporin.mol'),
      'utf8',
    );
    const molecule = Molecule.fromMolfile(molfile);

    let hoseCodes = getHoseCodes(molecule, { maxSphereSize: 1 });
    expect(hoseCodes.length).toBe(196);
    let distincts = getDistinctHoses(hoseCodes);
    expect(distincts.length).toBe(20);
    expect(distincts).toMatchSnapshot();

    hoseCodes = getHoseCodes(molecule, { maxSphereSize: 1, atomLabels: ['C'] });
    expect(hoseCodes.length).toBe(196);
    distincts = getDistinctHoses(hoseCodes);
    expect(distincts.length).toBe(10);
    expect(distincts).toMatchSnapshot();

    hoseCodes = getHoseCodes(molecule, { atomLabels: ['C'] });
    expect(hoseCodes.length).toBe(196);
    expect(hoseCodes).toMatchSnapshot();
  });
});

function getDistinctHoses(hoses) {
  const distinct = {};
  for (const hose of hoses) {
    if (!hose) continue;
    for (let sphere of hose) {
      distinct[sphere] = true;
    }
  }
  return Object.keys(distinct);
}
