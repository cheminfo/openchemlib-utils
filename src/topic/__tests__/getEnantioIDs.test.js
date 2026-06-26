import { Molecule } from 'openchemlib';
import { expect, test } from 'vitest';

import { TopicMolecule } from '../TopicMolecule.ts';
import { getEnantioIDs } from '../getEnantioIDs.ts';

/**
 * Collects every CH2 group (a carbon bearing exactly two hydrogens and two
 * heavy neighbours) of `topicMolecule.moleculeWithH`, returning for each the
 * two hydrogen atom indices together with their racemic `diaID` and their
 * absolute `enantioID`.
 * @param {TopicMolecule} topicMolecule
 */
function getCh2Groups(topicMolecule) {
  const molecule = topicMolecule.moleculeWithH;
  const diaIDs = topicMolecule.diaIDs;
  const enantioIDs = topicMolecule.enantioIDs;
  const groups = [];
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) {
    if (molecule.getAtomicNo(atom) !== 6) continue;
    const hydrogens = [];
    let heavy = 0;
    for (let j = 0; j < molecule.getAllConnAtoms(atom); j++) {
      const connected = molecule.getConnAtom(atom, j);
      if (molecule.getAtomicNo(connected) === 1) {
        hydrogens.push(connected);
      } else {
        heavy++;
      }
    }
    if (hydrogens.length === 2 && heavy === 2) {
      groups.push({
        carbon: atom,
        hydrogens,
        diaIDs: hydrogens.map((hydrogen) => diaIDs[hydrogen]),
        enantioIDs: hydrogens.map((hydrogen) => enantioIDs[hydrogen]),
      });
    }
  }
  return groups;
}

function getSortedHydrogenLabels(topicMolecule) {
  const molecule = topicMolecule.moleculeWithH;
  const labels = [];
  for (let atom = 0; atom < molecule.getAllAtoms(); atom++) {
    if (molecule.getAtomicNo(atom) !== 1) continue;
    const label = molecule.getAtomCustomLabel(atom);
    if (label) labels.push(label);
  }
  return labels.toSorted();
}

// idCode that encodes the custom labels. The labels sit on hydrogens, which a
// canonizer drops as "simple"; switching to fragment mode keeps every explicit
// hydrogen so the pro-R / pro-S labels survive the round-trip.
function getLabeledIDCode(molecule) {
  const { Canonizer } = molecule.getOCL();
  const copy = molecule.getCompactCopy();
  copy.setFragment(true);
  return new Canonizer(copy, { encodeAtomCustomLabels: true }).getIDCode();
}

/**
 * Returns the SMILES of `molecule` with `hydrogen` turned into a deuterium
 * (mass 2). Marking a single CH2 hydrogen makes its carbon a stereocenter, so
 * the isomeric SMILES (`[2H][C@@H]...` vs `[2H][C@H]...`) shows at a glance
 * which proton the enantioID describes — a human-readable companion to the
 * otherwise opaque idCode.
 * @param {import('openchemlib').Molecule} molecule - molecule bearing the hydrogen.
 * @param {number} hydrogen - atom index of the hydrogen to mark as deuterium.
 * @returns {string} the isomeric SMILES with the marked deuterium.
 */
function getDeuteratedSmiles(molecule, hydrogen) {
  const copy = molecule.getCompactCopy();
  copy.setAtomMass(hydrogen, 2);
  return copy.toIsomericSmiles();
}

test('ethanol (CCO): the CH2 hydrogens are enantiotopic — same diaID, different enantioID', () => {
  const topicMolecule = new TopicMolecule(Molecule.fromSmiles('CCO'));

  expect(topicMolecule.molecule.toIsomericSmiles()).toBe('CCO');

  const enantioIDs = topicMolecule.enantioIDs;

  expect(enantioIDs).toHaveLength(topicMolecule.moleculeWithH.getAllAtoms());

  for (const enantioID of enantioIDs) {
    expect(typeof enantioID).toBe('string');
    expect(enantioID.length).toBeGreaterThan(0);
  }

  const groups = getCh2Groups(topicMolecule);

  expect(groups).toHaveLength(1);

  const [ch2] = groups;

  // Racemic diaID cannot distinguish the two enantiotopic hydrogens...
  expect(ch2.diaIDs[0]).toBe(ch2.diaIDs[1]);

  // ...but the absolute enantioID does — this is the whole reason enantioIDs
  // exists alongside diaIDs.
  expect(ch2.enantioIDs[0]).not.toBe(ch2.enantioIDs[1]);

  // Splitting the one enantiotopic pair turns 6 distinct diaIDs into 7
  // distinct enantioIDs.
  expect(new Set(topicMolecule.diaIDs).size).toBe(6);
  expect(new Set(enantioIDs).size).toBe(7);

  const count = topicMolecule.setProchiralHydrogenLabels({
    includeEnantiotopic: true,
  });

  expect(count).toBe(2);

  const label0 = topicMolecule.moleculeWithH.getAtomCustomLabel(
    ch2.hydrogens[0],
  );
  const label1 = topicMolecule.moleculeWithH.getAtomCustomLabel(
    ch2.hydrogens[1],
  );

  expect([label0, label1].toSorted()).toStrictEqual([']r', ']s']);

  expect(getLabeledIDCode(topicMolecule.moleculeWithH)).toBe(
    String.raw`gJQDAh@pBSUUHa|aB{}Df[n\muN`,
  );

  // The exact enantioID → pro-R / pro-S mapping, for verification in external
  // software. Snapshotted because idCodes can contain non-printable bytes. The
  // deuterated SMILES marks the analysed hydrogen so the assignment can be
  // checked visually.
  expect({
    [ch2.enantioIDs[0]]: {
      proChirality: label0,
      smiles: getDeuteratedSmiles(
        topicMolecule.moleculeWithH,
        ch2.hydrogens[0],
      ),
    },
    [ch2.enantioIDs[1]]: {
      proChirality: label1,
      smiles: getDeuteratedSmiles(
        topicMolecule.moleculeWithH,
        ch2.hydrogens[1],
      ),
    },
  }).toMatchSnapshot();
});

