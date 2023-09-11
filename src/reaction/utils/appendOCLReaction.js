/**
 * @description Append the OCL reaction to the reaction object
 * @param {Array} reactions array of reactions objects with rxnCode and label
 * @param {Object} OCL OCL object
 * @param {Object} [options={}]
 * @param {import('cheminfo-types').Logger} [options.logger]
 *
 * @returns {Array} array of reactions objects with rxnCode, label and oclReaction (a decoded version of rxnCode reaction)
 */
export function appendOCLReaction(reactions, OCL, options = {}) {
  const { logger } = options;

  const newReactions = []

  for (const reaction of reactions) {
    if (reaction.rxnCode) {
      newReactions.push({
        ...reaction,
        oclReaction: OCL.ReactionEncoder.decode(reaction.rxnCode),
      })
    } else if (logger) {
      logger.warn(reaction, 'Reaction without rxnCode');
    }
  }
  return newReactions;
}