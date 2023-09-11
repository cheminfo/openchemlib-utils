
/**
 * @description apply one reaction to one reactant
 * @param {import('openchemlib').Molecule[]} reactants
 * @param {Array<Object>} reactions rxnCode of the reaction
 * @param {Object} options options to apply the reaction
 * @param {number} options.currentDepth current depth of the recursion
 * @param {number} options.maxDepth max depth of the recursion
 * @param {number} options.limitReactions limit the number of reactions
 * @param {Object} options.stats stats of the recursion
 * @param {number} options.stats.counter number of reactions
 * @param {Map} options.processedMolecules set of processed molecules
 * @param {Array} options.trees array of trees of previous recursions
 * @param {import('openchemlib')} options.OCL OCL object
 * @returns {Array} array of results
 */
export function applyOneReactantReaction(reactants, reactions, options) {
  const { currentDepth, maxDepth, processedMolecules, trees } =
    options;


  const todoNextDepth = [];
  // if the current depth is greater than the max depth, we stop the recursion and return an empty array
  if (currentDepth >= maxDepth) return [];

  const { OCL } = options;
  for (const reactant of reactants) {
    const existsAndInfo = checkIfExistsOrAddInfo(processedMolecules, reactant, { ...options, asReagent: true })
    // check if the reactant has already been processed
    if (existsAndInfo.exists) {
      continue;
    }
    for (const reaction of reactions) {
      if (options.stats.counter >= options.limitReactions) {
        return [];
      }
      options.stats.counter++;
      const reactor = new OCL.Reactor(reaction.oclReaction);
      // isMatching is true if the reactant is matching the reaction else we continue to the next reaction
      const isMatching = Boolean(reactor.setReactant(0, reactant));
      if (isMatching) {
        // get the products of the reaction
        const oneReactionProducts = reactor.getProducts();
        for (const oneReactionProduct of oneReactionProducts) {
          const products = [];
          for (const reactionProduct of oneReactionProduct) {
            // get the info of the product (molfile, idCode, mf)
            const productExistsAndInfo = checkIfExistsOrAddInfo(
              processedMolecules,
              reactionProduct, { ...options, asProduct: true },
            );
            // if the product has not been processed yet, we add it to the list of products and we add it to the list of todoNextDepth
            if (!productExistsAndInfo.exists) {
              const product = {
                ...productExistsAndInfo.info,
                children: [],
              };
              products.push(product);

              todoNextDepth.push(() => {
                return applyOneReactantReaction([reactionProduct], reactions, {
                  ...options,
                  currentDepth: options.currentDepth + 1,
                  trees: product.children,
                });
              });
            }
          }
          // if there is at least one product, we add the reaction to the results
          if (products.length > 0) {
            // eslint-disable-next-line no-unused-vars
            const { oclReaction, needToBeCharged, ...reactionWithoutOCL } =
              reaction;
            const oneReaction = {
              reaction: reactionWithoutOCL,
              reactant: checkIfExistsOrAddInfo(processedMolecules, reactant, options).info,
              products,
            };
            trees.push(oneReaction);
          }
        }
      }
    }
  }
  // by returning todoNextDepth, we make sure that the recursion will continue
  return todoNextDepth;
}

function checkIfExistsOrAddInfo(processedMolecules, molecule, options) {
  const { moleculeInfoCallback, asReagent, asProduct } = options
  const idCode = molecule.getIDCode();
  if (processedMolecules.has(idCode)) {
    const entry = processedMolecules.get(idCode);
    let exists = false;
    if (asReagent) {
      if (entry.asReagent) {
        exists = true
      } else {
        entry.asReagent = true;
      }
    }
    if (asProduct) {
      if (entry.asProduct) {
        exists = true
      } else {
        entry.asProduct = true;
      }
    }
    return { exists, info: entry };
  } else {
    let info = {
      idCode,
      molfile: molecule.toMolfile(),
      asReagent,
      asProduct,
      info: {}
    }
    if (moleculeInfoCallback) {
      info.info = moleculeInfoCallback(molecule)
    }
    processedMolecules.set(idCode, info);
    return { exists: false, info };
  }

}