/**
 * @description Flatten the results of a reaction tree
 * @param {Array} reactionTree Tree of reactions
 * @returns {Array} Array of flat results
 */
export function flattenResults(reactionTree) {
  let results = {};

  for (const reaction of reactionTree) {
    flattenReaction(reaction, results);
  }
  let products = Object.values(results);

  return products;
}

function flattenReaction(tree, results, reactions = []) {
  for (let product of tree.products) {
    let result = {
      idCode: product.idCode,
      reactions: [...reactions, tree.reaction.rxnCode],
      nbReactions: reactions.length + 1,
    };

    if (results[result.idCode] === undefined) {
      result.trees = [
        {
          reaction: tree.reaction,
          reactant: tree.reactant,
        },
      ];
      results[result.idCode] = result;
    } else {
      results[result.idCode].trees.push({
        reaction: tree.reaction,
        reactant: tree.reactant,
      });
    }
    if (product.children.length > 0) {
      for (let child of product.children) {
        flattenReaction(child, results, [...reactions]);
      }
    }
  }
}
