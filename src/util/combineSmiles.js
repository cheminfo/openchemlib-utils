const MAX_R = 10;

/**
 * Generate molecules and calcule predicted properties form a list of smiles and fragments
 * @param {string} [coreSmiles]
 * @param {array} [fragments] Array of {smiles,R1,R2,...}
 * @param {OCL} [OCL] The openchemlib library
 * @param {object} [options={}]
 * @param {function} [options.onStep] method to execute each new molecules
 * @param {boolean} [options.complexity] returns only the number of molecules to evaluate
 * @return {Promise} promise that resolves to molecules or complexity as a number
 */
export async function combineSmiles(coreSmiles, fragments, OCL, options = {}) {
  const { complexity = false } = options;
  const core = getCore(coreSmiles);
  const rGroups = getRGroups(core, fragments);
  if (complexity) {
    return getComplexity(rGroups);
  }
  return generate(core, rGroups, OCL, options);
}

function getComplexity(rGroups) {
  let complexity = 1;
  for (let rGroup of rGroups) {
    complexity *= rGroup.smiles.length;
  }
  return complexity;
}

async function generate(core, rGroups, OCL, options = {}) {
  const { onStep } = options;
  const molecules = {};
  const sizes = new Array(rGroups.length);
  const currents = new Array(rGroups.length);
  for (let i = 0; i < rGroups.length; i++) {
    sizes[i] = rGroups[i].smiles.length - 1;
    currents[i] = 0;
  }
  let position = 0;
  let counter = 0;

  while (true) {
    counter++;
    while (position < currents.length) {
      if (currents[position] < sizes[position]) {
        if (onStep) {
          await onStep(counter);
        }
        appendMolecule(molecules, core, rGroups, currents, OCL);
        currents[position]++;
        for (let i = 0; i < position; i++) {
          currents[i] = 0;
        }
        position = 0;
      } else {
        position++;
      }
    }
    if ((position = currents.length)) {
      if (onStep) {
        await onStep(counter);
      }
      appendMolecule(molecules, core, rGroups, currents, OCL);
      break;
    }
  }
  return Object.keys(molecules)
    .map((key) => molecules[key])
    .sort((m1, m2) => m1.mw - m2.mw);
}

function appendMolecule(molecules, core, rGroups, currents, OCL) {
  let newSmiles = core.smiles;
  for (let i = 0; i < currents.length; i++) {
    newSmiles += `.${rGroups[i].smiles[currents[i]]}`;
  }

  const currentMol = OCL.Molecule.fromSmiles(newSmiles);
  const idCode = currentMol.getIDCode();

  if (!molecules[idCode]) {
    let molecule = {};
    molecules[idCode] = molecule;
    molecule.smiles = currentMol.toSmiles();
    molecule.combinedSmiles = newSmiles;
    molecule.idCode = idCode;
    molecule.molfile = currentMol.toMolfile();

    const props = new OCL.MoleculeProperties(currentMol);
    molecule.nbHAcceptor = props.acceptorCount;
    molecule.nbHDonor = props.donorCount;
    molecule.logP = props.logP;
    molecule.logS = props.logS;
    molecule.PSA = props.polarSurfaceArea;
    molecule.nbRottable = props.rotatableBondCount;
    molecule.nbStereoCenter = props.stereoCenterCount;
    let mf = currentMol.getMolecularFormula();
    molecule.mf = mf.formula;
    molecule.mw = mf.relativeWeight;
  }
}

function getCore(coreSmiles) {
  let core = {
    originalSmiles: coreSmiles,
    smiles: coreSmiles.replace(/\[R(?<group>[1-4])\]/g, '%5$<group>'),
  };

  for (let i = 0; i < MAX_R; i++) {
    if (core.originalSmiles.indexOf(`[R${i}]`) > -1) core[`R${i}`] = true;
  }
  return core;
}

function getRGroups(core, fragments) {
  let rGroups = {};
  for (const fragment of fragments) {
    if (fragment.smiles) {
      const smiles = updateRPosition(fragment.smiles);
      for (let i = 0; i < MAX_R; i++) {
        if (core[`R${i}`]) {
          // we only consider the R that are in the core
          if (fragment[`R${i}`]) {
            if (!rGroups[`R${i}`]) {
              rGroups[`R${i}`] = {
                group: `R${i}`,
                smiles: [],
              };
            }
            rGroups[`R${i}`].smiles.push(smiles.replace(/\[R\]/, `(%5${i})`));
          }
        }
      }
    }
  }
  return Object.keys(rGroups).map((key) => rGroups[key]);
}

function updateRPosition(smiles) {
  // R group should not be at the beginning
  if (smiles.indexOf('[R]') !== 0) return smiles;
  if (smiles.length === 3) return '[H][R]';
  // we are in trouble ... we need to move the R
  let newSmiles = smiles.replace('[R]', '');
  // we need to check where we should put the R group
  let level = 0;
  for (let j = 0; j < newSmiles.length; j++) {
    let currentChar = newSmiles.charAt(j);
    let currentSubstring = newSmiles.substr(j);
    if (currentChar === '(') {
      level++;
    } else if (currentChar === ')') {
      level--;
    } else if (level === 0) {
      if (currentSubstring.match(/^[a-z]/)) {
        return `${newSmiles.substr(0, j + 1)}([R])${newSmiles.substr(j + 1)}`;
      } else if (currentSubstring.match(/^[A-Z][a-z]/)) {
        return `${newSmiles.substr(0, j + 2)}([R])${newSmiles.substr(j + 2)}`;
      } else if (currentSubstring.match(/^[A-Z]/)) {
        return `${newSmiles.substr(0, j + 1)}([R])${newSmiles.substr(j + 1)}`;
      }
    }
  }
  return smiles;
}
