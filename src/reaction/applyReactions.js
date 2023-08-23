import { applyOneReactantReaction } from './utils/applyOneReactantReaction.js';
import { groupTreesByProducts } from './utils/groupTreesByProducts.js';
/**
 * Create reaction trees of products based on reactions and reactants
 * @param {import('openchemlib').Molecule[]} reactants
 * @param {Array} reactions array of reactions objects with rxnCode, label and needChargeToReact
 * @param {object} options options to apply the reaction
 * @param {number} [options.maxDepth=5] max depth of the recursion
 * @param {number} [options.limitReactions=5000] limit the number of reactions to apply
 * @param {boolean} [options.getProductsTrees=false] if true, the returned object will have a products property with the products trees grouped by idCode else it will be an empty array
 * @returns {Object} The returned object has two properties:
 * - trees: the tree of reactions
 * - products: reactions trees grouped by product idCode
 */
export function applyReactions(reactants, reactions, options = {}) {
  // Reaction are applied recursively until maximal tree depth is reached (default 10)
  const {
    maxDepth = 5,
    limitReactions = 5000,
    getProductsTrees = false,
  } = options;
  const moleculesInfo = new Map();
  const processedMolecules = new Set();
  if (!reactants.length) {
    throw new Error('Can not extract OCL because there is no reactants');
  }
  // get the OCL object from the first reactant
  const OCL = reactants[0].getOCL();

  reactions = appendOCLReaction(reactions, OCL);

  const stats = { counter: 0 };
  const trees = [];
  // Start the recursion by applying the first level of reactions
  let todoCurrentLevel = applyOneReactantReaction(reactants, reactions, {
    OCL,
    currentDepth: 0,
    moleculesInfo,
    processedMolecules,
    maxDepth,
    trees,
    stats,
    limitReactions,
  });
  do {
    const nexts = [];
    for (const todo of todoCurrentLevel) {
      nexts.push(todo());
    }
    todoCurrentLevel = nexts.flat();
  } while (todoCurrentLevel.length > 0);
  let products;
  if (getProductsTrees) {
    products = groupTreesByProducts(trees);
  } else {
    products = [];
  }
  return { trees, products, stats };
}

/**
 * @description Append the OCL reaction to the reaction object
 * @param {Array} reactions array of reactions objects with rxnCode and label
 * @param {Object} OCL OCL object
 * @returns {Array} array of reactions objects with rxnCode, label and oclReaction (a decoded version of rxnCode reaction)
 */
function appendOCLReaction(reactions, OCL) {
  reactions = JSON.parse(JSON.stringify(reactions)).filter(
    (reaction) => reaction.rxnCode,
  );
  for (const reaction of reactions) {
    reaction.oclReaction = OCL.ReactionEncoder.decode(reaction.rxnCode);
  }
  return reactions;
}
