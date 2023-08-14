import { AdvancedMolecule, DiaIDAndH } from './AdvancedMolecule.js';

export function getDiaIDsAndH(diaMol: AdvancedMolecule) {
  const canonizedDiaIDs = diaMol.canonizedDiaIDs;
  const newDiaIDs: DiaIDAndH[] = [];
  const molecule = diaMol.moleculeWithH;
  for (let i = 0; i < canonizedDiaIDs.length; i++) {
    const diaID = canonizedDiaIDs[diaMol.finalRanks[i]];
    const newDiaID: DiaIDAndH = {
      oclID: diaID,
      hydrogens: [],
      heavyAtom: undefined,
    };
    if (molecule.getAtomicNo(i) === 1) {
      const atom = molecule.getConnAtom(i, 0);
      newDiaID.heavyAtom = canonizedDiaIDs[diaMol.finalRanks[atom]];
    }
    for (let j = 0; j < molecule.getAllConnAtoms(i); j++) {
      const atom = molecule.getConnAtom(i, j);
      if (molecule.getAtomicNo(atom) === 1) {
        const hydrogenDiaID = canonizedDiaIDs[diaMol.finalRanks[atom]];
        if (!newDiaID.hydrogens.includes(hydrogenDiaID)) {
          newDiaID.hydrogens.push(hydrogenDiaID);
        }
      }
    }
    newDiaIDs.push(newDiaID);
  }
  return newDiaIDs;
}
