

export class Reactions {
  /**
   *
   * @param {object} [options={}]
   * @param {number} [options.maxDepth=5]
   * @param {function} [options.moleculeExtraInfo]
   * @param {boolean} [options.skipProcessed=true]
   */
  constructor(options = {}) {
    this.reactants = []; // array of array of molecules
    this.moleculeExtraInfo = options.moleculeExtraInfo;
    this.maxDepth = options.maxDepth ?? 5;
    this.skipProcessed = options.skipProcessed ?? true;
  }

  /**
   * @param {import('openchemlib').Molecule[]} reactants
   * @param {*} reactions
   */
  appendOneReactionReactants(reactants) {
    if (!Array.isArray(reactants)) {
      throw new TypeError('reactants must be an array');
    }
    this.reactants.push(reactants);
  }


  applyReactions(reactions, options = {}) {
    const { flattenProducts = true } = options;
  }

  filterTree(callback) { }

  filterProducts(callback) { }
}
