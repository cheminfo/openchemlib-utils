import { Molecule } from 'openchemlib/full.js';
import { expect, it, describe } from 'vitest';

import { applyReactions } from '../applyReactions.js';

import { reactionsDatabase } from './reactionsDatabase.js';

describe('applyReactions', () => {
  it('ethanol', () => {
    const ethanol = Molecule.fromSmiles('CCO');
    const { trees, products, stats } = applyReactions(
      [ethanol],
      reactionsDatabase,
      { getProductsTrees: true },
    );
    expect(stats.counter).toBe(32);
    removeCoordinates(trees, products);

    expect(products[0]).toMatchSnapshot();

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

  it('ethanol with limitReactions:5', () => {
    const ethanol = Molecule.fromSmiles('CCO');
    const { trees, products, stats } = applyReactions(
      [ethanol],
      reactionsDatabase,
      { limitReactions: 5, getProductsTrees: true },
    );

    expect(stats.counter).toBe(5);
    removeCoordinates(trees, products);

    expect(products[0]).toMatchSnapshot();

    expect(trees).toHaveLength(2);
    const firstResult = trees[0];
    expect(firstResult.products).toHaveLength(1);
    const firstProduct = firstResult.products[0];
    expect(firstProduct.mf).toBe('C2H6S');
    expect(firstProduct.children).toHaveLength(0);
  });
  it('ethanol with limitReactions:5 and products false', () => {
    const ethanol = Molecule.fromSmiles('CCO');
    const { trees, products, stats } = applyReactions(
      [ethanol],
      reactionsDatabase,
      { limitReactions: 5, getProductsTrees: false },
    );

    expect(stats.counter).toBe(5);
    removeCoordinates(trees, products);

    expect(products[0]).toMatchSnapshot();

    expect(trees).toHaveLength(2);
    expect(products).toHaveLength(0);
  });
  it('ethylene glycol', () => {
    const diol = Molecule.fromSmiles('OCCO');
    const { trees, products } = applyReactions([diol], reactionsDatabase, {
      getProductsTrees: true,
    });
    removeCoordinates(trees, products);
    expect(products[0]).toMatchSnapshot();
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
      { getProductsTrees: true },
    );
    removeCoordinates(trees, products);
    expect(products[0]).toMatchSnapshot();

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
        getProductsTrees: true,
      },
    );
    removeCoordinates(trees, products);
    expect(products[0]).toMatchSnapshot();
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
        getProductsTrees: true,
      },
    );

    expect(Object.keys(products[0])).toStrictEqual([
      'idCode',
      'mf',
      'em',
      'mz',
      'charge',
      'trees',
      'reactions',
      'minSteps',
    ]);

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
      getProductsTrees: true,
    });
    removeCoordinates(undefined, products);
    expect(products).toMatchSnapshot();
  });
});

function removeCoordinates(trees, products) {
  if (trees) {
    for (const tree of trees) {
      tree.reactant.molfile = tree.reactant.molfile.replace(/^.{30}/gm, '');
      for (const product of tree.products) {
        product.molfile = product.molfile.replace(/^.{30}/gm, '');
        if (product.children) {
          removeCoordinates(product.children);
        }
      }
    }
  }
  if (products) {
    for (const product of products) {
      if (product.molfile) {
        product.molfile = product.molfile.replace(/^.{30}/gm, '');
      }
      if (product.trees) removeCoordinates(product.trees);
    }
  }
}
