import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { TopicMolecule } from '../TopicMolecule';

function getCh2ProLabels(smiles) {
  const molecule = Molecule.fromSmiles(smiles);
  const topicMolecule = new TopicMolecule(molecule);
  const moleculeWithH = topicMolecule.moleculeWithH;
  const diaIDs = topicMolecule.diaIDs;

  let ch2Hydrogens = [];
  for (let atom = 0; atom < moleculeWithH.getAllAtoms(); atom++) {
    if (moleculeWithH.getAtomicNo(atom) !== 6) continue;
    const hs = [];
    let nonH = 0;
    for (let j = 0; j < moleculeWithH.getAllConnAtoms(atom); j++) {
      const conn = moleculeWithH.getConnAtom(atom, j);
      if (moleculeWithH.getAtomicNo(conn) === 1) {
        hs.push(conn);
      } else {
        nonH++;
      }
    }
    if (hs.length === 2 && nonH === 2) {
      ch2Hydrogens = hs;
      break;
    }
  }

  topicMolecule.setProchiralHydrogenLabels();

  return {
    diaID0: diaIDs[ch2Hydrogens[0]],
    diaID1: diaIDs[ch2Hydrogens[1]],
    label0: moleculeWithH.getAtomCustomLabel(ch2Hydrogens[0]),
    label1: moleculeWithH.getAtomCustomLabel(ch2Hydrogens[1]),
  };
}

function getHydrogenLabels(topicMolecule) {
  const molecule = topicMolecule.moleculeWithH;
  const labels = [];
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) {
    if (molecule.getAtomicNo(atom) !== 1) continue;
    const heavyAtom = molecule.getConnAtom(atom, 0);
    const customLabel = molecule.getAtomCustomLabel(atom);
    if (customLabel) {
      labels.push({ hydrogen: atom, heavyAtom, label: customLabel });
    }
  }
  return labels;
}

test('CC[C@H](C)Cl: diaIDs and pro-R/pro-S assignment of the CH2 hydrogens', () => {
  const molecule = Molecule.fromSmiles('CC[C@H](C)Cl');
  const topicMolecule = new TopicMolecule(molecule);
  const moleculeWithH = topicMolecule.moleculeWithH;
  const diaIDs = topicMolecule.diaIDs;

  let ch2Hydrogens = [];
  for (let atom = 0; atom < moleculeWithH.getAllAtoms(); atom++) {
    if (moleculeWithH.getAtomicNo(atom) !== 6) continue;
    const hs = [];
    let nonH = 0;
    for (let j = 0; j < moleculeWithH.getAllConnAtoms(atom); j++) {
      const conn = moleculeWithH.getConnAtom(atom, j);
      if (moleculeWithH.getAtomicNo(conn) === 1) {
        hs.push(conn);
      } else {
        nonH++;
      }
    }
    if (hs.length === 2 && nonH === 2) {
      ch2Hydrogens = hs;
      break;
    }
  }

  expect(ch2Hydrogens).toHaveLength(2);

  const diaID0 = diaIDs[ch2Hydrogens[0]];
  const diaID1 = diaIDs[ch2Hydrogens[1]];

  expect(diaID0).toBe('gGPDALfHRYjjThU@_iDBIU@');
  expect(diaID1).toBe('gGPDALfHRYjjThQ@_iDBIU@');

  const count = topicMolecule.setProchiralHydrogenLabels();

  expect(count).toBe(2);

  const label0 = moleculeWithH.getAtomCustomLabel(ch2Hydrogens[0]);
  const label1 = moleculeWithH.getAtomCustomLabel(ch2Hydrogens[1]);

  expect([label0, label1].toSorted()).toStrictEqual(['r', 's']);

  // Snapshot captures the diaID → r/s mapping for verification in external software
  expect({ [diaID0]: label0, [diaID1]: label1 }).toMatchSnapshot();
});

