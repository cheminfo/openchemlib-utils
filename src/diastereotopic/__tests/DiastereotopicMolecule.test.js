import { readFileSync } from 'fs';
import { join } from 'path';

import { Molecule } from 'openchemlib';

import { toggleHydrogens } from '../../util/toggleHydrogens.ts';
import { DiastereotopicMolecule } from '../DiastereotopicMolecule.js';

describe('DiastereotopicMolecule', () => {
  it('ethanol', () => {
    const molecule = Molecule.fromSmiles('CCCO');
    molecule.setAtomicNo(0, 1);
    const diastereotopicMolecule = new DiastereotopicMolecule(molecule);
    const diaIDs = diastereotopicMolecule.diaIDs;
    expect(diaIDs).toHaveLength(9);
    expect(diaIDs).toStrictEqual([
      'eMHAIhFHhOtdGrj@',
      'eMHAIhFIhOtdWBj@',
      'eMHAIhFJhOtdgBj@',
      'gCaHLIeIZ`GzQ@bUP',
      'gCaHHIeIZ`GzQ@bUP',
      'gCaHLIeIZ`GzQ@bUP',
      'gCaHLIeIZ`GzQ@bUP',
      'gCaHDIeIjiJ@\x7FRHDRj@',
      'gCaHDIeIjiJ@\x7FRHDRj@',
    ]);
    const diaIDsAndH = diastereotopicMolecule.diaIDsAndH;
    expect(diaIDsAndH).toHaveLength(9);
    expect(diaIDsAndH).toMatchSnapshot()
    const molfile = diastereotopicMolecule.toMolfile();
    expect(getMolfileAtoms(molfile)).toStrictEqual(['O', 'C', 'C', 'H']);
    const molfileWithH = diastereotopicMolecule.toMolfileWithH();
    expect(getMolfileAtoms(molfileWithH)).toStrictEqual([
      'O',
      'C',
      'C',
      'H',
      'H',
      'H',
      'H',
      'H',
      'H',
    ]);
    const molfileWithAtomMapNo =
      diastereotopicMolecule.toMolfileWithFinalRanks();
    expect(getMolfileAtoms(molfileWithAtomMapNo)).toStrictEqual([
      'O',
      'C',
      'C',
      'H',
    ]);
    expect(getMolfileAtomMapNo(molfileWithAtomMapNo)).toStrictEqual([
      '3',
      '2',
      '1',
      '8',
    ]);

    function getNewMolecule() {
      const molecule = Molecule.fromSmiles('CCCC')
      molecule.setAtomicNo(2, 8);
      molecule.setAtomicNo(3, 1);
      const newMolfile = diastereotopicMolecule.updateMolfileWithFinalRanks(molecule.toMolfile());
      return Molecule.fromMolfile(newMolfile);
    }

    const newMolecule = getNewMolecule();
    const atoms = []
    for (let i = 0; i < newMolecule.getAllAtoms(); i++) {
      const atom = {
        atomicNo: newMolecule.getAtomicNo(i),
        ...diastereotopicMolecule.diaIDsAndH[diastereotopicMolecule.finalRankToIndex(newMolecule.getAtomMapNo(i))]
      }
      atoms.push(atom);
    }

    expect(atoms).toHaveLength(4);
    expect(atoms).toMatchSnapshot();
  });

  it('ethanol toggle implicit H', () => {
    const molecule = Molecule.fromSmiles('CCO');
    const diastereotopicMolecule = new DiastereotopicMolecule(molecule)

    toggleHydrogens(molecule, 0)
    let newMolecule = Molecule.fromMolfile(diastereotopicMolecule.updateMolfileWithFinalRanks(molecule.toMolfile()));
    let atoms = []
    for (let i = 0; i < newMolecule.getAllAtoms(); i++) {
      const atom = {
        atomicNo: newMolecule.getAtomicNo(i),
        ...diastereotopicMolecule.diaIDsAndH[diastereotopicMolecule.finalRankToIndex(newMolecule.getAtomMapNo(i))]
      }
      atoms.push(atom);
    }
    toggleHydrogens(molecule, 1)
    toggleHydrogens(molecule, 0)
    newMolecule = Molecule.fromMolfile(diastereotopicMolecule.updateMolfileWithFinalRanks(molecule.toMolfile()));
    atoms = []
    for (let i = 0; i < newMolecule.getAllAtoms(); i++) {
      const atom = {
        atomicNo: newMolecule.getAtomicNo(i),
        ...diastereotopicMolecule.diaIDsAndH[diastereotopicMolecule.finalRankToIndex(newMolecule.getAtomMapNo(i))]
      }
      atoms.push(atom);
    }
  })


  it.skip('2-chlorobutane', () => {
    const molecule = Molecule.fromSmiles('C[C@H](Cl)CC');
    const diastereotopicMolecule = new DiastereotopicMolecule(molecule);

    console.log(diastereotopicMolecule.heterotopicSymmetryRanks)
    console.log(diastereotopicMolecule.finalRanks)



  });

  it.skip('cyclosporin', () => {
    const molfile = readFileSync(
      join(__dirname, 'data/cyclosporin.mol'),
      'utf8',
    );
  });
});

function getMolfileAtoms(molfile) {
  const lines = molfile.split(/\r?\n/);
  const atoms = [];
  for (let line of lines) {
    if (line.match(/ [A-Z][a-z]? /)) {
      atoms.push(line.replace(/^.* ([A-Z][a-z]?) .*$/, '$1'));
    }
  }
  return atoms;
}

function getMolfileAtomMapNo(molfile) {
  const lines = molfile.split(/\r?\n/);
  const atomMapNos = [];
  for (let line of lines) {
    if (line.match(/ [A-Z][a-z]? /)) {
      atomMapNos.push(line.replace(/^.* ([0-9]+) {2}0 {2}0$/, '$1'));
    }
  }
  return atomMapNos;
}
