import { Molecule } from 'openchemlib';
import { test, expect } from 'vitest';

import { makeRacemic } from '../../util/makeRacemic';
import { TopicMolecule } from '../TopicMolecule';

test('TopicMolecule.path', () => {
  const molecule = Molecule.fromSmiles('CCCCCO');
  const topicMolecule = new TopicMolecule(molecule);

  expect(topicMolecule.getAtomPaths(0, 2, { pathLength: 2 })).toStrictEqual([
    [0, 1, 2],
  ]);
  expect(topicMolecule.getAtomPaths(0, 2, { pathLength: 3 })).toStrictEqual([]);
});

test('TopicMolecule.getHoseFragment', async () => {
  const molecule = Molecule.fromSmiles('ClC=C');
  const topicMolecule = new TopicMolecule(molecule);

  expect(topicMolecule.atomsPaths).toMatchSnapshot();
});

test('TopicMolecule.getHoseFragment', async () => {
  const molecule = Molecule.fromSmiles('Cl/C=C/CCCCl');
  //const molecule = Molecule.fromSmiles('C1=CC=CC=C1');
  molecule.addImplicitHydrogens();

  const topicMolecule = new TopicMolecule(molecule);

  const fragment = topicMolecule.getHoseFragment([0, 1, 2, 9], {
    sphereSize: 1,
    tagAtoms: [2, 9],
    tagAtomFct: (fragment, atom) => {
      fragment.setAtomMass(atom, 255);
    },
  });

  makeRacemic(fragment);

  expect(fragment.toIsomericSmiles().replaceAll('255', '*')).toBe(
    '[*H]C/[*C]=C/Cl',
  );
  expect(
    fragment.toIsomericSmiles({ createSmarts: true }).replaceAll('255', '*'),
  ).toBe('[*H]C/[*C;!H0]=[C;!H0]/Cl');
  expect(
    fragment.toIsomericSmiles({ kekulizedOutput: true }).replaceAll('255', '*'),
  ).toBe('[*H]C/[*C]=C/Cl');
});
