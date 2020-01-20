import OCL from 'openchemlib';

import { getConnectivityMatrix } from '../getConnectivityMatrix';

describe('getConnectivityMatrix', () => {
  it('propane with expanded hydrogens', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    let connectivityMatrix = getConnectivityMatrix(OCL, molecule);
    expect(connectivityMatrix).toStrictEqual([
      [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    ]);
  });

  it('benzene', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = getConnectivityMatrix(OCL, molecule);
    expect(connectivityMatrix).toStrictEqual([
      [1, 1, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0],
      [0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0],
      [0, 0, 0, 1, 1, 1],
      [1, 0, 0, 0, 1, 1],
    ]);
  });

  it('benzene with single, double, triple', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = getConnectivityMatrix(OCL, molecule, {
      sdt: true,
    });
    expect(connectivityMatrix).toStrictEqual([
      [1, 2, 0, 0, 0, 1],
      [2, 1, 1, 0, 0, 0],
      [0, 1, 1, 2, 0, 0],
      [0, 0, 2, 1, 1, 0],
      [0, 0, 0, 1, 1, 2],
      [1, 0, 0, 0, 2, 1],
    ]);
  });

  it('benzene with mass diagonal', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = getConnectivityMatrix(OCL, molecule, {
      mass: true,
    });
    expect(connectivityMatrix).toStrictEqual([
      [12, 1, 0, 0, 0, 1],
      [1, 12, 1, 0, 0, 0],
      [0, 1, 12, 1, 0, 0],
      [0, 0, 1, 12, 1, 0],
      [0, 0, 0, 1, 12, 1],
      [1, 0, 0, 0, 1, 12],
    ]);
  });

  it('benzene with atomic number on diagonal', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = getConnectivityMatrix(OCL, molecule, {
      atomicNo: true,
    });
    expect(connectivityMatrix).toStrictEqual([
      [6, 1, 0, 0, 0, 1],
      [1, 6, 1, 0, 0, 0],
      [0, 1, 6, 1, 0, 0],
      [0, 0, 1, 6, 1, 0],
      [0, 0, 0, 1, 6, 1],
      [1, 0, 0, 0, 1, 6],
    ]);
  });

  it('benzene pathLength matrix', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = getConnectivityMatrix(OCL, molecule, {
      pathLength: true,
    });
    expect(connectivityMatrix).toStrictEqual([
      [0, 1, 2, 3, 2, 1],
      [1, 0, 1, 2, 3, 2],
      [2, 1, 0, 1, 2, 3],
      [3, 2, 1, 0, 1, 2],
      [2, 3, 2, 1, 0, 1],
      [1, 2, 3, 2, 1, 0],
    ]);
  });
});
