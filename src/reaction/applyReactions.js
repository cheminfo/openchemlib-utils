import { applyOneReactantReaction } from './utils/applyOneReactantReaction.js';

/**
 * Create a tree of products based on reactions and reactants
 * @param {import('openchemlib').Molecule[]} reactants
 * @param {Array} reactions
 * @param {object} options
 * @param {number} [options.maxDepth=10]
 * @returns
 */
export function applyReactions(reactants, reactions, options = {}) {
  const { maxDepth = 10 } = options;
  const moleculesInfo = new Map();
  const processedMolecules = new Set();
  if (!reactants.length) {
    throw new Error('Can not extract OCL because there is no reactants');
  }
  const OCL = reactants[0].getOCL();

  reactions = appendOCLReaction(reactions, OCL);

  const results = [];

  let todoCurrentLevel = applyOneReactantReaction(reactants, reactions, {
    OCL,
    currentDepth: 0,
    moleculesInfo,
    processedMolecules,
    maxDepth,
    results,
  });

  do {
    const nexts = [];
    for (const todo of todoCurrentLevel) {
      nexts.push(todo());
    }
    todoCurrentLevel = nexts.flat();
  } while (todoCurrentLevel.length > 0);

  return results;
}

function appendOCLReaction(reactions, OCL) {
  reactions = JSON.parse(JSON.stringify(reactions)).filter(
    (reaction) => reaction.rxnCode,
  );
  for (const reaction of reactions) {
    reaction.oclReaction = OCL.ReactionEncoder.decode(reaction.rxnCode);
  }
  return reactions;
}
