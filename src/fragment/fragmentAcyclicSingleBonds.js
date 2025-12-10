import { getMF } from '../util/getMF.js';
import { getRAtomicNumber } from '../util/getRAtomicNumber.js';

export function fragmentAcyclicSingleBonds(molecule) {
  const OCL = molecule.getOCL();
  const atoms = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    const atom = {};
    atoms.push(atom);
    atom.i = i;
    atom.links = []; // we will store connected atoms of broken bonds
  }

  const bonds = [];
  for (let i = 0; i < molecule.getAllBonds(); i++) {
    const bond = {};
    bonds.push(bond);
    bond.i = i;
    bond.order = molecule.getBondOrder(i);
    bond.atom1 = molecule.getBondAtom(0, i);
    bond.atom2 = molecule.getBondAtom(1, i);
    bond.type = molecule.getBondType(i);
    bond.isAromatic = molecule.isAromaticBond(i);
    bond.isRingBond = molecule.isRingBond(i);
    if (!bond.isAromatic && (bond.type & 0b11) === 1 && !bond.isRingBond) {
      bond.selected = true;
      atoms[bond.atom1].links.push(bond.atom2);
      atoms[bond.atom2].links.push(bond.atom1);
    }
  }

  const brokenMolecule = molecule.getCompactCopy();
  for (const bond of bonds) {
    if (bond.selected) {
      brokenMolecule.markBondForDeletion(bond.i);
    }
  }

  brokenMolecule.deleteMarkedAtomsAndBonds();
  const fragmentMap = [];
  const nbFragments = brokenMolecule.getFragmentNumbers(fragmentMap);
  const results = [];
  for (let i = 0; i < nbFragments; i++) {
    const result = { atomMap: [] };
    const includeAtom = fragmentMap.map((id) => {
      return id === i;
    });
    const fragment = new OCL.Molecule(0, 0);
    const atomMap = [];
    brokenMolecule.copyMoleculeByAtoms(fragment, includeAtom, false, atomMap);
    // we will add some R groups at the level of the broken bonds
    for (let j = 0; j < atomMap.length; j++) {
      if (atomMap[j] > -1) {
        result.atomMap.push(j);
        if (atoms[j].links.length > 0) {
          for (let k = 0; k < atoms[j].links.length; k++) {
            fragment.addBond(
              atomMap[j],
              fragment.addAtom(getRAtomicNumber(brokenMolecule)),
              1,
            );
          }
        }
      }
    }
    fragment.setFragment(false);
    result.idCode = fragment.getIDCode();
    result.mf = getMF(fragment).mf.replace(/R[1-9]?/, '');
    results.push(result);
  }

  return results;
}
