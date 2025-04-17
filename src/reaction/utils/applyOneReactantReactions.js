import { checkIfExistsOrAddInfo } from './checkIfExistsOrAddInfo.js';

/**
 * @description apply one reaction to one reactant
 * @param {import('openchemlib').Molecule[]} reactants
 * @param tree
 * @param {Array<object>} reactions - rxnCode of the reaction
 * @param {object} options - options to apply the reaction
 * @param {number} options.currentDepth - current depth of the recursion
 * @param {number} options.maxDepth - max depth of the recursion
 * @param {number} options.maxCurrentDepth - max depth of the recursion for this set of reactions
 * @param {number} options.limitReactions - limit the number of reactions
 * @param {object} options.stats - stats of the recursion
 * @param {number} options.stats.counter - number of reactions
 * @param {Map} options.processedMolecules - set of processed molecules
 * @param {Array} options.trees - array of trees of previous recursions
 * @param {object} options.OCL - OCL object
 * @returns {Array} array of results
 */
export function applyOneReactantReactions(tree, reactions, options) {
  const {
    currentDepth,
    maxDepth,
    maxCurrentDepth,
    processedMolecules,
    OCL,
    logger,
  } = options;
  if (tree.molecules.length !== 1) {
    logger?.warn(
      'applyOneReactantReactions:tree.reactants.length!==1',
      tree.reactants.length,
    );
    return [];
  }
  const reactant = OCL.Molecule.fromIDCode(tree.molecules[0].idCode);

  const todoNextDepth = [];
  // if the current depth is greater than the max depth, we stop the recursion and return an empty array
  if (currentDepth > maxCurrentDepth || tree.depth >= maxDepth) {
    return [];
  }

  const existsAndInfo = checkIfExistsOrAddInfo(processedMolecules, reactant, {
    ...options,
    asReagent: true,
  });
  // check if the reactant has already been processed
  if (existsAndInfo.exists) {
    return [];
  }
  for (const reaction of reactions) {
    if (options.stats.counter >= options.limitReactions) {
      return [];
    }
    const reactor = new OCL.Reactor(reaction.oclReaction);
    // isMatching is true if the reactant is matching the reaction else we continue to the next reaction
    const isMatching = Boolean(reactor.setReactant(0, reactant));
    if (isMatching) {
      options.stats.counter++;
      // get the products of the reaction
      const oneReactionProducts = reactor.getProducts();
      for (const oneReactionProduct of oneReactionProducts) {
        for (const reactionProduct of oneReactionProduct) {
          // get the info of the product (idCode, mf)
          const productExistsAndInfo = checkIfExistsOrAddInfo(
            processedMolecules,
            reactionProduct,
            { ...options, asProduct: true },
          );
          // if the product has not been processed yet, we add it to the list of products and we add it to the list of todoNextDepth
          if (!productExistsAndInfo.exists) {
            // eslint-disable-next-line no-unused-vars
            const { oclReaction, needToBeCharged, ...reactionWithoutOCL } =
              reaction;

            const oneReaction = {
              reaction: reactionWithoutOCL,
              depth: tree.depth + 1,
              isValid: true,
              currentDepth,
              molecules: [
                checkIfExistsOrAddInfo(
                  processedMolecules,
                  reactionProduct,
                  options,
                ).info,
              ],
            };

            if (!tree.children) tree.children = [];
            tree.children.push(oneReaction);

            todoNextDepth.push(() => {
              return applyOneReactantReactions(oneReaction, reactions, {
                ...options,
                currentDepth: options.currentDepth + 1,
              });
            });
          }
        }
      }
    }
  }
  // by returning todoNextDepth, we make sure that the recursion will continue
  return todoNextDepth;
}
