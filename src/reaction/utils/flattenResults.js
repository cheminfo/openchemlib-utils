import { MF } from 'mf-parser';

const results = {};
/**
 * @description Flatten the results of a reaction tree
 * @param {Array} reactionTree Tree of reactions
 * @param {*} minDepth Minimum depth of the tree to be included in the flat results
 * @returns {Array} Array of flat results
 */
export function flattenResults(reactionTree, minDepth) {
  for (const reaction of reactionTree) {
    flattenReaction(reaction);
  }
  let products = Object.values(results);
  let minDepthProducts = products.filter(
    (product) => product.minSteps >= minDepth,
  );

  return minDepthProducts;
}

function flattenReaction(reaction, reactions = []) {
  for (let product of reaction.products) {
    let result = {};
    result.idCode = product.idCode;
    reactions.push(reaction.reaction.rxnCode);
    result.reactions = reactions;
    result.nbReactions = reactions.length;
    result.otherReactions = [];
    const mf = new MF(product.mf);
    result.mass =
      mf.getInfo().observedMonoisotopicMass ?? mf.getInfo().monoisotopicMass;
    if (results[result.idCode] === undefined) {
      result.minSteps = reactions.length;
      results[result.idCode] = result;
    } else if (results[result.idCode].nbReactions > result.nbReactions) {
      result.minSteps = reactions.length;
      result.otherReactions.push(results[result.idCode]);
      results[result.idCode] = result;
    } else if (results[result.idCode].nbReactions <= result.nbReactions) {
      result.minSteps = results[result.idCode].nbReactions;
      results[result.idCode].otherReactions.push(result);
    }
    if (product.children.length > 0) {
      for (let child of product.children) {
        const reactionsNextRecursion = [...reactions];
        flattenReaction(child, reactionsNextRecursion);
      }
    }
  }
}
