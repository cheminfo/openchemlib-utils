export function getFilteredTrees(reactions, options = {}) {
  const { filter = () => true } = options;
  const nodesToKeep = reactions.getNodes().filter(filter);
  const parentMap = reactions.getParentMap();

  for (let currentNode of nodesToKeep) {
    const parent = parentMap.get(currentNode);
    if (parent && nodesToKeep.includes(parent) === false) {
      nodesToKeep.push(parent);
    }
  }
  return getValidChildren(reactions.trees, { nodesToKeep });
}

function getValidChildren(nodes, options) {
  const { nodesToKeep } = options;
  const validNodes = nodes
    .filter((node) => nodesToKeep.includes(node))
    .map((node) => ({ ...node }));
  for (const node of validNodes) {
    if (node.children) {
      const validChildren = node.children.filter((child) =>
        nodesToKeep.includes(child),
      );
      if (validChildren.length > 0) {
        node.children = getValidChildren(validChildren, { nodesToKeep });
      } else {
        delete node.children;
      }
    }
  }
  return validNodes;
}
