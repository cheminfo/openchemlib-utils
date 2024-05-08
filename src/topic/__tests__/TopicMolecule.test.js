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
    const diaIDsAndInfo = topicMolecule.diaIDsAndInfo;
    expect(diaIDsAndInfo).toHaveLength(9);
    expect(diaIDsAndInfo).toMatchSnapshot();
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

  it('mapping to original molecule', () => {
    const molecule = Molecule.fromSmiles('CCCOC');
    for (let i = 0; i < molecule.getAllAtoms(); i++) {
      molecule.setAtomMapNo(i, i + 1, false);
    }
    molecule.setAtomicNo(0, 1);
    molecule.setAtomicNo(4, 1);

    const topicMolecule1 = new TopicMolecule(molecule);
    const molfile = topicMolecule1.toMolfile();

    // imagine we are in the editor
    const molecule2 = Molecule.fromMolfile(molfile);
    toggleHydrogens(molecule2, 2);
    toggleHydrogens(molecule2, 0);
    molecule2.setAtomicNo(0, 1);
    const topicMolecule2 = new TopicMolecule(molecule2);

    const diaIDs1 = topicMolecule1.diaIDsAndInfo;
    const diaIDs2 = topicMolecule2.diaIDsAndInfo.filter(
      (diaID) => diaID.atomMapNo,
    );

    const mapping = {};
    for (const diaID2 of diaIDs2) {
      const newIDCode = diaID2.idCode;
      const oldIDCode = diaIDs1.find(
        (diaID) => diaID.atomMapNo === diaID2.atomMapNo,
      ).idCode;
      if (oldIDCode in mapping) {
        if (mapping[oldIDCode] !== newIDCode) {
          mapping[oldIDCode] = undefined;
        }
      } else {
        mapping[oldIDCode] = newIDCode;
      }
    }
    expect(mapping).toStrictEqual({
      'eMHAIhFJhOtdgBj@': 'eF@HpLQP_iHNET',
      'eMHAIhFIhOtdWBj@': 'eF@HpLQP_iHNET',
      'eMHAIhFHhOtdGrj@': 'eMBBYRZA~d`bUP',
      'gCaHLIeIZ`GzQ@bUP': 'eMBBYRZA~d`bUP',
    });
  });

  it('mapping to original with helpers of ethanol', () => {
    const molecule = Molecule.fromSmiles('CCCOC');
    molecule.setAtomicNo(0, 1);
    molecule.setAtomicNo(4, 1);
    // only thenol left
    const topicMolecule = new TopicMolecule(molecule);
    topicMolecule.ensureMapNo();
    const molfile = topicMolecule.toMolfile();

    // imagine we are in the editor
    const modifiedMolecule = Molecule.fromMolfile(molfile);
    toggleHydrogens(modifiedMolecule, 2);
    toggleHydrogens(modifiedMolecule, 0);
    modifiedMolecule.setAtomicNo(0, 1);
    // only ethane left

    const mapping = topicMolecule.getDiaIDsMapping(modifiedMolecule);

    expect(mapping).toStrictEqual({
      'eMHAIhFJhOtdgBj@': 'eF@HpLQP_iHNET',
      'gCaHDIeIjiJ@\x7FRHDRj@': 'eMBBYRZA~d`bUP',
      'eMHAIhFIhOtdWBj@': 'eF@HpLQP_iHNET',
      'gCaHLIeIZ`GzQ@bUP': 'eMBBYRZA~d`bUP',
      'eMHAIhFHhOtdGrj@': 'eMBBYRZA~d`bUP',
    });
  });

  it('mapping to original with helpers of 2-chlorobutane', () => {
    const molecule = Molecule.fromSmiles('CCC(Cl)C');
    molecule.addImplicitHydrogens();
    const topicMolecule = new TopicMolecule(molecule);
    topicMolecule.ensureMapNo();
    const molfile = topicMolecule.toMolfile();

    // imagine we are in the editor
    const modifiedMolecule = Molecule.fromMolfile(molfile);
    modifiedMolecule.setAtomicNo(6, 6);

    const mapping = topicMolecule.getDiaIDsMapping(modifiedMolecule);

    expect(mapping).toStrictEqual({
      'gJPHADILuTe@XahOtbEpj`': 'gGPHADIL}URTAbF`\x7FRHWBj@',
      'gGPDALfHRUjjfHC}H`QJh': undefined,
      'gJPHADILuTe@XbhOtbIpj`': 'gGPHADIL}URTAbJ`\x7FRHgBj@',
      'gGPDALfHRYjjThU@_iDBIU@': 'gNpDALfHRYfjiRaTA~dPHeT',
      'gGPDALfHRYjjThQ@_iDBIU@': 'gNpDALfHRYfjiRaDA~dPHeT',
      'gJPHADILuTe@XdhOtbQpj`': 'gGPHADIL}URTAbR`\x7FRIGBj@',
      'gGPDALjHRZzjdhC}H`QJh': 'gNpDALjHRZ~jjR`OtbADj`',
      'gJPHADILuTe@X`hOtbCpfuP': 'gGPHADIL}URTAbB`\x7FRHOB[U@',
      'gJPHADIMuTe@XbhOtbIpj`': 'gGPHADIMmURTAbJ`\x7FRHgBj@',
      'gGPDALzHRVzjbHC}H`QJh': 'gNpDALzHRVvjjH`OtbADj`',
    });
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
    expect(hoses[0]).toHaveLength(5);
  });

  it('ethanol with max sphere size', () => {
    const molecule = Molecule.fromSmiles('CCO');
    const topicMolecule = new TopicMolecule(molecule, { maxSphereSize: 5 });

    const hoses = topicMolecule.hoseCodes;
    expect(hoses).toHaveLength(9);
    expect(hoses).toMatchSnapshot();
    expect(hoses[3]).toStrictEqual(hoses[4]);
    expect(hoses).toMatchSnapshot();
    expect(hoses[3]).toHaveLength(6);
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

  it('tert-butanol', () => {
    const molecule = Molecule.fromSmiles('C(C)(C)(C)O');
    const topicMolecule = new TopicMolecule(molecule);
    toggleHydrogens(molecule, 0);
    toggleHydrogens(molecule, 1);
    toggleHydrogens(molecule, 0);
    let advancedMolecule2 = topicMolecule.fromMolecule(molecule);
    const diaIDsObject = advancedMolecule2.getDiaIDsObject();
    expect(Object.keys(diaIDsObject)).toHaveLength(5);
    expect(diaIDsObject).toMatchSnapshot();
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
    expect(topicMolecule.diaIDsAndInfo).toHaveLength(196);
    expect(topicMolecule.hoseCodes).toHaveLength(196);
    first = Date.now() - first;
    const copy = topicMolecule.fromMolecule(molecule);
    let second = Date.now();
    expect(copy.diaIDs).toHaveLength(196);
    expect(copy.diaIDsAndInfo).toHaveLength(196);
    expect(copy.hoseCodes).toHaveLength(196);
    second = Date.now() - second;
    expect(first).toBeGreaterThan(second * 5);
  });

  it('check getAtomIDsFromDiaID and existing H', () => {
    const ethaneMol = readFileSync(join(__dirname, 'data/ethane.mol'), 'utf8');
    // Take care that loading a molfile can reorder atoms !!!
    const molecule = Molecule.fromMolfile(ethaneMol);
    const topicMolecule = new TopicMolecule(molecule);

    const result = topicMolecule.getDiaIDsObject();
    expect(result['eF@HpLQP_iHNET'].existingAtoms).toStrictEqual([0, 1]);
    expect(result['eMBBYRZA~d`bUP'].existingAtoms).toStrictEqual([0, 2, 3, 4]);

    //console.log(topicMolecule.diaIDsAndInfo)
  });

  it('mapping of ethyl vinyl ether', () => {
    const ethylvinylether = Molecule.fromMolfile(
      readFileSync(join(__dirname, 'data/ethylvinylether.mol'), 'utf8'),
    );
    const propylvinylether = Molecule.fromMolfile(
      readFileSync(join(__dirname, 'data/propylvinylether.mol'), 'utf8'),
    );

    const topicMolecule = new TopicMolecule(ethylvinylether);
    const mappings = topicMolecule.getDiaIDsMapping(propylvinylether);
    expect(mappings).toStrictEqual({
      'gJQ@@eKS@LRTGzQHxUP': 'gGQ@@eKtt@qIP_iDcaU@',
      'gJQ@@eKS@LSTGzQLxUP': 'gGQ@@eKtt@qMP_iDsaU@',
      'gJQ@@eKS@LPTGzQ@~UP': 'gGQ@@eKtt@qAP_iDCyU@',
      'gJQ@@eKT`LRTGzQHxUP': 'gGQ@@eJuL@qIP_iDcaU@',
      'gJQ@@eKS@LPtGzQBxUP': 'gGQ@@eKtt@qCP_iDKaU@',
      'gGQHLIeIUfhRS}H`QJh': 'gNqHLIeIUYjaIOtbADj`',
      'gGQHLIeIUfhRK}H`QJh': 'gNqHLIeIUYjaHotbADj`',
      'gGQHDIeIgihA~dPHeT': 'gNqHDIeIgZZ`GzQ@bUP',
      'gGQHDIeIgjfR`OtbADj`': 'gNqHDIeIeZjYJ@\x7FRHDRj@',
      'gGQHLIeIUjdA~dPHeT': 'gNqHBIeIgZjYJ@\x7FRHDRj@',
    });
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
      ...topicMolecule.diaIDsAndInfo[i],
    };
    atomsAndDia.push(atom);
  }
  return atomsAndDia;
}
