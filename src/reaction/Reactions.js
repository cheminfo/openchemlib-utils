import { appendOCLReaction } from './utils/appendOCLReaction.js';
import { applyOneReactantReaction } from './utils/applyOneReactantReaction.js';
import { getLeaves } from './utils/getLeaves.js';


export class Reactions {
  /**
   *
   * @param {object} [options={}]
   * @param {import('cheminfo-types').Logger} logger
   * @param {number} [options.maxDepth=5]
   * @param {function} [options.moleculeInfoCallback]
   * @param {boolean} [options.skipProcessed=true]
   */
  constructor(OCL, options = {}) {
    this.reactantsMatrix = []; // array of array of molecules
    this.moleculeInfoCallback = options.moleculeInfoCallback;
    this.maxDepth = options.maxDepth ?? 5;
    this.limitReactions = options.limitReactions ?? 200;
    this.skipProcessed = options.skipProcessed ?? true;
    this.logger = options.logger;
    this.processedMolecules = new Map()
    this.OCL = OCL
    this.trees = []
    this.moleculeInfo = {} // a cache containing molecule information like mw, etc.

  }

  /**
   * We need to call this method for all the reactants on which we want to apply the reactions.
   * If there is only one reactant, we call this method with an array of one reactant.
   * If there are multiple reactants, we call this method with an array of the reactants.
   * This method has to be called for all the reactants
   * @param {import('openchemlib').Molecule[]} reactants
   * @param {*} reactions
   */
  appendReactants(reactants) {
    if (!Array.isArray(reactants)) {
      throw new TypeError('reactants must be an array');
    }
    if (this.trees.length > 0) {
      throw new Error('appendReactants can only be called when no trees have been generated yet');
    }
    this.reactantsMatrix.push(reactants);
  }

  getLeaves() {
    return getLeaves(this.trees)
  }

  applyOneReactantReactions(reactions, options = {}) {
    const { leaves = false } = options;
    let reactants = [];
    let trees;
    if (leaves) {
      trees = this.getLeaves();
      reactants = trees.map((tree) => this.OCL.Molecule.fromIDCode(tree.idCode));
    } else {
      reactants = this.reactantsMatrix.flat(); // array of Molecules
      trees = this.trees;
    }


    reactions = appendOCLReaction(reactions, this.OCL);
    const stats = { counter: 0 };
    // Start the recursion by applying the first level of reactions
    let todoCurrentLevel = applyOneReactantReaction(reactants, reactions, {
      OCL: this.OCL,
      currentDepth: 0,
      processedMolecules: this.processedMolecules,
      moleculeInfoCallback: this.moleculeInfoCallback,
      maxDepth: this.maxDepth,
      trees,
      stats,
      limitReactions: this.limitReactions,
    });
    do {
      const nexts = [];
      for (const todo of todoCurrentLevel) {
        nexts.push(todo());
      }
      todoCurrentLevel = nexts.flat();
    } while (todoCurrentLevel.length > 0);

    console.log(this.trees)
    //console.log(this.trees[0].products)


  }

  filterTree(callback) { }

  filterProducts(callback) { }
}