test('CC[C@@H](C)Cl vs CC[C@H](C)Cl: a diastereotopic environment gets opposite pro-R/pro-S between enantiomers', () => {
  const atH = getCh2ProLabels('CC[C@H](C)Cl');
  const aatH = getCh2ProLabels('CC[C@@H](C)Cl');

  // The two CH2 protons are constitutionally identical, so OCL orders them by
  // their stereo environment. That ordering swaps between the two separately
  // parsed enantiomers: the racemic diaID at position 0 of one molecule equals
  // the diaID at position 1 of the other (same two IDs, opposite atom indices).
  expect(atH.diaID0).toBe(aatH.diaID1);
  expect(atH.diaID1).toBe(aatH.diaID0);

  // Defining property of enantiomers: the SAME diastereotopic environment is
  // pro-R in one and pro-S in the other. Since the environment at position 0 of
  // `atH` is the environment at position 1 of `aatH` (asserted above), their
  // labels must be OPPOSITE — not equal. Comparing labels by atom index is a
  // trap: because the environment swaps index between enantiomers, the label at
  // a fixed index stays the same while the per-environment label inverts.
  expect(atH.label0).not.toBe(aatH.label1);
  expect(atH.label1).not.toBe(aatH.label0);

  // Equivalently, mapping each racemic diaID to its r/s label yields fully
  // inverted maps between the two enantiomers.
  const mapA = { [atH.diaID0]: atH.label0, [atH.diaID1]: atH.label1 };
  const mapB = { [aatH.diaID0]: aatH.label0, [aatH.diaID1]: aatH.label1 };
  for (const diaID of Object.keys(mapA)) {
    expect(mapA[diaID]).not.toBe(mapB[diaID]);
  }
});

test('CC(Cl)CC: the CH2 hydrogens get distinct pro-R / pro-S labels', () => {
  const molecule = Molecule.fromSmiles('CC(Cl)CC');
  const topicMolecule = new TopicMolecule(molecule);
  const count = topicMolecule.setProchiralHydrogenLabels();

  expect(count).toBe(2);

  const labels = getHydrogenLabels(topicMolecule)
    .map((l) => l.label)
    .toSorted();

  expect(labels).toStrictEqual(['r', 's']);
});

test('CC1CCC1 (methylcyclobutane): the four CH2 hydrogens at C2/C4 are labelled, the apex CH2 is not', () => {
  const molecule = Molecule.fromSmiles('CC1CCC1');
  const topicMolecule = new TopicMolecule(molecule);
  const count = topicMolecule.setProchiralHydrogenLabels();

  expect(count).toBe(4);

  const labels = getHydrogenLabels(topicMolecule)
    .map((l) => l.label)
    .toSorted();

  expect(labels).toStrictEqual(['r', 'r', 's', 's']);
});

test('CC(Cl)CC: heavy-atom customLabel is inherited by the labelled hydrogens', () => {
  const molecule = Molecule.fromSmiles('CC(Cl)CC');
  const topicMolecule = new TopicMolecule(molecule);
  const moleculeWithH = topicMolecule.moleculeWithH;
  for (let atom = 0; atom < moleculeWithH.getAllAtoms(); atom++) {
    if (moleculeWithH.getAtomicNo(atom) !== 6) continue;
    let hydrogenCount = 0;
    let nonHydrogenCount = 0;
    for (let j = 0; j < moleculeWithH.getAllConnAtoms(atom); j++) {
      if (moleculeWithH.getAtomicNo(moleculeWithH.getConnAtom(atom, j)) === 1) {
        hydrogenCount++;
      } else {
        nonHydrogenCount++;
      }
    }
    if (hydrogenCount === 2 && nonHydrogenCount === 2) {
      moleculeWithH.setAtomCustomLabel(atom, '3');
      break;
    }
  }
  topicMolecule.setProchiralHydrogenLabels();
  const labels = getHydrogenLabels(topicMolecule)
    .map((l) => l.label)
    .filter((l) => l.startsWith('3'))
    .toSorted();

  expect(labels).toStrictEqual(['3r', '3s']);
});

