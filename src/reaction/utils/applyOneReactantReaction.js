import { getInfo } from './getReactantInfo.js';

export function applyOneReactantReaction(reactants, reactions, options) {
  const { currentDepth, maxDepth, moleculesInfo, processedMolecules } = options;
  if (currentDepth >= maxDepth) return [];
  if (!Array.isArray(reactants)) {
    reactants = [reactants];
  }
  const { OCL } = options;
  const results = [];
  for (const reactant of reactants) {
    const idCode = reactant.getIDCode();
    if (processedMolecules.has(idCode)) {
      continue;
    } else {
      processedMolecules.add(idCode);
    }
    for (const reaction of reactions) {
      const reactor = new OCL.Reactor(reaction.oclReaction);
      const isMatching = Boolean(reactor.setReactant(0, reactant));
      if (isMatching) {
        const oneReactionProducts = reactor.getProducts();
        for (let i = 0; i < oneReactionProducts.length; i++) {
          const products = [];
          for (let j = 0; j < oneReactionProducts[i].length; j++) {
            const moleculeInfo = getInfo(
              oneReactionProducts[i][j],
              moleculesInfo,
            );
            if (!processedMolecules.has(moleculeInfo.idCode)) {
              console.log(currentDepth, moleculeInfo.mf);
              products.push({
                ...moleculeInfo,
                children: applyOneReactantReaction(
                  oneReactionProducts[i][j],
                  reactions,
                  { ...options, currentDepth: options.currentDepth + 1 },
                ),
              });
            }
          }
          if (products.length > 0) {
            const oneReaction = {
              reaction,
              reactant: getInfo(reactant, moleculesInfo),
              products,
            };
            results.push(oneReaction);
          }
        }
      }
    }
  }
  return results;
}
