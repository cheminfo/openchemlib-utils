import { readFileSync } from 'fs';
import { join } from 'path';

import OCL from 'openchemlib';

import { ensureHeterotopicChiralBonds } from '../ensureHeterotopicChiralBonds';

describe('ensureHeterotopicChiralBonds', () => {
  it('CCO', () => {
    let molecule = OCL.Molecule.fromSmiles('CCO');
    ensureHeterotopicChiralBonds(molecule);
    expect(getStereoBonds(molecule)).toStrictEqual([]);
  });

  it('CCO addImplicitHydrogens', () => {
    let molecule = OCL.Molecule.fromSmiles('CCO');
    molecule.addImplicitHydrogens();
    ensureHeterotopicChiralBonds(molecule);
    expect(getStereoBonds(molecule)).toStrictEqual(['  2  7  1  1  0  0  0']);
  });

  it('CC(Cl)CC', () => {
    let molecule = OCL.Molecule.fromSmiles('CC(Cl)CC');
    ensureHeterotopicChiralBonds(molecule);
    expect(molecule.getIDCode()).toBe('gJPHADILuTe@@');
  });

  it('CCC(C)C', () => {
    let molecule = OCL.Molecule.fromSmiles('CCC(C)C');
    ensureHeterotopicChiralBonds(molecule);
    expect(molecule.toMolfile()).toContain('3  4  1  1');
  });

  it('C[C@H](Cl)CC(C)C', () => {
    let molecule = OCL.Molecule.fromSmiles('C[C@H](Cl)CC(C)C');
    molecule.addImplicitHydrogens();
    ensureHeterotopicChiralBonds(molecule);
    const stereoBonds = getStereoBonds(molecule);
    expect(stereoBonds).toHaveLength(3);
  });

  it('ethanol 2H', () => {
    const molfile = readFileSync(
      join(__dirname, 'data/ethanol_2H.mol'),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    ensureHeterotopicChiralBonds(molecule);
    const stereoBonds = getStereoBonds(molecule);
    expect(stereoBonds).toHaveLength(1);
    expect(stereoBonds).toStrictEqual(['  2  4  1  1  0  0  0']);
  });

  it('cyclosporin', () => {
    const molfile = readFileSync(
      join(__dirname, 'data/cyclosporin.mol'),
      'utf8',
    );
    const molecule = OCL.Molecule.fromMolfile(molfile);
    molecule.addImplicitHydrogens();
    ensureHeterotopicChiralBonds(molecule);
    expect(getStereoBonds(molecule)).toHaveLength(25);
  });
});

function getStereoBonds(molecule) {
  const molfile = molecule.toMolfile();
  const lines = molfile.split(/\r?\n/);
  const stereoBonds = lines.filter((line) =>
    line.match(/ {2}[1,6] {2}0 {2}0 {2}0$/),
  );
  return stereoBonds;
}
