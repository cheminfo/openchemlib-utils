export function getLeaves(trees) {
  const leaves = [];
  for (const tree of trees) {
    appendLeavesSS(leaves, tree);
  }
  return leaves;
}

function appendLeavesSS(leaves, currentBranch) {
  if (!currentBranch.children || currentBranch.children.length === 0) {
    leaves.push(currentBranch);
    return;
  }

  for (const child of currentBranch.children) {
    appendLeavesSS(leaves, child);
  }
}
