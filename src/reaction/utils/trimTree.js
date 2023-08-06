/**
 * @description Trim the tree of reactions to keep only the paths to the product
 * @param {string} idCode idCode of the product
 * @param {Object} tree Tree of reactions
 * @param {Array} reactions Array of rxnCode of reactions
 */

export function trimTree(idCode, tree, reactions) {
  markProduct(idCode, tree);
  cutBranches(tree, reactions);
}

/**
 * @description For a given idCode, mark the products that contain it with a flag true and the others with a flag false
 * @param {string} idCode idCode of the product
 * @param {Object} tree Current branch of the tree of reactions
 */
function markProduct(idCode, tree) {
  for (const product of tree.products) {
    product.flag = product.idCode === idCode;
    if (product.children.length > 0) {
      for (const child of product.children) {
        markProduct(idCode, child);
      }
    }
  }
}

/**
 * @description Check if the child branch has a flag true in its products
 * @param {Object} tree Current branch of the tree of reactions
 * @returns {boolean} true if the tree has a flag true in its products
 */
function childHasFlag(tree) {
  for (const product of tree.products) {
    if (product.flag) {
      return true;
    }
    if (product.children.length > 0) {
      for (const child of product.children) {
        if (childHasFlag(child)) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 *@description Cut the branches of the tree that don't have a flag true in their products
 * @param {Object} tree Current branch of the tree of reactions
 * @param {Array} reactions Array of rxnCode of reactions
 */
function cutBranches(tree, reactions) {
  reactions.push(tree.reaction.rxnCode);
  for (const product of tree.products) {
    if (product.flag) {
      product.children = [];
    }
    if (product.children.length > 0) {
      for (const child of product.children) {
        const hasFlag = childHasFlag(child);
        if (!hasFlag) {
          child.products = [];
        }
        cutBranches(child, reactions);
      }
      product.children = product.children.filter(
        (child) => child.products.length > 0,
      );
    }
  }
}
