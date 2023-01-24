import { applyOneReactantReaction } from './utils/applyOneReactantReaction.js';

/**
 *
 * @param {import('openchemlib').Molecule[]} reactants
 * @param {Array} reactions
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

  const results = applyOneReactantReaction(reactants, reactions, {
    OCL,
    currentDepth: 0,
    moleculesInfo,
    processedMolecules,
    maxDepth,
  });

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
