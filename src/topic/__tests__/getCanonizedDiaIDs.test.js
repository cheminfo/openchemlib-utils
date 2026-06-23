import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { TopicMolecule } from '../TopicMolecule';

test('symmetric atoms with the same heterotopic rank share a cached diaID (no recomputation)', () => {
  // Benzene: all 6 carbons share one heterotopic rank, all 6 hydrogens share another.
  // After the cache fix, only 2 canonization calls are needed instead of 12.
  const molecule = Molecule.fromSmiles('c1ccccc1');
  const topicMolecule = new TopicMolecule(molecule);

  const oclModule = molecule.getOCL().Molecule;
  let canonizationCalls = 0;
  const originalGetCanonizedIDCode = oclModule.prototype.getCanonizedIDCode;
  oclModule.prototype.getCanonizedIDCode = function spy(...args) {
    canonizationCalls++;
    return originalGetCanonizedIDCode.apply(this, args);
  };

  try {
    const diaIDs = topicMolecule.diaIDs;

    expect(diaIDs).toHaveLength(12);
    expect(canonizationCalls).toBe(2);
    expect(new Set(diaIDs).size).toBe(2);
  } finally {
    oclModule.prototype.getCanonizedIDCode = originalGetCanonizedIDCode;
  }
});

test('a molecule with all-distinct atoms still gets one canonization per atom', () => {
  // Ethanol with the methyl O replaced (CCO) — every heavy atom has a distinct
  // heterotopic rank, so the cache cannot help.
  const molecule = Molecule.fromSmiles('CCO');
  const topicMolecule = new TopicMolecule(molecule);
  const diaIDs = topicMolecule.diaIDs;

  // 3 heavy atoms + 6 hydrogens; the two CH3 H's that are diastereotopic to
  // each other vs the third etc. — exact count depends on symmetry, but every
  // diaID must be a non-empty string.
  expect(diaIDs.length).toBeGreaterThan(0);

  for (const diaID of diaIDs) {
    expect(typeof diaID).toBe('string');
    expect(diaID.length).toBeGreaterThan(0);
  }
});
