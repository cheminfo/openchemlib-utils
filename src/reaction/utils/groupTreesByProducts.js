import { trimTree } from './trimTree.js';

/**
 * @description Group reaction trees by product idCode
 * @param {Array} trees - Trees of reactions
 * @returns {Array} Array of products with their corresponding trees and reactions
 */
export function groupTreesByProducts(trees) {
  // eslint-disable-next-line no-console
  console.warn('groupTreesByProducts is deprecated');
  const results = {};
  for (const tree of trees) {
    const copyTree = structuredClone(tree);
    groupProductTrees(copyTree, results, tree);
  }
  return Object.values(results);
}

/**
 * @description For a given reaction tree, recursively group the branches by idCode of the product
 * @param {object} currentBranch - Current recursive branch of the tree of reactions
 * @param {object} results - Object with the branches grouped by idCode
 * @param {object} originalBranch - Original tree of reactions (not modified)
 */
function groupProductTrees(currentBranch, results, originalBranch) {
  for (const product of currentBranch.products) {
    // This way is faster than structuredClone
    const copyBranch = structuredClone(originalBranch);
    const reactions = [];
    // Trim the tree to get all branches leading to the idCode of the product
    trimTree(product.idCode, copyBranch, reactions);

    const nbReactions = reactions.length;
    if (results[product.idCode] === undefined) {
      results[product.idCode] = {
        idCode: product.idCode,
        mf: product.mf,
        em: product.em,
        mz: product.mz,
        charge: product.charge,
        trees: [copyBranch],
        reactions,
        minSteps: nbReactions,
      };
    } else {
      results[product.idCode].trees.push(copyBranch);
      if (nbReactions < results[product.idCode].minSteps) {
        results[product.idCode].minSteps = nbReactions;
        results[product.idCode].reactions = reactions;
      }
    }

    if (product.children.length > 0) {
      for (const child of product.children) {
        groupProductTrees(child, results, originalBranch);
      }
    }
  }
}
