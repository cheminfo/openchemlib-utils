import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { TopicMolecule } from '../TopicMolecule';

test('TopicMolecule.getAtomPathsFrom default parameters', () => {
  const molecule = Molecule.fromSmiles('CCCO');
  const topicMolecule = new TopicMolecule(molecule);
  const paths = topicMolecule.getAtomPathsFrom(0);
  expect(paths).toHaveLength(11);
});

test('TopicMolecule.getAtomPathsFrom maxPathLength: 2', () => {
  const molecule = Molecule.fromSmiles('CCCO');
  const topicMolecule = new TopicMolecule(molecule, { maxPathLength: 2 });
  const paths = topicMolecule.getAtomPathsFrom(0);
  expect(paths).toHaveLength(7);
});

test('TopicMolecule.getAtomPathsFrom maxPathLength: 2 and ask for 3', () => {
  const molecule = Molecule.fromSmiles('CCCO');
  const topicMolecule = new TopicMolecule(molecule, { maxPathLength: 2 });

  expect(() =>
    topicMolecule.getAtomPathsFrom(0, { maxPathLength: 3 }),
  ).toThrowError('The maxPathLength is too long');
});

test('TopicMolecule.getAtomPathsFrom maxPathLength: 2 and filter H', () => {
  const molecule = Molecule.fromSmiles('CCCO');
  const topicMolecule = new TopicMolecule(molecule, { maxPathLength: 2 });
  const paths = topicMolecule.getAtomPathsFrom(0, { toAtomicNo: 1 });
  expect(paths).toHaveLength(5);
});

test('TopicMolecule.getAtomPathsFrom maxPathLength: 2 and filter H', () => {
  const molecule = Molecule.fromSmiles('CCCO');
  const topicMolecule = new TopicMolecule(molecule);
  const paths = topicMolecule.getAtomPathsFrom(0, {
    minPathLength: 2,
    maxPathLength: 2,
    toAtomicNo: 1,
  });
  expect(paths).toHaveLength(2);
});
