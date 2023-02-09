export function groupDiastereotopicAtomIDs(diaIDs, molecule, options = {}) {
  const { atomLabel } = options;
  const diaIDsObject = {};
  for (let i = 0; i < diaIDs.length; i++) {
    if (!atomLabel || molecule.getAtomLabel(i) === atomLabel) {
      let diaID = diaIDs[i];
      if (!diaIDsObject[diaID]) {
        diaIDsObject[diaID] = {
          counter: 0,
          atoms: [],
          oclID: diaID,
          atomLabel: molecule.getAtomLabel(i),
        };
      }
      diaIDsObject[diaID].counter++;
      diaIDsObject[diaID].atoms.push(i);
    }
  }

  return Object.keys(diaIDsObject).map((key) => diaIDsObject[key]);
}
