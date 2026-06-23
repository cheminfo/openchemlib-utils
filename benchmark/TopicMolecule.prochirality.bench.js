import { deepStrictEqual } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Molecule } from 'openchemlib';
import { bench, describe } from 'vitest';

import { TopicMolecule } from '../src/topic/TopicMolecule.js';
import { getCompactCopyWithoutCustomLabels } from '../src/util/getCompactCopyWithoutCustomLabels.js';
import { tagAtom } from '../src/util/tagAtom.js';

/**
 * Original: one full molecule copy per prochiral pair.
 * @param moleculeWithH
 * @param diaIDs
 */
function computeProchiralityOneCopyPerPair(moleculeWithH, diaIDs) {
  const { Molecule: OCLMolecule } = moleculeWithH.getOCL();
  const result = {};

  for (let atom = 0; atom < moleculeWithH.getAllAtoms(); atom++) {
    if (moleculeWithH.getAtomicNo(atom) !== 6) continue;

    const hydrogens = [];
    let nonHydrogenCount = 0;
    for (let j = 0; j < moleculeWithH.getAllConnAtoms(atom); j++) {
      const connected = moleculeWithH.getConnAtom(atom, j);
      if (moleculeWithH.getAtomicNo(connected) === 1) {
        hydrogens.push(connected);
      } else {
        nonHydrogenCount++;
      }
    }

    if (hydrogens.length !== 2 || nonHydrogenCount !== 2) continue;

    const diaID0 = diaIDs[hydrogens[0]];
    const diaID1 = diaIDs[hydrogens[1]];
    if (diaID0 === diaID1) continue;
    if (result[diaID0] && result[diaID1]) continue;

    const probe = getCompactCopyWithoutCustomLabels(moleculeWithH);
    tagAtom(probe, hydrogens[0]);
    probe.ensureHelperArrays(OCLMolecule.cHelperCIP);
    const cipParity = probe.getAtomCIPParity(atom);

    if (cipParity === OCLMolecule.cAtomCIPParityRorM) {
      result[diaID0] = 'r';
      result[diaID1] = 's';
    } else if (cipParity === OCLMolecule.cAtomCIPParitySorP) {
      result[diaID0] = 's';
      result[diaID1] = 'r';
    }
  }

  return result;
}

/**
 * Optimised: one copy per function call, tag/untag the shared probe for each
 * pair.  setAtomicNo(H→X) invalidates OCL helper arrays; setAtomicNo(X→H)
 * does NOT, so the probe cannot be safely reused across separate calls.
 * @param moleculeWithH
 * @param diaIDs
 */
function computeProchiralityOneCopyPerCall(moleculeWithH, diaIDs) {
  const { Molecule: OCLMolecule } = moleculeWithH.getOCL();
  const result = {};
  const probe = getCompactCopyWithoutCustomLabels(moleculeWithH);

  for (let atom = 0; atom < moleculeWithH.getAllAtoms(); atom++) {
    if (moleculeWithH.getAtomicNo(atom) !== 6) continue;

    const hydrogens = [];
    let nonHydrogenCount = 0;
    for (let j = 0; j < moleculeWithH.getAllConnAtoms(atom); j++) {
      const connected = moleculeWithH.getConnAtom(atom, j);
      if (moleculeWithH.getAtomicNo(connected) === 1) {
        hydrogens.push(connected);
      } else {
        nonHydrogenCount++;
      }
    }

    if (hydrogens.length !== 2 || nonHydrogenCount !== 2) continue;

    const diaID0 = diaIDs[hydrogens[0]];
    const diaID1 = diaIDs[hydrogens[1]];
    if (diaID0 === diaID1) continue;
    if (result[diaID0] && result[diaID1]) continue;

    const savedAtomicNo = probe.getAtomicNo(hydrogens[0]);
    tagAtom(probe, hydrogens[0]);
    probe.ensureHelperArrays(OCLMolecule.cHelperCIP);
    const cipParity = probe.getAtomCIPParity(atom);
    probe.setAtomicNo(hydrogens[0], savedAtomicNo);
    probe.setAtomCustomLabel(hydrogens[0], '');

    if (cipParity === OCLMolecule.cAtomCIPParityRorM) {
      result[diaID0] = 'r';
      result[diaID1] = 's';
    } else if (cipParity === OCLMolecule.cAtomCIPParitySorP) {
      result[diaID0] = 's';
      result[diaID1] = 'r';
    }
  }

  return result;
}

const molfile = readFileSync(
  join(import.meta.dirname, 'data/cyclosporin.mol'),
  'utf8',
);
const molecule = Molecule.fromMolfile(molfile);
const topicMolecule = new TopicMolecule(molecule);
const { moleculeWithH, diaIDs } = topicMolecule;

// Guard: both strategies must agree, otherwise comparing their speed is
// meaningless. Runs once at collection time; throws if they diverge.
deepStrictEqual(
  computeProchiralityOneCopyPerCall(moleculeWithH, diaIDs),
  computeProchiralityOneCopyPerPair(moleculeWithH, diaIDs),
);

describe('prochirality CIP parity (cyclosporin)', () => {
  bench('one copy per pair', () => {
    computeProchiralityOneCopyPerPair(moleculeWithH, diaIDs);
  });

  bench('one copy per call', () => {
    computeProchiralityOneCopyPerCall(moleculeWithH, diaIDs);
  });
});