test('propan-1-ol (CCCO): both CH2 groups are enantiotopic and prochiral', () => {
  const topicMolecule = new TopicMolecule(Molecule.fromSmiles('CCCO'));

  expect(topicMolecule.molecule.toIsomericSmiles()).toBe('CCCO');

  const groups = getCh2Groups(topicMolecule);

  // CH3-CH2-CH2-OH: two distinct CH2 carbons, each prochiral.
  expect(groups).toHaveLength(2);

  // The two CH2 carbons are not equivalent to one another (different diaIDs).
  expect(groups[0].diaIDs[0]).not.toBe(groups[1].diaIDs[0]);

  for (const group of groups) {
    // enantiotopic within each CH2: same diaID, different enantioID
    expect(group.diaIDs[0]).toBe(group.diaIDs[1]);
    expect(group.enantioIDs[0]).not.toBe(group.enantioIDs[1]);
  }

  expect(new Set(topicMolecule.diaIDs).size).toBe(8);
  expect(new Set(topicMolecule.enantioIDs).size).toBe(10);

  const count = topicMolecule.setProchiralHydrogenLabels({
    includeEnantiotopic: true,
  });

  expect(count).toBe(4);
  expect(getSortedHydrogenLabels(topicMolecule)).toStrictEqual([
    ']r',
    ']r',
    ']s',
    ']s',
  ]);

  expect(getLabeledIDCode(topicMolecule.moleculeWithH)).toBe(
    'daxHH@r@J@Z@z@RZZjjdaH`~PHkotIL[n\\fzgYny~[j\\',
  );

  const mapping = {};
  for (const group of groups) {
    for (let i = 0; i < group.hydrogens.length; i++) {
      mapping[group.enantioIDs[i]] = {
        proChirality: topicMolecule.moleculeWithH.getAtomCustomLabel(
          group.hydrogens[i],
        ),
        smiles: getDeuteratedSmiles(
          topicMolecule.moleculeWithH,
          group.hydrogens[i],
        ),
      };
    }
  }

  expect(mapping).toMatchSnapshot();
});

test('butan-1-ol (CCCCO): all three CH2 groups are enantiotopic and prochiral', () => {
  const topicMolecule = new TopicMolecule(Molecule.fromSmiles('CCCCO'));

  expect(topicMolecule.molecule.toIsomericSmiles()).toBe('CCCCO');

  const groups = getCh2Groups(topicMolecule);

  // CH3-CH2-CH2-CH2-OH: three distinct CH2 carbons, each prochiral.
  expect(groups).toHaveLength(3);

  const groupDiaIDs = groups.map((group) => group.diaIDs[0]);

  expect(new Set(groupDiaIDs).size).toBe(3);

  for (const group of groups) {
    expect(group.diaIDs[0]).toBe(group.diaIDs[1]);
    expect(group.enantioIDs[0]).not.toBe(group.enantioIDs[1]);
  }

  expect(new Set(topicMolecule.diaIDs).size).toBe(10);
  expect(new Set(topicMolecule.enantioIDs).size).toBe(13);

  const count = topicMolecule.setProchiralHydrogenLabels({
    includeEnantiotopic: true,
  });

  expect(count).toBe(6);
  expect(getSortedHydrogenLabels(topicMolecule)).toStrictEqual([
    ']r',
    ']r',
    ']r',
    ']s',
    ']s',
    ']s',
  ]);

  expect(getLabeledIDCode(topicMolecule.moleculeWithH)).toBe(
    'dmTHX@r@J@Z@z@f@V@rJQRFRjjjrDbiA|`PO_hrXw\\yMuNs]s|wT|mwNk]S`',
  );

  const mapping = {};
  for (const group of groups) {
    for (let i = 0; i < group.hydrogens.length; i++) {
      mapping[group.enantioIDs[i]] = {
        proChirality: topicMolecule.moleculeWithH.getAtomCustomLabel(
          group.hydrogens[i],
        ),
        smiles: getDeuteratedSmiles(
          topicMolecule.moleculeWithH,
          group.hydrogens[i],
        ),
      };
    }
  }

  expect(mapping).toMatchSnapshot();
});

test('getEnantioIDs racemic option collapses the enantiotopic CH2 hydrogens', () => {
  const topicMolecule = new TopicMolecule(Molecule.fromSmiles('CCO'));

  expect(topicMolecule.molecule.toIsomericSmiles()).toBe('CCO');

  const [ch2] = getCh2Groups(topicMolecule);

  const absolute = getEnantioIDs(topicMolecule);
  const racemic = getEnantioIDs(topicMolecule, { racemic: true });

  // Absolute IDs distinguish the two enantiotopic hydrogens.
  expect(absolute[ch2.hydrogens[0]]).not.toBe(absolute[ch2.hydrogens[1]]);

  // Racemizing the probe makes them identical — same behaviour as diaIDs,
  // which are built from getEnantioIDs(..., { racemic: true }).
  expect(racemic[ch2.hydrogens[0]]).toBe(racemic[ch2.hydrogens[1]]);
  expect(racemic[ch2.hydrogens[0]]).toBe(
    topicMolecule.diaIDs[ch2.hydrogens[0]],
  );
});
