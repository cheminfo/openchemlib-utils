import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { ensureHeterotopicChiralBonds } from '../../diastereotopic/ensureHeterotopicChiralBonds.js';
import { getPathsInfo } from '../getPathsInfo';

describe('getPathsInfo', () => {
  it('propane min:1, max:3, withHOSES', () => {
    const molecule = OCL.Molecule.fromSmiles('CCO');
    molecule.addImplicitHydrogens();
    ensureHeterotopicChiralBonds(molecule);
    const pathsInfo = getPathsInfo(molecule, {
      fromLabel: 'H',
      toLabel: 'H',
      minLength: 1,
      maxLength: 3,
      withHOSES: true,
    });

    const hoses = {};
    for (const atom of pathsInfo) {
      for (const path of atom.paths) {
        for (const hose of path.hoses) {
          hoses[escape(hose.oclID)] = true;
        }
      }
    }

    expect(Object.keys(hoses)).toStrictEqual([
      'eMABYYeIhOzJBIUJIU@',
      'gC%60DALjYRZhCzROtRADjdbUP',
      'gJQDBIeSJS%5DTA%7CiFs%7DD%60QJiHeT',
      'gC%60DALzYRVhC%7EbPHeUdRj@',
      'gJQDDIdsJS%5DUIPOeHv_hdBIUEDj%60',
      'gJQDDIdsJS%5DUIPGzI@bUQQJh',
      'gJQDLIeSJSUTA%7FQHDRjRIU@',
      'gJQDLIeSJSUT@%7FQHDRjRIU@',
      'gCaDHIgSJRu@_tRADjlbUP',
      'gJQDHIgSJRuUDPOhh%7FQHDRjrIU@',
      'gJQDHIgSJRuUDPGzI@bUVQJh',
    ]);

    expect(pathsInfo).toMatchSnapshot();
  });

  it('ethane min:2, max:2, withHOSES', () => {
    const molecule = OCL.Molecule.fromSmiles('CC');
    molecule.addImplicitHydrogens();
    molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
    const pathsInfo = getPathsInfo(molecule, {
      fromLabel: 'H',
      toLabel: 'H',
      minLength: 2,
      maxLength: 2,
      withHOSES: true,
    });

    const hoses = {};
    for (const atom of pathsInfo) {
      for (const path of atom.paths) {
        for (const hose of path.hoses) {
          hoses[escape(hose.oclID)] = true;
        }
      }
    }

    expect(Object.keys(hoses)).toStrictEqual([
      'eMABYYeIhOzJBIUJIU@',
      'gC%60DALjYRZhCzROtRADjdbUP',
      'gC%60DALjYRZhA%7EbPHeTdRj@',
    ]);
    expect(pathsInfo).toMatchSnapshot();
  });

  it('propane min:1, max:3', () => {
    const molecule = OCL.Molecule.fromSmiles('CCO');
    molecule.addImplicitHydrogens();
    ensureHeterotopicChiralBonds(molecule);
    const pathsInfo = getPathsInfo(molecule, {
      fromLabel: 'H',
      toLabel: 'H',
      minLength: 1,
      maxLength: 3,
      withHOSES: true,
    });

    const hoses = {};
    for (const atom of pathsInfo) {
      for (const path of atom.paths) {
        for (const hose of path.hoses) {
          hoses[escape(hose.oclID)] = true;
        }
      }
    }

    expect(pathsInfo).toMatchSnapshot();
  });
});
