import { appendOCLReaction } from './utils/appendOCLReaction.js';
import { applyOneReactantReactions } from './utils/applyOneReactantReactions.js';
import { groupTreesByProducts } from './utils/groupTreesByProducts.js';

/**
 * @typedef {object} ReactionEntry
 * @property {string} label
 * @property {string} rxnCode
 */

/**
 * Create reaction trees of products based on reactions and reactants
 * @param {import('openchemlib').Molecule[]} reactants
 * @param {ReactionEntry[]} reactions - array of reactions objects with rxnCode, label
 * @param {object} options - options to apply the reaction
 * @param {number} [options.maxDepth=5] - max depth of the recursion
 * @param {number} [options.limitReactions=200] - limit the number of reactions to apply
 * @param {boolean} [options.getProductsTrees=false] - if true, the returned object will have a products property with the products trees grouped by idCode else it will be an empty array
 * @returns {object} The returned object has two properties:
 * - trees: the tree of reactions
 * - products: reactions trees grouped by product idCode
 */
export function applyReactions(reactants, reactions, options = {}) {
  // eslint-disable-next-line no-console
  console.warn('applyReactions is deprecated');
  // Reaction are applied recursively until maximal tree depth is reached (default 10)
  const {
    maxDepth = 5,
    limitReactions = 200,
    getProductsTrees = false,
  } = options;
  const moleculesInfo = new Map();
  const processedMolecules = new Set();
  if (reactants.length === 0) {
    throw new Error('Can not extract OCL because there is no reactants');
  }
  // get the OCL object from the first reactant
  const OCL = reactants[0].getOCL();

  reactions = appendOCLReaction(reactions, OCL);

  const stats = { counter: 0 };
  const trees = [];
  // Start the recursion by applying the first level of reactions
  let todoCurrentLevel = applyOneReactantReactions(reactants, reactions, {
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
