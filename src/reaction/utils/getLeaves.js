export function getLeaves(trees) {
  const leaves = [];
  for (const tree of trees) {
    getLeavesSS(leaves, tree);
  }
  return leaves
}

function getLeavesSS(leaves, currentBranch) {

  if (currentBranch.products.length === 0) {
    leaves.push(currentBranch)
  }

  for (const product of currentBranch.products) {
    if (product.children.length > 0) {
      for (const child of product.children) {
        getLeavesSS(leaves, child);
      }
    } else {
      leaves.push(product)
    }
  }
}
