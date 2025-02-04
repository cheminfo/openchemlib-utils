/**
 * We have 2 molfiles and we would like to map the atom number from one to the other.
 * We expect that both molfiles contain the same atoms that can be in a different order.
 * @param {typeof import('openchemlib')} OCL - openchemlib library
 * @param {string} from
 * @param {string} to
 * @returns {{fromTo: number[], toFrom: number[]}} - fromTo is an array of the same length as the number of atoms in the from molfile. Each element is the index of the corresponding atom in the to molfile. toFrom is the opposite.
 */
export function getMolfilesMapping(OCL, from, to) {
  const { Molecule } = OCL;
  const fromF = from.replaceAll(' H ', ' X ');
  const toF = to.replaceAll(' H ', ' X ');
  // we may ignore mapping because we should not have hydrogens anymore
  const fromMoleculeF = Molecule.fromMolfile(fromF);
  const toMoleculeF = Molecule.fromMolfile(toF);
  if (fromMoleculeF.getIDCode() !== toMoleculeF.getIDCode()) {
    // only a problem of hydrogens ?
    const fromMolecule = Molecule.fromMolfile(from);
    const toMolecule = Molecule.fromMolfile(to);
    if (fromMolecule.getIDCode() === toMolecule.getIDCode()) {
      throw new Error('Molecules do not have the same explicit hydrogens');
    } else {
      throw new Error('Molecules are different');
    }
  }
  const fromFinalRanks = [...fromMoleculeF.getFinalRanks()];
  const toFinalRanks = [...toMoleculeF.getFinalRanks()];

  // need now to create the mapping
  const fromTo = [];
  const toFrom = [];
  for (let i = 0; i < fromFinalRanks.length; i++) {
    const fromRank = fromFinalRanks[i];
    const toRank = toFinalRanks.indexOf(fromRank);
    if (toRank === -1) {
      throw new Error('Rank not found. This should never happen.');
    }
    fromTo[i] = toRank;
    toFrom[toRank] = i;
  }

  return { fromTo, toFrom };
}
