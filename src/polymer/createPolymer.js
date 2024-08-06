/**
 * Create a polymer from a unit, alpha and omega groups
 * A unit must contain a R1 and a R2
 * An alpha end group must contain a R1
 * An omega end group must contain a R2
 * @param {import('openchemlib').Molecule} molecule - an instance of OCL.Molecule
 * @param unit
 * @param {object} options
 * @param {number} [options.count=10] - number of units
 * @param {boolean} [options.markMonomer=false] - mark the different units of the polymer in the atom map
 * @param {import('openchemlib').Molecule} [options.alpha] - alpha end group, default is an hydrogen
 * @param {import('openchemlib').Molecule} [options.gamma] - omega end group, default is an hydrogen
 */
export function createPolymer(unit, options = {}) {
  const { count = 10 } = options;
  checkEntity(unit, 'unit');
  const { Molecule } = unit.getOCL();
  const { alpha, gamma } = getAlphaGamma(unit, options);
  checkEntity(alpha, 'alpha');
  checkEntity(gamma, 'gamma');

  const { r1AtomicNo, r2AtomicNo } = getR1R2AtomicNo(Molecule);

  const polymer = alpha.getCompactCopy();
  polymer.addMolecule(getUnit(unit, 1, options));
  addBond(polymer, r1AtomicNo, r1AtomicNo);
  for (let i = 0; i < count - 1; i++) {
    polymer.addMolecule(getUnit(unit, i + 2, options));
    addBond(polymer, r2AtomicNo, r1AtomicNo);
  }
  polymer.addMolecule(gamma);

  addBond(polymer, r2AtomicNo, r2AtomicNo);

  polymer.ensureHelperArrays(Molecule.cHelperNeighbours);
  // encoding directly in atomNapNo didn't work out because it was removed when deleting atoms
  for (let i = 0; i < polymer.getAtoms(); i++) {
    polymer.setAtomMapNo(
      i,
      (polymer.getAtomCustomLabel(i) || '').replace(/monomer_/, ''),
    );
    polymer.setAtomCustomLabel(i, '');
  }

  return polymer;
}

function getUnit(unit, index, options) {
  const { markMonomer = false } = options;
  if (markMonomer) {
    unit = unit.getCompactCopy();
    unit.ensureHelperArrays(unit.getOCL().Molecule.cHelperNeighbours);
    for (let j = 0; j < unit.getAtoms(); j++) {
      unit.setAtomCustomLabel(j, `monomer_${index}`);
    }
  }
  return unit;
}

function addBond(molecule, firstAtomicNo, secondAtomicNo) {
  molecule.ensureHelperArrays(molecule.getOCL().Molecule.cHelperNeighbours);
  let i, j;
  loop: for (i = 0; i < molecule.getAtoms(); i++) {
    if (molecule.getAtomicNo(i) === firstAtomicNo) {
      for (j = i + 1; j < molecule.getAtoms(); j++) {
        if (molecule.getAtomicNo(j) === secondAtomicNo) {
          molecule.addBond(
            molecule.getConnAtom(i, 0),
            molecule.getConnAtom(j, 0),
            1,
          );
          break loop;
        }
      }
    }
  }
  molecule.deleteAtoms([i, j]);
}

function checkEntity(unit, kind) {
  let nbR1 = 1;
  let nbR2 = 1;
  switch (kind) {
    case 'unit':
      break;
    case 'alpha':
      nbR2 = 0;
      break;
    case 'gamma':
      nbR1 = 0;
      break;
    default:
      throw new Error('Unknown kind');
  }
  if (!unit) {
    throw new Error('unit is required');
  }
  const { Molecule } = unit.getOCL();

  // unit must contain ONE R1 and ONE R2
  const { r1AtomicNo, r2AtomicNo } = getR1R2AtomicNo(Molecule);
  let r1Count = 0;
  let r2Count = 0;
  for (let i = 0; i < unit.getAtoms(); i++) {
    if (unit.getAtomicNo(i) === r1AtomicNo) {
      r1Count++;
    }
    if (unit.getAtomicNo(i) === r2AtomicNo) {
      r2Count++;
    }
  }
  if (r1Count !== nbR1) {
    throw new Error(`${kind} must contain ${nbR1} R1`);
  }
  if (r2Count !== nbR2) {
    throw new Error(`${kind} must contain ${nbR2} R2`);
  }
}

function getAlphaGamma(unit, options) {
  let { alpha, gamma } = options;
  const { Molecule } = unit.getOCL();

  const { r1AtomicNo, r2AtomicNo } = getR1R2AtomicNo(Molecule);

  if (!alpha) {
    alpha = Molecule.fromSmiles('CC');
    alpha.setAtomicNo(0, r1AtomicNo);
    alpha.setAtomicNo(1, 1);
  }
  if (!gamma) {
    gamma = Molecule.fromSmiles('CC');
    gamma.setAtomicNo(0, r2AtomicNo);
    gamma.setAtomicNo(1, 1);
  }
  return { alpha, gamma };
}

function getR1R2AtomicNo(Molecule) {
  const r1AtomicNo = Molecule.getAtomicNoFromLabel(
    'R1',
    Molecule.cPseudoAtomsRGroups,
  );
  const r2AtomicNo = Molecule.getAtomicNoFromLabel(
    'R2',
    Molecule.cPseudoAtomsRGroups,
  );
  return { r1AtomicNo, r2AtomicNo };
}
