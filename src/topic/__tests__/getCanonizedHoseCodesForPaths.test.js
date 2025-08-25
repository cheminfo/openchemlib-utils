import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { TopicMolecule } from '../TopicMolecule.ts';
import { getCanonizedHoseCodesForPath } from '../getCanonizedHoseCodesForPaths.ts';

test('methane', () => {
  const molecule = Molecule.fromSmiles('C');
  const topicMolecule = new TopicMolecule(molecule);
  const result1 = getCanonizedHoseCodesForPath(topicMolecule);

  expect(result1).toHaveLength(5); // we have 5 starting atoms
  expect(result1[0].fromDiaID).toBe('fH@FJ`\u007FRapj`');
  expect(result1[0].paths.map((p) => p.pathLength)).toStrictEqual([
    0, 1, 1, 1, 1,
  ]); // carbon with 4 hydrogens
  expect(result1[0].paths[1].hoses).toStrictEqual([
    'eFBBYcAqUAjgu]~b`bUTxUP',
    'eFBBYcAqUAjgu]~b`bUTxUP',
    'eFBBYcAqUAjgu]~b`bUTxUP',
    'eFBBYcAqUAjgu]~b`bUTxUP',
    'eFBBYcAqUAjgu]~b`bUTxUP',
  ]); // nothing very exciting, all hoses are identical but this is methane
  expect(result1[1].paths.map((p) => p.pathLength)).toStrictEqual([
    0, 1, 2, 2, 2,
  ]); // one of the hydrogens

  const result2 = getCanonizedHoseCodesForPath(topicMolecule, {
    fromAtomicNo: 1,
    toAtomicNo: 1,
  });

  expect(result2[0]).toStrictEqual({
    fromDiaID: 'fH@FJ`\u007FRapj`',
    paths: [],
  }); // carbon has no links
  expect(result2[1].paths.map((p) => p.pathLength)).toStrictEqual([0, 2, 2, 2]); // one of the hydrogens

  const result3 = getCanonizedHoseCodesForPath(topicMolecule, {
    fromAtomicNo: 1,
    toAtomicNo: 1,
    minPathLength: 2,
  });

  expect(result3[0]).toStrictEqual({
    fromDiaID: 'fH@FJ`\u007FRapj`',
    paths: [],
  }); // carbon has no links
  expect(result3[1].paths.map((p) => p.pathLength)).toStrictEqual([2, 2, 2]); // one of the hydrogens

  const result4 = getCanonizedHoseCodesForPath(topicMolecule, {
    fromAtomicNo: 1,
    toAtomicNo: 1,
    minPathLength: 2,
    maxSphereSize: 2,
  });

  expect(result4[1].paths[0].hoses).toHaveLength(3);
});

test('ethyl vinyl ether', () => {
  const molecule = Molecule.fromSmiles('CCOC=C');
  const topicMolecule = new TopicMolecule(molecule);
  getCanonizedHoseCodesForPath(topicMolecule, {
    fromAtomicNo: 1,
    toAtomicNo: 1,
  });
  const results1 = getCanonizedHoseCodesForPath(topicMolecule, {
    fromAtomicNo: 1,
    toAtomicNo: 1,
    minPathLength: 2,
  });

  const pathLengths = results1.map((r) => r.paths.length);

  expect(pathLengths).toStrictEqual([0, 0, 0, 0, 0, 5, 5, 5, 7, 7, 7, 4, 4]);

  // keep the 2 olefinic protons
  const olefinicProtons = results1.slice(-2);

  expect(olefinicProtons).toMatchSnapshot();

  const results2 = getCanonizedHoseCodesForPath(topicMolecule, {
    fromAtomicNo: 1,
    toAtomicNo: 1,
    minPathLength: 2,
    maxPathLength: 2,
  });

  expect(results2[12].paths).toHaveLength(1);
});
