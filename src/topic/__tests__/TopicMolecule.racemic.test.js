import { Molecule } from 'openchemlib';
import { test, expect } from 'vitest';

import { makeRacemic } from '../../util/makeRacemic';
import { TopicMolecule } from '../TopicMolecule';

test('TopicMolecule', () => {
  const moleculeR = Molecule.fromSmiles('C[C@H](Cl)Br');
  const moleculeS = Molecule.fromSmiles('C[C@@H](Cl)Br');
  console.log(moleculeR.getIDCode());
  console.log(moleculeS.getIDCode());

  makeRacemic(moleculeR);
  console.log(moleculeR.getIDCode());
  makeRacemic(moleculeS);
  console.log(moleculeS.getIDCode());

  const topicMolecule = new TopicMolecule(molecule);
});
