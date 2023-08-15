import { readFileSync } from 'fs';
import { join } from 'path';

import { Molecule } from 'openchemlib';
import { describe, it, expect } from 'vitest';

import { toggleHydrogens } from '../../util/toggleHydrogens';
import { TopicMolecule } from '../TopicMolecule';

describe('TopicMolecule', () => {
  it('ethanol', () => {
    const molecule = Molecule.fromSmiles('CCCO');
    molecule.setAtomicNo(0, 1);
    const topicMolecule = new TopicMolecule(molecule);
    const diaIDs = topicMolecule.diaIDs;
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
    const diaIDsAndH = topicMolecule.diaIDsAndH;
    expect(diaIDsAndH).toHaveLength(9);
    expect(diaIDsAndH).toMatchSnapshot();
    const molfile = topicMolecule.toMolfile();
    expect(getMolfileAtoms(molfile)).toStrictEqual(['O', 'C', 'C', 'H']);
    const molfileWithH = topicMolecule.toMolfileWithH();
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

    function getNewMolecule() {
      const molecule = Molecule.fromSmiles('CCCC');
      molecule.setAtomicNo(2, 8);
      molecule.setAtomicNo(3, 1);
      return Molecule.fromMolfile(molecule.toMolfile());
    }

    const newAdvancedMolecule = topicMolecule.fromMolecule(getNewMolecule());
    expect(newAdvancedMolecule.diaIDs).toHaveLength(9);
    const groupedDiaIDs = newAdvancedMolecule.getGroupedDiastereotopicAtomIDs();
    expect(groupedDiaIDs).toHaveLength(6);
    expect(groupedDiaIDs).toMatchSnapshot();
  });

  it('ethanol toggle implicit H', () => {
    const molecule = Molecule.fromSmiles('CCO');
    const topicMolecule = new TopicMolecule(molecule);
    let atoms = getAtomsAndDiaInfo(topicMolecule);
    expect(atoms).toHaveLength(3);
    expect(atoms).toMatchSnapshot();

    toggleHydrogens(molecule, 0);

    let advancedMolecule2 = topicMolecule.fromMolecule(molecule);
    atoms = getAtomsAndDiaInfo(advancedMolecule2);
    expect(atoms).toHaveLength(6);
    expect(atoms).toMatchSnapshot();

    toggleHydrogens(molecule, 1);
    toggleHydrogens(molecule, 0);

    advancedMolecule2 = topicMolecule.fromMolecule(molecule);
    atoms = getAtomsAndDiaInfo(advancedMolecule2);
    expect(atoms).toHaveLength(5);
    expect(atoms).toMatchSnapshot();

    const hoses = advancedMolecule2.hoseCodes;
    expect(hoses).toHaveLength(9);
    expect(hoses).toMatchSnapshot();
    expect(hoses[3]).toStrictEqual(hoses[4]);
    expect(hoses).toMatchSnapshot();
  });

  it('2-chlorobutane', () => {
    const molecule = Molecule.fromSmiles('C[C@H](Cl)CC');
    const topicMolecule = new TopicMolecule(molecule);
    toggleHydrogens(molecule, 0);
    toggleHydrogens(molecule, 1);
    toggleHydrogens(molecule, 0);
    let advancedMolecule2 = topicMolecule.fromMolecule(molecule);
    let atoms = getAtomsAndDiaInfo(advancedMolecule2);
    expect(atoms).toHaveLength(6);
    expect(atoms).toMatchSnapshot();
  });

  it('cyclosporin', () => {
    const molfile = readFileSync(
      join(__dirname, 'data/cyclosporin.mol'),
      'utf8',
    );
    const molecule = Molecule.fromMolfile(molfile);
    const topicMolecule = new TopicMolecule(molecule);
    let first = Date.now();
    expect(topicMolecule.diaIDs).toHaveLength(196);
    expect(topicMolecule.diaIDsAndH).toHaveLength(196);
    expect(topicMolecule.hoseCodes).toHaveLength(196);
    first = Date.now() - first;
    const copy = topicMolecule.fromMolecule(molecule);
    let second = Date.now();
    expect(copy.diaIDs).toHaveLength(196);
    expect(copy.diaIDsAndH).toHaveLength(196);
    expect(copy.hoseCodes).toHaveLength(196);
    second = Date.now() - second;
    expect(first).toBeGreaterThan(second * 5);
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

// eslint-disable-next-line no-unused-vars
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

function getAtomsAndDiaInfo(topicMolecule) {
  const molecule = topicMolecule.molecule;
  const atomsAndDia = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const atom = {
      atomicNo: molecule.getAtomicNo(i),
      ...topicMolecule.diaIDsAndH[i],
    };
    atomsAndDia.push(atom);
  }
  return atomsAndDia;
}
