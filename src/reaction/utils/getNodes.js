export function getNodes(trees) {
  const nodes = [];
  for (const tree of trees) {
    getNodesSS(nodes, tree);
  }
  return nodes;
}

function getNodesSS(nodes, currentBranch) {
  nodes.push(currentBranch);

  for (const child of currentBranch?.children || []) {
    getNodesSS(nodes, child);
  }
}
