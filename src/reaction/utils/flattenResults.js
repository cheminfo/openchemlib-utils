/**
 * @description Flatten the results of a reaction tree
 * @param {Array} reactionTree Tree of reactions
 * @returns {Array} Array of flat results
 */

export function flattenResults(reactionTree) {
  let results = {};
  for (const branch of reactionTree) {
    let copyBranch = { ...branch };
    flattenReaction(copyBranch, results, branch);
  }
  return Object.values(results);
}

function flattenReaction(currentBranch, results, originalBranch) {
  for (let product of currentBranch.products) {
    // ATTENTION: This method allows for a deep copy of the tree
    // Other methods such as {...tree} won't work
    let copyBranch = JSON.parse(JSON.stringify(originalBranch));
    let reactions = [];
    addFlag(product.idCode, copyBranch);
    removeBranches(copyBranch, reactions);
    copyBranch = removeBottomEntries(copyBranch);
    let nbReactions = reactions.length;
    if (results[product.idCode] === undefined) {
      results[product.idCode] = {
        idCode: product.idCode,
        mf: product.mf,
        tree: [copyBranch],
        reactions,
        minSteps: nbReactions,
      };
    } else {
      results[product.idCode].tree.push(copyBranch);
      if (nbReactions < results[product.idCode].minSteps) {
        results[product.idCode].minSteps = nbReactions;
        results[product.idCode].reactions = reactions;
      }
    }

    if (product.children.length > 0) {
      for (let child of product.children) {
        flattenReaction(child, results, originalBranch);
      }
    }
  }
}

function removeBranches(tree, reactions, previousFlag = false) {
  reactions.push(tree.reaction.rxnCode);
  for (const product of tree.products) {
    if (product.flag && !previousFlag) {
      product.children = [];
    }
    if (product.children.length > 0) {
      for (const child of product.children) {
        removeBranches(child, reactions, product.flag);
      }
    }
  }
}

function addFlag(idCode, tree) {
  for (const product of tree.products) {
    product.flag = product.idCode === idCode;
    if (product.children.length > 0) {
      for (const child of product.children) {
        addFlag(idCode, child);
      }
    }
  }
}

function removeBottomEntries(data) {
  data.products = data.products.filter((product) => {
    if (product.children.length > 0) {
      for (let child of product.children) {
        if (child.products.length > 0) {
          removeBottomEntries(child);
        }
      }
    }
    if (product.flag) {
      return true;
    }

    if (product.children.length === 0 && !product.flag) {
      return false;
    }
    return true;
  });

  return data;
}
