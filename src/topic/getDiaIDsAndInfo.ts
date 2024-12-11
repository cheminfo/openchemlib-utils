import type { TopicMolecule, DiaIDAndInfo } from './TopicMolecule.js';

export function getDiaIDsAndInfo(
  diaMol: TopicMolecule,
  canonizedDiaIDs: string[],
) {
  const newDiaIDs: DiaIDAndInfo[] = [];
  const molecule = diaMol.moleculeWithH;

  const counts: Record<string, number> = {};
  for (const diaID of canonizedDiaIDs) {
    if (!counts[diaID]) {
      counts[diaID] = 0;
    }
    counts[diaID]++;
  }

  for (let i = 0; i < canonizedDiaIDs.length; i++) {
    const diaID = canonizedDiaIDs[diaMol.finalRanks[i]];
    const newDiaID: DiaIDAndInfo = {
      idCode: diaID,
      attachedHydrogensIDCodes: [],
      attachedHydrogens: [],
      nbAttachedHydrogens: 0,
      atomLabel: molecule.getAtomLabel(i),
      nbEquivalentAtoms: counts[diaID],
      heavyAtom: undefined,
      atomMapNo: molecule.getAtomMapNo(i),
    };
    if (molecule.getAtomicNo(i) === 1) {
      const atom = molecule.getConnAtom(i, 0);
      newDiaID.heavyAtom = canonizedDiaIDs[diaMol.finalRanks[atom]];
    }
    for (let j = 0; j < molecule.getAllConnAtoms(i); j++) {
      const atom = molecule.getConnAtom(i, j);
      if (molecule.getAtomicNo(atom) === 1) {
        newDiaID.nbAttachedHydrogens++;
        newDiaID.attachedHydrogens.push(atom);
        const hydrogenDiaID = canonizedDiaIDs[diaMol.finalRanks[atom]];
        if (!newDiaID.attachedHydrogensIDCodes.includes(hydrogenDiaID)) {
          newDiaID.attachedHydrogensIDCodes.push(hydrogenDiaID);
        }
      }
    }
    newDiaIDs.push(newDiaID);
  }
  return newDiaIDs;
}
