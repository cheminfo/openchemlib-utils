import { writeFileSync } from 'fs';
import { join } from 'path';

import { Molecule } from 'openchemlib/full.js';

import { applyReactions } from '../applyReactions.js';

import { reactionsDatabase } from './reactionsDatabase.js';

describe('applyReactions', () => {
  it('ethanol', () => {
    const ethanol = Molecule.fromSmiles('CCO');
    const { tree, products } = applyReactions([ethanol], reactionsDatabase, {});
    expect(products[0]).toMatchInlineSnapshot();

    expect(tree).toHaveLength(1);
    const firstResult = tree[0];
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
    const { tree, products } = applyReactions([diol], reactionsDatabase, {});

    expect(products[0]).toMatchInlineSnapshot();
    expect(tree).toHaveLength(1);
    const firstResult = tree[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C2H6OS');
    expect(firstProduct.children).toHaveLength(2);

    const firstChild = firstProduct.children[0];
    expect(firstChild.reactant.mf).toBe('C2H6OS');
    expect(firstChild.products).toHaveLength(1);
    expect(firstChild.products[0].mf).toBe('C2H6S2');
    const secondChild = firstProduct.children[1];
    expect(secondChild.reactant.mf).toBe('C2H6OS');
    expect(secondChild.products).toHaveLength(1);
    expect(secondChild.products[0].mf).toBe('C3H8OS');

    expect(tree).toMatchSnapshot();
  });

  it('propane-1,2-diol', () => {
    const propanediol = Molecule.fromSmiles('CC(O)CO');
    const { tree, products } = applyReactions(
      [propanediol],
      reactionsDatabase,
      {},
    );
    expect(products[0]).toMatchInlineSnapshot();

    expect(tree).toHaveLength(2);
    const firstResult = tree[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C3H8OS');
    expect(firstProduct.children).toHaveLength(2);
    const secondResult = tree[1];
    expect(secondResult.products).toHaveLength(1);
    const secondProduct = secondResult.products[0];
    expect(secondProduct.mf).toBe('C3H8OS');
    expect(secondProduct.children).toHaveLength(2);

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
    const { tree, products } = applyReactions(
      [propanediol],
      reactionsDatabase,
      {
        maxDepth: 1,
      },
    );

    expect(products[0]).toMatchInlineSnapshot();
    expect(tree).toHaveLength(2);
    const firstResult = tree[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C3H8OS');
    expect(firstProduct.children).toHaveLength(0);
  });

  it.only('propane-1,2-diol maxDepth: 2', () => {
    const propanediol = Molecule.fromSmiles('CC(O)CO');
    const { tree, products } = applyReactions(
      [propanediol],
      reactionsDatabase,
      {
        maxDepth: 5,
      },
    );
    writeFileSync(
      join(__dirname, 'propanediol.json'),
      JSON.stringify(products, null, 2),
    );
    /*
    expect(Object.keys(products[0])).toMatchInlineSnapshot(`
      [
        "idCode",
        "reactions",
        "mf",
        "minSteps",
      ]
    `);
  expect(products[1].minSteps).toBeGreaterThanOrEqual(2);
   expect(tree).toHaveLength(2);
    const firstResult = tree[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C3H8OS');
    const mfs = firstProduct.children.map((child) => child.products[0].mf);

    expect(mfs).toStrictEqual(['C3H8S2', 'C4H10OS']);
*/
  });
});
