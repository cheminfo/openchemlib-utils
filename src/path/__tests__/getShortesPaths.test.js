import OCL from 'openchemlib';
import { expect, it, describe } from 'vitest';

import { getShortestPaths } from '../getShortestPaths';

describe('getShortestPaths', () => {
  it('CC', () => {
    const molecule = OCL.Molecule.fromSmiles('CC');
    molecule.addImplicitHydrogens();
    const paths = getShortestPaths(molecule);
    //Atoms 0 and 1 are Carbons. So we must get path[0][1] = [0, 1]
    expect(paths[0][1]).toStrictEqual([0, 1]);
    //hydrogens 2, 3, and 4 must be attached to atom 0 and hydrogens 5, 6, and 7 must be attached to atom 1
    expect(paths[0][2]).toStrictEqual([0, 2]);
    expect(paths[0][3]).toStrictEqual([0, 3]);
    expect(paths[0][4]).toStrictEqual([0, 4]);
    expect(paths[1][5]).toStrictEqual([1, 5]);
    expect(paths[1][6]).toStrictEqual([1, 6]);
    expect(paths[1][7]).toStrictEqual([1, 7]);
    //hydrogens 2 and 3 must be attached to same carbon. The path must be symetric
    expect(paths[2][3]).toStrictEqual([2, 0, 3]);
    expect(paths[3][2]).toStrictEqual([3, 0, 2]);
    //hydrogens 5 and 7 must be attached to same carbon. The path must be symetric
    expect(paths[5][7]).toStrictEqual([5, 1, 7]);
    expect(paths[7][5]).toStrictEqual([7, 1, 5]);
    //hydrogens 3 and 6 must be attached to different carbons, so the path must be longest possible.
    expect(paths[3][6]).toStrictEqual([3, 0, 1, 6]);
    expect(paths[6][3]).toStrictEqual([6, 1, 0, 3]);
  });

  it('C.C', () => {
    const molecule = OCL.Molecule.fromSmiles('C.C');

    molecule.addImplicitHydrogens();
    const paths = getShortestPaths(molecule);
    expect(paths[0]).toStrictEqual([
      [0],
      null,
      [0, 2],
      [0, 3],
      [0, 4],
      [0, 5],
      null,
      null,
      null,
      null,
    ]);
    expect(paths).toMatchSnapshot();
  });
});
