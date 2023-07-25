import { Molecule } from 'openchemlib/full.js';

import { applyReactions } from '../applyReactions.js';

import { reactionsDatabase } from './reactionsDatabase.js';

describe('applyReactions', () => {
  it('ethanol', () => {
    const ethanol = Molecule.fromSmiles('CCO');
    const { trees, products } = applyReactions(
      [ethanol],
      reactionsDatabase,
      {},
    );
    expect(products[0]).toMatchInlineSnapshot(`
      {
        "charge": 0,
        "em": 62.01902,
        "idCode": "eMB@HRZ@",
        "mf": "C2H6S",
        "minSteps": 1,
        "reactions": [
          "eFHBLGtV!eFB@HcA}E\`#aP aP#!R@AL]\\mp !R@AL]Nmp",
        ],
        "trees": [
          {
            "products": [
              {
                "charge": 0,
                "children": [],
                "em": 62.01902,
                "flag": true,
                "idCode": "eMB@HRZ@",
                "mf": "C2H6S",
                "molfile": "
      Actelion Java MolfileCreator 1.0

        3  2  0  0  0  0  0  0  0  0999 V2000
         29.3425  -12.4962   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         29.3593  -10.9963   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         30.6667  -10.2609   -0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        3  2  1  0  0  0  0
      M  END
      ",
              },
            ],
            "reactant": {
              "charge": 0,
              "em": 46.041865,
              "idCode": "eMHAIh@",
              "mf": "C2H6O",
              "molfile": "
      Actelion Java MolfileCreator 1.0

        3  2  0  0  0  0  0  0  0  0999 V2000
          1.7321   -0.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          0.8660   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          0.0000   -0.5000   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        2  3  1  0  0  0  0
      M  END
      ",
            },
            "reaction": {
              "Label": "OH by SH",
              "rxnCode": "eFHBLGtV!eFB@HcA}E\`#aP aP#!R@AL]\\mp !R@AL]Nmp",
            },
          },
        ],
      }
    `);

    expect(trees).toHaveLength(2);
    const firstResult = trees[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C2H6S');
    expect(firstProduct.children).toHaveLength(1);
    const firstChild = firstProduct.children[0];
    expect(firstChild.reactant.mf).toBe('C2H6S');
    expect(firstChild.products).toHaveLength(1);
    expect(firstChild.products[0].mf).toBe('C3H8S');
  });

  it('ethylene glycol', () => {
    const diol = Molecule.fromSmiles('OCCO');
    const { trees, products } = applyReactions([diol], reactionsDatabase, {});

    expect(products[0]).toMatchInlineSnapshot(`
      {
        "charge": 0,
        "em": 78.013935,
        "idCode": "gCaHL@aIZ\`@",
        "mf": "C2H6OS",
        "minSteps": 1,
        "reactions": [
          "eFHBLGtV!eFB@HcA}E\`#aP aP#!R@AL]\\mp !R@AL]Nmp",
        ],
        "trees": [
          {
            "products": [
              {
                "charge": 0,
                "children": [],
                "em": 78.013935,
                "flag": true,
                "idCode": "gCaHL@aIZ\`@",
                "mf": "C2H6OS",
                "molfile": "
      Actelion Java MolfileCreator 1.0

        4  3  0  0  0  0  0  0  0  0999 V2000
         19.5729   -7.3308   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         19.5617   -8.3308   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         20.4220   -8.8405   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
         20.4444   -6.8406   -0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        2  3  1  0  0  0  0
        4  1  1  0  0  0  0
      M  END
      ",
              },
            ],
            "reactant": {
              "charge": 0,
              "em": 62.03678,
              "idCode": "gC\`\`Adej@@",
              "mf": "C2H6O2",
              "molfile": "
      Actelion Java MolfileCreator 1.0

        4  3  0  0  0  0  0  0  0  0999 V2000
          2.5981   -0.0000   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
          1.7321   -0.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          0.8660   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          0.0000   -0.5000   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        2  3  1  0  0  0  0
        3  4  1  0  0  0  0
      M  END
      ",
            },
            "reaction": {
              "Label": "OH by SH",
              "rxnCode": "eFHBLGtV!eFB@HcA}E\`#aP aP#!R@AL]\\mp !R@AL]Nmp",
            },
          },
        ],
      }
    `);
    expect(trees).toHaveLength(2);
    const firstResult = trees[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C2H6OS');
    expect(firstProduct.children).toHaveLength(3);

    const firstChild = firstProduct.children[0];
    expect(firstChild.reactant.mf).toBe('C2H6OS');
    expect(firstChild.products).toHaveLength(1);
    expect(firstChild.products[0].mf).toBe('C2H6S2');
    const secondChild = firstProduct.children[1];
    expect(secondChild.reactant.mf).toBe('C2H6OS');
    expect(secondChild.products).toHaveLength(1);
    expect(secondChild.products[0].mf).toBe('C3H8OS');

    expect(trees).toMatchSnapshot();
  });

  it('propane-1,2-diol', () => {
    const propanediol = Molecule.fromSmiles('CC(O)CO');
    const { trees, products } = applyReactions(
      [propanediol],
      reactionsDatabase,
      {},
    );
    expect(products[0]).toMatchInlineSnapshot(`
      {
        "charge": 0,
        "em": 92.029585,
        "idCode": "gJQHB@aIfj@@",
        "mf": "C3H8OS",
        "minSteps": 1,
        "reactions": [
          "eFHBLGtV!eFB@HcA}E\`#aP aP#!R@AL]\\mp !R@AL]Nmp",
        ],
        "trees": [
          {
            "products": [
              {
                "charge": 0,
                "children": [],
                "em": 92.029585,
                "flag": true,
                "idCode": "gJQHB@aIfj@@",
                "mf": "C3H8OS",
                "molfile": "
      Actelion Java MolfileCreator 1.0

        5  4  0  0  0  0  0  0  0  0999 V2000
         28.0688  -10.2317   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         29.3593  -10.9963   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         29.3425  -12.4962   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         28.0351  -13.2316   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
         30.6667  -10.2609   -0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        2  3  1  0  0  0  0
        3  4  1  0  0  0  0
        5  2  1  0  0  0  0
      M  END
      ",
              },
            ],
            "reactant": {
              "charge": 0,
              "em": 76.05243,
              "idCode": "gJP\`@TfZh@",
              "mf": "C3H8O2",
              "molfile": "
      Actelion Java MolfileCreator 1.0

        5  4  0  0  0  0  0  0  0  0999 V2000
          2.5981   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          1.7321   -0.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          1.7321   -1.5000   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
          0.8660   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          0.0000   -0.5000   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        2  3  1  0  0  0  0
        2  4  1  0  0  0  0
        4  5  1  0  0  0  0
      M  END
      ",
            },
            "reaction": {
              "Label": "OH by SH",
              "rxnCode": "eFHBLGtV!eFB@HcA}E\`#aP aP#!R@AL]\\mp !R@AL]Nmp",
            },
          },
        ],
      }
    `);

    expect(trees).toHaveLength(4);
    const firstResult = trees[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C3H8OS');
    expect(firstProduct.children).toHaveLength(3);
    const secondResult = trees[1];
    expect(secondResult.products).toHaveLength(1);
    const secondProduct = secondResult.products[0];
    expect(secondProduct.mf).toBe('C3H8OS');
    expect(secondProduct.children).toHaveLength(3);

    const firstChild = firstProduct.children[0];
    expect(firstChild.reactant.mf).toBe('C3H8OS');
    expect(firstChild.products).toHaveLength(1);
    expect(firstChild.products[0].mf).toBe('C3H8S2');
    const secondChild = firstProduct.children[1];
    expect(secondChild.reactant.mf).toBe('C3H8OS');
    expect(secondChild.products).toHaveLength(1);
    expect(secondChild.products[0].mf).toBe('C4H10OS');
    expect(secondChild.reaction.oclReaction).toBeUndefined();
    expect(secondChild.products[0].children[0].products[0].mf).toBe('C4H10S2');
  });

  it('propane-1,2-diol maxDepth: 1', () => {
    const propanediol = Molecule.fromSmiles('CC(O)CO');
    const { trees, products } = applyReactions(
      [propanediol],
      reactionsDatabase,
      {
        maxDepth: 1,
      },
    );

    expect(products[0]).toMatchInlineSnapshot(`
      {
        "charge": 0,
        "em": 92.029585,
        "idCode": "gJQHB@aIfj@@",
        "mf": "C3H8OS",
        "minSteps": 1,
        "reactions": [
          "eFHBLGtV!eFB@HcA}E\`#aP aP#!R@AL]\\mp !R@AL]Nmp",
        ],
        "trees": [
          {
            "products": [
              {
                "charge": 0,
                "children": [],
                "em": 92.029585,
                "flag": true,
                "idCode": "gJQHB@aIfj@@",
                "mf": "C3H8OS",
                "molfile": "
      Actelion Java MolfileCreator 1.0

        5  4  0  0  0  0  0  0  0  0999 V2000
         28.0688  -10.2317   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         29.3593  -10.9963   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         29.3425  -12.4962   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
         28.0351  -13.2316   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
         30.6667  -10.2609   -0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        2  3  1  0  0  0  0
        3  4  1  0  0  0  0
        5  2  1  0  0  0  0
      M  END
      ",
              },
            ],
            "reactant": {
              "charge": 0,
              "em": 76.05243,
              "idCode": "gJP\`@TfZh@",
              "mf": "C3H8O2",
              "molfile": "
      Actelion Java MolfileCreator 1.0

        5  4  0  0  0  0  0  0  0  0999 V2000
          2.5981   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          1.7321   -0.5000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          1.7321   -1.5000   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
          0.8660   -0.0000   -0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
          0.0000   -0.5000   -0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
        1  2  1  0  0  0  0
        2  3  1  0  0  0  0
        2  4  1  0  0  0  0
        4  5  1  0  0  0  0
      M  END
      ",
            },
            "reaction": {
              "Label": "OH by SH",
              "rxnCode": "eFHBLGtV!eFB@HcA}E\`#aP aP#!R@AL]\\mp !R@AL]Nmp",
            },
          },
        ],
      }
    `);
    expect(trees).toHaveLength(4);
    const firstResult = trees[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C3H8OS');
    expect(firstProduct.children).toHaveLength(0);
  });

  it('propane-1,2-diol maxDepth: 5', () => {
    const propanediol = Molecule.fromSmiles('CC(O)CO');
    const { trees, products } = applyReactions(
      [propanediol],
      reactionsDatabase,
      {
        maxDepth: 5,
      },
    );

    expect(Object.keys(products[0])).toMatchInlineSnapshot(`
      [
        "idCode",
        "mf",
        "em",
        "charge",
        "trees",
        "reactions",
        "minSteps",
      ]
    `);

    expect(products[1].minSteps).toBeGreaterThanOrEqual(3);
    expect(trees).toHaveLength(4);
    const firstResult = trees[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C3H8OS');
    const mfs = firstProduct.children.map((child) => child.products[0].mf);
    expect(mfs).toStrictEqual(['C3H8S2', 'C4H10OS', 'C3H9OS(+)']);
    expect(products).toMatchSnapshot();
  });
  it('COCCO multiple ionization', () => {
    const molecule = Molecule.fromSmiles('OCOCO');
    const { products } = applyReactions([molecule], reactionsDatabase, {
      maxDepth: 5,
    });
    expect(products).toMatchSnapshot();
  });
});
