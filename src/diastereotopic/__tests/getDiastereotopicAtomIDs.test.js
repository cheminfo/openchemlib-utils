import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { getDiastereotopicAtomIDs } from '../getDiastereotopicAtomIDs';

describe('getDiastereotopicAtomIDs', () => {
  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    let ids = getDiastereotopicAtomIDs(molecule);
    expect(ids).toStrictEqual(
      ['eM@Df`Xb`\x7FRP\\Jh', 'eM@HzAbJC}IApj`', 'eM@Df`Xb`\x7FRP\\Jh']
    );
  });

  it('CCC', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC');
    molecule.addImplicitHydrogens()
    let ids = getDiastereotopicAtomIDs(molecule);
    expect(ids).toStrictEqual(
      [
        'eM@Df`Xb`\x7FRP\\Jh',
        'eM@HzAbJC}IApj`',
        'eM@Df`Xb`\x7FRP\\Jh',
        'gC`HALiKT@\x7FRHDRj@',
        'gC`HALiKT@\x7FRHDRj@',
        'gC`HALiKT@\x7FRHDRj@',
        'gC`HALiMT@\x7FRHDRj@',
        'gC`HALiMT@\x7FRHDRj@',
        'gC`HALiKT@\x7FRHDRj@',
        'gC`HALiKT@\x7FRHDRj@',
        'gC`HALiKT@\x7FRHDRj@'
      ]
    );
  });


  it('CC(Cl)CC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    let ids = getDiastereotopicAtomIDs(molecule);
    expect(ids).toStrictEqual([
      'gJPHADIMuTe@XbhOtbIpj`',
      'gJPHADILuTe@XdhOtbQpj`',
      'gJPHADILuTe@X`hOtbCpfuP',
      'gJPHADILuTe@XbhOtbIpj`',
      'gJPHADILuTe@XahOtbEpj`',
    ]);
  });

  it('CC(Cl)CC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    molecule.addImplicitHydrogens()
    let ids = getDiastereotopicAtomIDs(molecule);
    expect(ids).toStrictEqual(
      [
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
        'gGPDALfHRUjjfHC}H`QJh'
      ]
    );
  });

  it('cyclosporin noH', () => {
    const molfile = readFileSync(
      join(__dirname, 'data/cyclosporin_noH.mol'),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    const diaIDs = getDiastereotopicAtomIDs(molecule);
    expect(diaIDs).toHaveLength(85);
    expect(diaIDs).toMatchSnapshot()
  });

  it('cyclosporin noH addImplicitHydrogens', () => {
    const molfile = readFileSync(
      join(__dirname, 'data/cyclosporin_noH.mol'),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    molecule.addImplicitHydrogens();
    const diaIDs = getDiastereotopicAtomIDs(molecule);
    expect(diaIDs).toHaveLength(196);
    expect(diaIDs).toMatchSnapshot()
  });

  it('cyclosporin addImplicitHydrogens', () => {
    const molfile = readFileSync(
      join(__dirname, 'data/cyclosporin.mol'),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    molecule.addImplicitHydrogens();
    const diaIDs = getDiastereotopicAtomIDs(molecule);
    expect(diaIDs).toHaveLength(196);
    expect(diaIDs).toMatchSnapshot()
  });
});
