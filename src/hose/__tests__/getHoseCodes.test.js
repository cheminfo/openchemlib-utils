import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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
      ['fH@NJ`uOk\u007Fth\\Jh', 'fH@NJ`uOk\u007Fth\\Jh'],
      ['fHdrA\u007FRaDj`', 'eFBBYcAuSzn\u007FRPQJh'],
      ['fHdrA\u007FRaDj`', 'eFBBYcAuSzn\u007FRPQJh'],
      ['fHdrA\u007FRaDj`', 'eFBBYcAuSzn\u007FRPQJh'],
      ['fHdrA\u007FRaDj`', 'eFBBYcAuSzn\u007FRPQJh'],
    ]);
  });

  it('Hc1ccccc1', () => {
    const molecule = Molecule.fromSmiles('Cc1ccccc1');
    molecule.setAtomicNo(0, 1);
    const hoses = getHoseCodes(molecule, { maxSphereSize: 2 });
    const distincts = getDistinctHoses(hoses);
    expect(distincts.length).toBe(6);
    expect(distincts).toStrictEqual([
      'fH@NJ`uWj\u007Fth\\Jj|D@',
      'eM@HpCbJCVUM{Kk[\u007FRP\\Jj~AHHa@',
      'gJP@DiP@CbB`uQRUhwjKej}Yo}H`\\Jj}@RADDpPa@',
      'fHdrA\u007FRaDj`',
      'eFBBYcAuUzg\u007FRPQJj}A@',
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
      'eO@HyjCbJCVLk{Mm]\u007FRP\\Jj~HI@h@',
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
        'fHdrA\u007FRaDj`',
        'eFBBYcAuSzk\u007FRPQJh',
        'eMBBYRYCie_M[_zRBIU@',
        'gC`DALzHRVXRORbgrej\u007FtbADj`',
      ],
      [
        'fHdrA\u007FRaDj`',
        'eFBBYcAuSzk\u007FRPQJh',
        'eMBBYRYCie_M[_zRBIU@',
        'gC`DALzHRVXRWRbgrej\u007FtbADj`',
      ],
      [
        'fHdrA\u007FRaDj`',
        'eFBBYcAuSzg\u007FRPQJh',
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
      ['gJPHADIMuTe@xbhMFJ\\e|YZ{Z^\u007FRHgBj@'],
      ['gJPHADILuTe@xdhMFJ\\e|YZw\\^\u007FRIGBj@'],
      ['gJPHADILuTe@x`hMFJ\\e|YZw\\^\u007FRHOB[U@'],
      ['gJPHADILuTe@xbhMFJ\\e|YZw\\^\u007FRHgBj@'],
      ['gJPHADILuTe@xahMFJ\\e|YZw\\^\u007FRHWBj@'],
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
