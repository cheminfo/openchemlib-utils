

export function getFilteredTrees(reactions, options = {}) {
  const { filter = () => true } = options;
  const nodesToKeep = reactions.getNodes().filter(filter);
  const parentMap = reactions.getParentMap();

  for (let currentNode of nodesToKeep) {
    const parent = parentMap.get(currentNode);
    if (parent) {
      nodesToKeep.push(parent);
    }
  }

  return getValidChildren(reactions.trees, { nodesToKeep })
}

function getValidChildren(nodes, options) {
  const { nodesToKeep } = options;
  const validNodes = nodes.filter((child) => nodesToKeep.includes(child))

  for (const node of validNodes) {
    const newChildren = []
    if (node.children) {
      const validChildren = getValidChildren(node.children, { nodesToKeep })
      if (validChildren.length > 0) {
        newChildren.push({
          ...node
        })
      } else {
        newChildren.push({
          ...node, children: getValidChildren(node.children, { nodesToKeep })
        })
      }
    } else {
      newChildren.push({
        ...node
      })
    }
    if (newChildren.length > 0) {
      node.children = newChildren
    }
  }

  return validNodes
}