test('prochiralities is an atom-indexed cached array of r/s/undefined', () => {
  const molecule = Molecule.fromSmiles('CC(Cl)CC');
  const topicMolecule = new TopicMolecule(molecule);
  const labels = topicMolecule.prochiralities;

  expect(labels).toHaveLength(topicMolecule.moleculeWithH.getAllAtoms());
  expect(labels.filter((l) => l !== undefined).toSorted()).toStrictEqual([
    'r',
    's',
  ]);

  // Re-reading must return the very same array reference (cached, not recomputed).
  expect(topicMolecule.prochiralities).toBe(labels);
});

test('canonizedProchiralities is transferred across TopicMolecule instances with the same idCode', () => {
  // fromMolecule passes the canonized cache through, so a re-instantiation
  // (e.g. after expanding hydrogens) should not recompute CIP.
  const molecule = Molecule.fromSmiles('CC(Cl)CC');
  const original = new TopicMolecule(molecule);
  const labels = original.prochiralities;
  const labelledCount = labels.filter((l) => l !== undefined).length;

  expect(labelledCount).toBe(2);

  const oclModule = molecule.getOCL().Molecule;
  let cipCalls = 0;
  const originalEnsure = oclModule.prototype.ensureHelperArrays;
  oclModule.prototype.ensureHelperArrays = function spy(bits) {
    if (bits === oclModule.cHelperCIP) cipCalls++;
    return originalEnsure.call(this, bits);
  };

  try {
    const reused = original.fromMolecule(molecule);
    const reusedLabels = reused.prochiralities;

    expect(
      reusedLabels.filter((l) => l !== undefined).toSorted(),
    ).toStrictEqual(['r', 's']);
    expect(cipCalls).toBe(0);
  } finally {
    oclModule.prototype.ensureHelperArrays = originalEnsure;
  }
});

test('CC(Cl)CC: implicit-H molecule gets no labels, only moleculeWithH does', () => {
  const molecule = Molecule.fromSmiles('CC(Cl)CC');
  const topicMolecule = new TopicMolecule(molecule);
  topicMolecule.setProchiralHydrogenLabels();

  // No explicit Hs in the original molecule, so nothing to label there.
  const inMolecule = [];
  for (let atom = 0; atom < topicMolecule.molecule.getAllAtoms(); atom++) {
    const label = topicMolecule.molecule.getAtomCustomLabel(atom);
    if (label) inMolecule.push(label);
  }

  expect(inMolecule).toStrictEqual([]);

  // moleculeWithH has all Hs explicit and gets the two prochiral labels.
  const inMoleculeWithH = getHydrogenLabels(topicMolecule)
    .map((l) => l.label)
    .toSorted();

  expect(inMoleculeWithH).toStrictEqual(['r', 's']);
});

test('explicit-H molecule: both molecule and moleculeWithH get labels', () => {
  // Build a copy of CC(Cl)CC that has explicit hydrogens already.
  const base = Molecule.fromSmiles('CC(Cl)CC');
  base.addImplicitHydrogens();
  const topicMolecule = new TopicMolecule(base);
  topicMolecule.setProchiralHydrogenLabels();

  const inMolecule = [];
  for (let atom = 0; atom < topicMolecule.molecule.getAllAtoms(); atom++) {
    if (topicMolecule.molecule.getAtomicNo(atom) !== 1) continue;
    const label = topicMolecule.molecule.getAtomCustomLabel(atom);
    if (label) inMolecule.push(label);
  }

  expect(inMolecule.toSorted()).toStrictEqual(['r', 's']);

  const inMoleculeWithH = getHydrogenLabels(topicMolecule)
    .map((l) => l.label)
    .toSorted();

  expect(inMoleculeWithH).toStrictEqual(['r', 's']);

  // removeProchiralHydrogenLabels strips both targets.
  topicMolecule.removeProchiralHydrogenLabels();
  let remaining = 0;
  for (let atom = 0; atom < topicMolecule.molecule.getAllAtoms(); atom++) {
    if (topicMolecule.molecule.getAtomCustomLabel(atom)) remaining++;
  }
  for (let atom = 0; atom < topicMolecule.moleculeWithH.getAllAtoms(); atom++) {
    if (topicMolecule.moleculeWithH.getAtomCustomLabel(atom)) remaining++;
  }

  expect(remaining).toBe(0);
});

