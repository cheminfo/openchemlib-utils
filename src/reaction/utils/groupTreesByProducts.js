import { trimTree } from './trimTree.js';

/**
 * @description Group the trees by product idCode
 * @param {Array} trees Trees of reactions
 * @returns {Array} Array of products with their corresponding trees and reactions
 */
export function groupTreesByProducts(trees) {
  let results = {};
  for (const tree of trees) {
    let copyTree = JSON.parse(JSON.stringify(tree));
    groupProductTrees(copyTree, results, tree);
  }
  return Object.values(results);
}

/**
 * @description For a given tree, recursively group the branches leading to a each idCode
 * @param {Object} currentBranch Current recursive branch of the tree of reactions
 * @param {Object} results Object with the branches grouped by idCode
 * @param {Object} originalBranch Original tree of reactions (not modified)
 */
function groupProductTrees(currentBranch, results, originalBranch) {
  for (let product of currentBranch.products) {
    // This way is faster than structuredClone
    let copyBranch = JSON.parse(JSON.stringify(originalBranch));
    let reactions = [];
    // Trim the tree to get all branches leading to the idCode of the product
    trimTree(product.idCode, copyBranch, reactions);

    let nbReactions = reactions.length;
    if (results[product.idCode] === undefined) {
      results[product.idCode] = {
        idCode: product.idCode,
        mf: product.mf,
        em: product.em,
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
      for (let child of product.children) {
        groupProductTrees(child, results, originalBranch);
      }
    }
  }
}
