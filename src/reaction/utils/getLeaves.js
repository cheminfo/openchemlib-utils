export function getLeaves(trees) {
  const leaves = [];
  for (const tree of trees) {
    getLeavesSS(leaves, tree);
  }
  return leaves
}

function getLeavesSS(leaves, currentBranch) {
  if (!currentBranch.children || currentBranch.children.length === 0) {
    leaves.push(currentBranch)
    return
  }

  for (const child of currentBranch.children) {
    getLeavesSS(leaves, child);
  }
}
