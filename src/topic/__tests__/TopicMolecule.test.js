import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { FifoLogger } from 'fifo-logger';
import { Molecule } from 'openchemlib';
import { describe, expect, it, test } from 'vitest';

import { toggleHydrogens } from '../../util/toggleHydrogens';
import { TopicMolecule } from '../TopicMolecule';

describe('TopicMolecule', () => {
  it('Big molecule', { timeout: 60_000 }, () => {
    //250 carbons
    const logger = new FifoLogger('test.log');
    const molecule = Molecule.fromSmiles('C1CCCC1'.repeat(20));
    const topicMolecule = new TopicMolecule(molecule, { logger });

    expect(topicMolecule.diaIDs).toStrictEqual([]);
    expect(topicMolecule.toMolfileWithH().split('\n')).toHaveLength(549);
    expect(
      topicMolecule.toMolfileWithH({ version: 3 }).split('\n'),
    ).toHaveLength(556);
    expect(logger.getLogs()).toHaveLength(2);

    const topicMolecule2 = new TopicMolecule(molecule, {
      maxNbAtoms: 1000,
      logger,
    });

    expect(topicMolecule2.diaIDs).toHaveLength(262);
    expect(logger.getLogs()).toHaveLength(2);
  });

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
      'gCaHDIeIjiJ@\u007FRHDRj@',
      'gCaHDIeIjiJ@\u007FRHDRj@',
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

    const molfileWithoutH = topicMolecule.toMolfileWithoutH();

    expect(getMolfileAtoms(molfileWithoutH)).toStrictEqual(['O', 'C', 'C']);

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
      'gCaHDIeIjiJ@\u007FRHDRj@': 'eMBBYRZA~d`bUP',
      'eMHAIhFIhOtdWBj@': 'eF@HpLQP_iHNET',
      'gCaHLIeIZ`GzQ@bUP': 'eMBBYRZA~d`bUP',
      'eMHAIhFHhOtdGrj@': 'eMBBYRZA~d`bUP',
    });
  });

  it('atomNo in mapNo', () => {
    const molecule = Molecule.fromSmiles('CCCOC');
    molecule.setAtomicNo(0, 1);
    molecule.setAtomicNo(4, 1);
    const topicMolecule = new TopicMolecule(molecule);
    topicMolecule.setAtomNoInMapNo();
    const molfile = topicMolecule.toMolfile();
    const molfileMapNos = extratMapNo(molfile);

    expect(molfileMapNos).toStrictEqual([1, 2, 3, 4, 5]);

    const molfileWithH = topicMolecule.toMolfileWithH();
    const molfileWithHMapNos = extratMapNo(molfileWithH);

    expect(molfileWithHMapNos).toStrictEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
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
      'gJPHADILuTe@XahOtbEpj`': 'gGPHADIL}URTAbF`\u007FRHWBj@',
      'gGPDALfHRUjjfHC}H`QJh': undefined,
      'gJPHADILuTe@XbhOtbIpj`': 'gGPHADIL}URTAbJ`\u007FRHgBj@',
      'gGPDALfHRYjjThU@_iDBIU@': 'gNpDALfHRYfjiRaTA~dPHeT',
      'gGPDALfHRYjjThQ@_iDBIU@': 'gNpDALfHRYfjiRaDA~dPHeT',
      'gJPHADILuTe@XdhOtbQpj`': 'gGPHADIL}URTAbR`\u007FRIGBj@',
      'gGPDALjHRZzjdhC}H`QJh': 'gNpDALjHRZ~jjR`OtbADj`',
      'gJPHADILuTe@X`hOtbCpfuP': 'gGPHADIL}URTAbB`\u007FRHOB[U@',
      'gJPHADIMuTe@XbhOtbIpj`': 'gGPHADIMmURTAbJ`\u007FRHgBj@',
      'gGPDALzHRVzjbHC}H`QJh': 'gNpDALzHRVvjjH`OtbADj`',
    });
  });

  it('ethanol toggle implicit H', () => {
    const molecule = Molecule.fromSmiles('CCO');
    // set custom label to identify the atom later
    // it should have no effect on the hose codes generation
    molecule.setAtomCustomLabel(0, 'R1');
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

    const firstLayers = hoses.map((hose) => hose[0]);

    expect(firstLayers).toStrictEqual([
      'fH@NJ`uOkoth\\Jh',
      'fH@NJ`uOk_th\\Jh',
      'fI@GEPZgu_zTOeT',
      'fHdrA\u007FRaDj`',
      'fHdrA\u007FRaDj`',
      'fHdrA\u007FRaDj`',
      'fHdrA\u007FRaDj`',
      'fHdrA\u007FRaDj`',
      'fHdrA\u007FRaDj`',
    ]);

    expect(hoses).toHaveLength(9);
    expect(hoses).toMatchSnapshot();
    // stereochemistry must be the same
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

  it('cyclosporin', { timeout: 30_000 }, () => {
    const molfile = readFileSync(
      join(import.meta.dirname, 'data/cyclosporin.mol'),
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
    const ethaneMol = readFileSync(
      join(import.meta.dirname, 'data/ethane.mol'),
      'utf8',
    );
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
      readFileSync(
        join(import.meta.dirname, 'data/ethylvinylether.mol'),
        'utf8',
      ),
    );
    const propylvinylether = Molecule.fromMolfile(
      readFileSync(
        join(import.meta.dirname, 'data/propylvinylether.mol'),
        'utf8',
      ),
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
      'gGQHDIeIgjfR`OtbADj`': 'gNqHDIeIeZjYJ@\u007FRHDRj@',
      'gGQHLIeIUjdA~dPHeT': 'gNqHBIeIgZjYJ@\u007FRHDRj@',
    });
  });
});

