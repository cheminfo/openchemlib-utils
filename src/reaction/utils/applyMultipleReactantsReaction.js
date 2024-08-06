import { getMF } from '../../util/getMF.js';

export function applyMultipleReactantsReaction(reactants, reactions, options) {
  const { OCL, results, reactantsInfo } = options;
  for (const reaction of reactions) {
    const reactor = new OCL.Reactor(reaction.oclReaction);
    let isMatching = reactants.length > 0;
    for (let i = 0; i < reactants.length; i++) {
      isMatching = isMatching && Boolean(reactor.setReactant(i, reactants[i]));
    }
    if (isMatching) {
      const oneReactionProducts = reactor.getProducts();
      for (const oneReactionProduct of oneReactionProducts) {
        const products = [];
        for (const oneProduct of oneReactionProduct) {
          const mf = getMF(oneProduct).mf;
          const molfile = oneProduct.toMolfile();
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
