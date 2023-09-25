import { appendOCLReaction } from './utils/appendOCLReaction.js';
import { applyOneReactantReactions } from './utils/applyOneReactantReactions.js';
import { checkIfExistsOrAddInfo } from './utils/checkIfExistsOrAddInfo.js';
import { getLeaves } from './utils/getLeaves.js';
import { getNodes } from './utils/getNodes.js';

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
    this.moleculeInfoCallback = options.moleculeInfoCallback;
    this.maxDepth = options.maxDepth ?? 5;
    this.limitReactions = options.limitReactions ?? 200;
    this.skipProcessed = options.skipProcessed ?? true;
    this.logger = options.logger;
    this.processedMolecules = new Map();
    this.OCL = OCL;
    this.trees = [];
    this.moleculeInfo = {}; // a cache containing molecule information like mw, etc.
  }

  /**
   * We need to call this method for all the reactants on which we want to apply the reactions.
   * If there is only one reactant, we call this method with an array of one reactant.
   * If there are multiple reactants, we call this method with an array of the reactants.
   * This method has to be called for all the reactants
   * @param {import('openchemlib').Molecule[]} molecules
   * @param {*} reactions
   */
  appendTree(moleculesOrIDCodes) {
    if (!Array.isArray(moleculesOrIDCodes)) {
      throw new TypeError('reactants must be an array');
    }

    const molecules = moleculesOrIDCodes.map(
      (molecule) =>
        checkIfExistsOrAddInfo(this.processedMolecules, molecule, {
          moleculeInfoCallback: this.moleculeInfoCallback,
        }).info,
    );

    const tree = {
      molecules,
    };

    this.trees.push(tree);
  }

  getLeaves() {
    return getLeaves(this.trees);
  }

  getNodes() {
    return getNodes(this.trees);
  }

  applyOneReactantReactions(reactions) {
    clearAsFromProcessedMolecules(this.processedMolecules);
    const nodes = this.getNodes();
    reactions = appendOCLReaction(reactions, this.OCL);
    const stats = { counter: 0 };
    // Start the recursion by applying the first level of reactions
    for (const leave of nodes) {
      let todoCurrentLevel = applyOneReactantReactions(leave, reactions, {
        OCL: this.OCL,
        currentDepth: 1,
        processedMolecules: this.processedMolecules,
        moleculeInfoCallback: this.moleculeInfoCallback,
        maxDepth: this.maxDepth,
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
    }
  }

  filterTree(callback) { }

  filterProducts(callback) { }
}

function clearAsFromProcessedMolecules(processedMolecules) {
  for (const [key, value] of processedMolecules) {
    if (value.asReagent) {
      value.asReagent = false;
    }
    if (value.asProduct) {
      value.asProduct = false;
    }
  }
}