test('molfileWithoutH', () => {
  const molfile = `cytisine
Actelion Java MolfileCreator 1.0

 14 16  0  0  1  0  0  0  0  0999 V2000
   -0.6573   -0.3901    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
   -0.6573    1.1073    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.9721   -1.1285    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6504    1.8526    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.6433   -1.1285    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.9721    1.8526    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.2587    1.8526    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    1.9370    1.0652    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.9370   -0.3691    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.2587    1.0723    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -3.2587   -0.3901    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -1.9721   -2.6470    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    1.9932    2.6470    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.2587    0.3339    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  2  1  1  0  0  0  0
  3  1  1  0  0  0  0
  4  2  1  0  0  0  0
  5  1  1  0  0  0  0
  6  2  2  0  0  0  0
  7 14  1  0  0  0  0
  9  8  1  6  0  0  0
  9  5  1  0  0  0  0
 10 11  2  0  0  0  0
 11  3  1  0  0  0  0
 12  3  2  0  0  0  0
 13  4  1  0  0  0  0
 14  9  1  0  0  0  0
  4  8  1  6  0  0  0
  6 10  1  0  0  0  0
 13  7  1  0  0  0  0
M  END
`;

  const molecule = Molecule.fromMolfile(molfile);
  const topicMolecule = new TopicMolecule(molecule);

  const molfile1 = topicMolecule.toMolfile();
  const molfile2 = topicMolecule.toMolfileWithoutH();

  expect(molfile1).toStrictEqual(molfile2);

  const molfileH = topicMolecule.toMolfileWithH();
  const topicMolecule2 = new TopicMolecule(Molecule.fromMolfile(molfileH));
  const molfile3 = topicMolecule2.toMolfileWithoutH();

  expect(molfile1).toStrictEqual(molfile3);
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
      atomMapNos.push(line.replace(/^.* (\d+) {2}0 {2}0$/, '$1'));
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

function extratMapNo(molfile) {
  const lines = molfile.split(/\r?\n/).slice(4);
  const atomMapNos = [];
  for (let line of lines) {
    const atomMapNo = line.split(/\s+/)[14];
    if (atomMapNo) {
      atomMapNos.push(Number(atomMapNo));
    }
  }
  return atomMapNos;
}
