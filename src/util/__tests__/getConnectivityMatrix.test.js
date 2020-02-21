import OCL from 'openchemlib';

import { getConnectivityMatrix } from '../getConnectivityMatrix';
import { initOCL } from '../../OCL';

initOCL(OCL);

describe('getConnectivityMatrix', () => {
  it('propane with expanded hydrogens', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();

    let connectivityMatrix = getConnectivityMatrix(molecule);
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
    let connectivityMatrix = getConnectivityMatrix(molecule);
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
    let connectivityMatrix = getConnectivityMatrix(molecule, {
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
    let connectivityMatrix = getConnectivityMatrix(molecule, {
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

  it.only('benzene with single, double, triple, aromatic', () => {
    let molecule = OCL.Molecule.fromSmiles('Cc1ccccc1');
    let connectivityMatrix = getConnectivityMatrix(molecule, {
      sdta: true,
    });
    expect(connectivityMatrix).toStrictEqual([
      [1, 1, 0, 0, 0, 0, 0],
      [1, 1, 4, 0, 0, 0, 4],
      [0, 4, 1, 4, 0, 0, 0],
      [0, 0, 4, 1, 4, 0, 0],
      [0, 0, 0, 4, 1, 4, 0],
      [0, 0, 0, 0, 4, 1, 4],
      [0, 4, 0, 0, 0, 4, 1],
    ]);
  });
  it('benzene with atomic number on diagonal', () => {
    let molecule = OCL.Molecule.fromSmiles('c1ccccc1');
    let connectivityMatrix = getConnectivityMatrix(molecule, {
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
    let connectivityMatrix = getConnectivityMatrix(molecule, {
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
