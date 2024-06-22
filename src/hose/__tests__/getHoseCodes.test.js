import { readFileSync } from 'fs';
import { join } from 'path';

import { Molecule } from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { getHoseCodes } from '../getHoseCodes';

// check the codes online on
// https://www.cheminfo.org/?viewURL=https%3A%2F%2Fcouch.cheminfo.org%2Fcheminfo-public%2F1cc9e892242664b1d5a37312bda159ef%2Fview.json&loadversion=true&fillsearch=Display+OCLcode+oclID

describe('getHoseCodes', () => {
  it('methane', () => {
    const molecule = Molecule.fromSmiles('C');
    const hoseCodes = getHoseCodes(molecule, {
      maxSphereSize: 1,
    });
    expect(hoseCodes).toStrictEqual([
      ['fH@NJ`uOk\x7Fth\\Jh', 'fH@NJ`uOk\x7Fth\\Jh'],
      ['fHdrA\x7FRaDj`', 'eFBBYcAuSzn\x7FRPQJh'],
      ['fHdrA\x7FRaDj`', 'eFBBYcAuSzn\x7FRPQJh'],
      ['fHdrA\x7FRaDj`', 'eFBBYcAuSzn\x7FRPQJh'],
      ['fHdrA\x7FRaDj`', 'eFBBYcAuSzn\x7FRPQJh'],
    ]);
  });

  it('Hc1ccccc1', () => {
    const molecule = Molecule.fromSmiles('Cc1ccccc1');
    molecule.setAtomicNo(0, 1);
    const hoses = getHoseCodes(molecule, { maxSphereSize: 2 });
    const distincts = getDistinctHoses(hoses);
    expect(distincts.length).toBe(6);
    expect(distincts).toStrictEqual([
      'fH@NJ`uWj\x7Fth\\Jj|D@',
      'eM@HpCbJCVUM{Kk[\x7FRP\\Jj~AHHa@',
      'gJP@DiP@CbB`uQRUhwjKej}Yo}H`\\Jj}@RADDpPa@',
      'fHdrA\x7FRaDj`',
      'eFBBYcAuUzg\x7FRPQJj}A@',
      'gC`HALiM@AuiJu{Qu^o}H`QJj~`QALD@',
    ]);
  });

  it('ethanol only C and O', () => {
    const molecule = Molecule.fromSmiles('CCO');
    const hoseCodes = getHoseCodes(molecule, {
      atomLabels: ['C', 'O'],
      maxSphereSize: 0,
    });
    expect(hoseCodes).toStrictEqual([
      ['fH@NJ`uOkoth\\Jh'],
      ['fH@NJ`uOk_th\\Jh'],
      ['fI@GEPZgu_zTOeT'],
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });

  it('cyclopropane', () => {
    const molecule = Molecule.fromSmiles('C1CC1');

    const hoseCodes = getHoseCodes(molecule, {
      minSphereSize: 0,
      maxSphereSize: 3,
      atomLabels: ['C'],
    });
    const distincts = getDistinctHoses(hoseCodes);
    expect(distincts).toStrictEqual([
      'fH@NJ`uOk_th\\Jj|`@',
      'eO@HyjCbJCVLk{Mm]\x7FRP\\Jj~HI@h@',
    ]);
  });

  it('vinyl chloride E/Z', () => {
    const molecule = Molecule.fromSmiles('C=CCl');
    const hoseCodes = getHoseCodes(molecule, {
      atomLabels: ['H'],
      maxSphereSize: 3,
    });
    expect(hoseCodes).toStrictEqual([
      undefined,
      undefined,
      undefined,
      [
        'fHdrA\x7FRaDj`',
        'eFBBYcAuSzk\x7FRPQJh',
        'eMBBYRYCie_M[_zRBIU@',
        'gC`DALzHRVXRORbgrej\x7FtbADj`',
      ],
      [
        'fHdrA\x7FRaDj`',
        'eFBBYcAuSzk\x7FRPQJh',
        'eMBBYRYCie_M[_zRBIU@',
        'gC`DALzHRVXRWRbgrej\x7FtbADj`',
      ],
      [
        'fHdrA\x7FRaDj`',
        'eFBBYcAuSzg\x7FRPQJh',
        'gC`DALjHRZdCiQsyQ}ozQ@bUP',
        'gC`DALjHRZdCiQsyQ}ozQ@bUP',
      ],
    ]);
  });

  it('2-chlorobutane R/S', () => {
    const molecule = Molecule.fromSmiles('C[C@@H](Cl)CC');
    const hoseCodes = getHoseCodes(molecule, {
      maxSphereSize: 3,
      minSphereSize: 3,
    });
    // 9 and 10 should be diastereotopic
    expect(hoseCodes[9]).not.toStrictEqual(hoseCodes[10]);
    const nine = Molecule.fromIDCode(hoseCodes[9][0]);
    nine.stripStereoInformation();
    const ten = Molecule.fromIDCode(hoseCodes[9][0]);
    ten.stripStereoInformation();
    expect(nine.getIDCode()).toStrictEqual(ten.getIDCode());

    expect(hoseCodes).toStrictEqual([
      ['gJPHADIMuTe@xbhMFJ\\e|YZ{Z^\x7FRHgBj@'],
      ['gJPHADILuTe@xdhMFJ\\e|YZw\\^\x7FRIGBj@'],
      ['gJPHADILuTe@x`hMFJ\\e|YZw\\^\x7FRHOB[U@'],
      ['gJPHADILuTe@xbhMFJ\\e|YZw\\^\x7FRHgBj@'],
      ['gJPHADILuTe@xahMFJ\\e|YZw\\^\x7FRHWBj@'],
      ['gJPDALzHRVjhbAuhiK{SUYw}H`QJh'],
      ['gJPDALzHRVjhbAuhiK{SUYw}H`QJh'],
      ['gJPDALzHRVjhbAuhiK{SUYw}H`QJh'],
      ['gGPDALjHRZzjdhGQcdm_FOmOWotbADj`'],
      ['gGPDALfHRYjjThQ@zLTykxru^z}~dPHeT'],
      ['gGPDALfHRYjjThU@zLTykxru^z}~dPHeT'],
      ['gC`HALiKTAuhis{SUno}H`QJh'],
      ['gC`HALiKTAuhis{SUno}H`QJh'],
      ['gC`HALiKTAuhis{SUno}H`QJh'],
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
    expect(distincts.length).toBe(45);
    expect(distincts).toMatchSnapshot();

    hoseCodes = getHoseCodes(molecule, { maxSphereSize: 1, atomLabels: ['C'] });
    expect(hoseCodes.length).toBe(196);
    distincts = getDistinctHoses(hoseCodes);
    expect(distincts.length).toBe(28);
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
    for (const sphere of hose) {
      distinct[sphere] = true;
    }
  }
  return Object.keys(distinct);
}
