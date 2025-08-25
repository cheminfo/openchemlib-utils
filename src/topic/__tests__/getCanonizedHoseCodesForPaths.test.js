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
});

test('ethyl vinyl ether', () => {
  const molecule = Molecule.fromSmiles('CCOC=C');
  const topicMolecule = new TopicMolecule(molecule);
  getCanonizedHoseCodesForPath(topicMolecule, {
    fromAtomicNo: 1,
    toAtomicNo: 1,
  });
  const results = getCanonizedHoseCodesForPath(topicMolecule, {
    fromAtomicNo: 1,
    toAtomicNo: 1,
    minPathLength: 2,
  });

  const pathLengths = results.map((r) => r.paths.length);

  expect(pathLengths).toStrictEqual([0, 0, 0, 0, 0, 4, 4, 4, 5, 5, 4, 2, 2]);

  // keep the 2 olefinic protons
  const olefinicProtons = results.slice(-2);

  expect(olefinicProtons).toMatchInlineSnapshot(`
    [
      {
        "fromDiaID": "gGQHLIeIUfhRS}H\`QJh",
        "paths": [
          {
            "hoses": [
              "eMABYYeIhNj_TzJBIUJIU@",
              "gC\`DALjYRZdCiQsyQ}_zI@bURQJh",
              "gJQDBIeSJS]LAuhyK{Q}Y_}D\`QJiHeT",
              "gGQDBIeSJS[SPGQcdm_FOkKw_tRADjdbUP",
              "gNqDBIeSJSZtu@]VNRu[zq}Y^z~QHDRjRIU@",
            ],
            "path": [
              11,
              4,
              12,
            ],
            "pathLength": 2,
            "toDiaID": "gGQHLIeIUfhRK}H\`QJh",
          },
          {
            "hoses": [
              "gC\`DALzYRVXRORbgrcjtRADjlbUP",
              "gJQDDIdsJS]LHgkQSgvci}_zI@bUQQJh",
              "gGQDDIfsJSKSPb^cENR~L]OkNhdBIUUDj\`",
              "gNqDDIfsJSJtuBIzlTyJwuci}Yu}~bPHeUTRj@",
              "gNqDDIfsJSJtuBIzlTyJwuci}Yu}~bPHeUTRj@",
            ],
            "path": [
              11,
              4,
              3,
              10,
            ],
            "pathLength": 3,
            "toDiaID": "gGQHDIeIgihA~dPHeT",
          },
        ],
      },
      {
        "fromDiaID": "gGQHLIeIUfhRK}H\`QJh",
        "paths": [
          {
            "hoses": [
              "eMABYYeIhNj_TzJBIUJIU@",
              "gC\`DALjYRZdCiQsyQ}_zI@bURQJh",
              "gJQDBIeSJS]LAuhyK{Q}Y_}D\`QJiHeT",
              "gGQDBIeSJS[SPGQcdm_FOkKw_tRADjdbUP",
              "gNqDBIeSJSZtu@]VNRu[zq}Y^z~QHDRjRIU@",
            ],
            "path": [
              12,
              4,
              11,
            ],
            "pathLength": 2,
            "toDiaID": "gGQHLIeIUfhRS}H\`QJh",
          },
          {
            "hoses": [
              "gC\`DALzYRVXRWRbgrcjtRADjlbUP",
              "gJQDDIdsJS]LHkkQSgvci}_zI@bUQQJh",
              "gGQDDIfsJSKSPbncENR~L]OkNhdBIUUDj\`",
              "gNqDDIfsJSJtuBJzlTyJwuci}Yu}~bPHeUTRj@",
              "gNqDDIfsJSJtuBJzlTyJwuci}Yu}~bPHeUTRj@",
            ],
            "path": [
              12,
              4,
              3,
              10,
            ],
            "pathLength": 3,
            "toDiaID": "gGQHDIeIgihA~dPHeT",
          },
        ],
      },
    ]
  `);
});
