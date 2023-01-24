import { getMF } from '../../util/getMF.js';

export function applyMultipleReactantsReaction(reactants, reactions, options) {
  const { OCL, results, reactantsInfo } = options;
  for (const reaction of reactions) {
    const reactor = new OCL.Reactor(reaction.oclReaction);
    let isMatching = Boolean(reactants.length);
    for (let i = 0; i < reactants.length; i++) {
      isMatching = isMatching && Boolean(reactor.setReactant(i, reactants[i]));
    }
    if (isMatching) {
      const oneReactionProducts = reactor.getProducts();
      for (let i = 0; i < oneReactionProducts.length; i++) {
        const products = [];
        for (let j = 0; j < oneReactionProducts[i].length; j++) {
          const mf = getMF(oneReactionProducts[i][j]).mf;
          const molfile = oneReactionProducts[i][j].toMolfile();
          products.push({ molfile, mf });
        }
        const oneReaction = {
          reaction,
          reactants: reactantsInfo,
          products,
          children: [],
        };
        results.push(oneReaction);
      }
    }
  }
}