test('setProchiralHydrogenLabels replaces an existing trailing r/s rather than stacking', () => {
  const molecule = Molecule.fromSmiles('CC(Cl)CC');
  const topicMolecule = new TopicMolecule(molecule);

  expect(topicMolecule.setProchiralHydrogenLabels()).toBe(2);
  expect(topicMolecule.setProchiralHydrogenLabels()).toBe(2);

  const labels = getHydrogenLabels(topicMolecule)
    .map((l) => l.label)
    .toSorted();

  expect(labels).toStrictEqual(['r', 's']);
});

test('setProchiralHydrogenLabels preserves a heavy-atom prefix when retagging', () => {
  const molecule = Molecule.fromSmiles('CC(Cl)CC');
  const topicMolecule = new TopicMolecule(molecule);
  const moleculeWithH = topicMolecule.moleculeWithH;
  for (let atom = 0; atom < moleculeWithH.getAllAtoms(); atom++) {
    if (moleculeWithH.getAtomicNo(atom) !== 6) continue;
    let hydrogenCount = 0;
    let nonHydrogenCount = 0;
    for (let j = 0; j < moleculeWithH.getAllConnAtoms(atom); j++) {
      if (moleculeWithH.getAtomicNo(moleculeWithH.getConnAtom(atom, j)) === 1) {
        hydrogenCount++;
      } else {
        nonHydrogenCount++;
      }
    }
    if (hydrogenCount === 2 && nonHydrogenCount === 2) {
      moleculeWithH.setAtomCustomLabel(atom, '3');
      break;
    }
  }
  topicMolecule.setProchiralHydrogenLabels();
  topicMolecule.setProchiralHydrogenLabels();

  const labels = getHydrogenLabels(topicMolecule)
    .map((l) => l.label)
    .filter((l) => l.startsWith('3'))
    .toSorted();

  expect(labels).toStrictEqual(['3r', '3s']);
});

test('removeProchiralHydrogenLabels strips the trailing pro-R / pro-S letter', () => {
  const molecule = Molecule.fromSmiles('CC(Cl)CC');
  const topicMolecule = new TopicMolecule(molecule);

  expect(topicMolecule.setProchiralHydrogenLabels()).toBe(2);
  expect(topicMolecule.removeProchiralHydrogenLabels()).toBe(2);
  expect(getHydrogenLabels(topicMolecule)).toStrictEqual([]);
});

test('removeProchiralHydrogenLabels is idempotent and preserves the heavy-atom prefix', () => {
  const molecule = Molecule.fromSmiles('CC(Cl)CC');
  const topicMolecule = new TopicMolecule(molecule);
  const moleculeWithH = topicMolecule.moleculeWithH;
  for (let atom = 0; atom < moleculeWithH.getAllAtoms(); atom++) {
    if (moleculeWithH.getAtomicNo(atom) !== 6) continue;
    let hydrogenCount = 0;
    let nonHydrogenCount = 0;
    for (let j = 0; j < moleculeWithH.getAllConnAtoms(atom); j++) {
      if (moleculeWithH.getAtomicNo(moleculeWithH.getConnAtom(atom, j)) === 1) {
        hydrogenCount++;
      } else {
        nonHydrogenCount++;
      }
    }
    if (hydrogenCount === 2 && nonHydrogenCount === 2) {
      moleculeWithH.setAtomCustomLabel(atom, '3');
      break;
    }
  }
  topicMolecule.setProchiralHydrogenLabels();
  topicMolecule.removeProchiralHydrogenLabels();

  expect(topicMolecule.removeProchiralHydrogenLabels()).toBe(0);

  const labels = getHydrogenLabels(topicMolecule)
    .map((l) => l.label)
    .toSorted();

  expect(labels).toStrictEqual(['3', '3']);
});
