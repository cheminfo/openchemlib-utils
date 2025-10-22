import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { getDiastereotopicAtomIDs } from '../getDiastereotopicAtomIDs';

describe('getDiastereotopicAtomIDs', () => {
  it('CCC', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    const ids = getDiastereotopicAtomIDs(molecule);

    expect(ids).toStrictEqual([
      'eM@Df`Xb`\u007FRP\\Jh',
      'eM@HzAbJC}IApj`',
      'eM@Df`Xb`\u007FRP\\Jh',
    ]);
  });

  it('CCC with custom labels', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.setAtomCustomLabel(0, 'A');
    const ids = getDiastereotopicAtomIDs(molecule);

    expect(ids).toStrictEqual([
      'eM@Df`Xb`\u007FRP\\Jh',
      'eM@HzAbJC}IApj`',
      'eM@Df`Xb`\u007FRP\\Jh',
    ]);
  });

  it('CCC - 2', () => {
    const molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens();
    const ids = getDiastereotopicAtomIDs(molecule);

    expect(ids).toStrictEqual([
      'eM@Df`Xb`\u007FRP\\Jh',
      'eM@HzAbJC}IApj`',
      'eM@Df`Xb`\u007FRP\\Jh',
      'gC`HALiKT@\u007FRHDRj@',
      'gC`HALiKT@\u007FRHDRj@',
      'gC`HALiKT@\u007FRHDRj@',
      'gC`HALiMT@\u007FRHDRj@',
      'gC`HALiMT@\u007FRHDRj@',
      'gC`HALiKT@\u007FRHDRj@',
      'gC`HALiKT@\u007FRHDRj@',
      'gC`HALiKT@\u007FRHDRj@',
    ]);
  });

  it('CC(Cl)CC', () => {
    const molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    const ids = getDiastereotopicAtomIDs(molecule);

    expect(ids).toStrictEqual([
      'gJPHADIMuTe@XbhOtbIpj`',
      'gJPHADILuTe@XdhOtbQpj`',
      'gJPHADILuTe@X`hOtbCpfuP',
      'gJPHADILuTe@XbhOtbIpj`',
      'gJPHADILuTe@XahOtbEpj`',
    ]);
  });

  it('CC(Cl)CC - 2', () => {
    const molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    molecule.addImplicitHydrogens();
    const ids = getDiastereotopicAtomIDs(molecule);

    expect(ids).toStrictEqual([
      'gJPHADIMuTe@XbhOtbIpj`',
      'gJPHADILuTe@XdhOtbQpj`',
      'gJPHADILuTe@X`hOtbCpfuP',
      'gJPHADILuTe@XbhOtbIpj`',
      'gJPHADILuTe@XahOtbEpj`',
      'gGPDALzHRVzjbHC}H`QJh',
      'gGPDALzHRVzjbHC}H`QJh',
      'gGPDALzHRVzjbHC}H`QJh',
      'gGPDALjHRZzjdhC}H`QJh',
      'gGPDALfHRYjjThU@_iDBIU@',
      'gGPDALfHRYjjThQ@_iDBIU@',
      'gGPDALfHRUjjfHC}H`QJh',
      'gGPDALfHRUjjfHC}H`QJh',
      'gGPDALfHRUjjfHC}H`QJh',
    ]);
  });

  it('cyclosporin noH', { timeout: 30_000 }, () => {
    const molfile = readFileSync(
      join(import.meta.dirname, 'data/cyclosporin_noH.mol'),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    const diaIDs = getDiastereotopicAtomIDs(molecule);

    expect(diaIDs).toHaveLength(85);
    expect(diaIDs).toMatchSnapshot();
  });

  it('cyclosporin noH addImplicitHydrogens', { timeout: 30_000 }, () => {
    const molfile = readFileSync(
      join(import.meta.dirname, 'data/cyclosporin_noH.mol'),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    molecule.addImplicitHydrogens();
    const diaIDs = getDiastereotopicAtomIDs(molecule);

    expect(diaIDs).toHaveLength(196);
    expect(diaIDs).toMatchSnapshot();
  });

  it('cyclosporin addImplicitHydrogens', { timeout: 30_000 }, () => {
    const molfile = readFileSync(
      join(import.meta.dirname, 'data/cyclosporin.mol'),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    molecule.addImplicitHydrogens();
    const diaIDs = getDiastereotopicAtomIDs(molecule);

    expect(diaIDs).toHaveLength(196);
    expect(diaIDs).toMatchSnapshot();
  });
});
