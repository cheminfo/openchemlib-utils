import { makeRacemic } from '../util/makeRacemic';

export function getAtomFeatures(originalMolecule, options = {}) {
  const OCL = originalMolecule.getOCL();

  const { sphere = 1 } = options;
  const fragment = new OCL.Molecule(0, 0);
  const results = [];

  for (
    let rootAtom = 0;
    rootAtom < originalMolecule.getAllAtoms();
    rootAtom++
  ) {
    let min = 0;
    let max = 0;
    let atomMask = new Array(originalMolecule.getAtoms());
    let atomList = new Array(originalMolecule.getAtoms());

    const molecule = originalMolecule.getCompactCopy();
    for (let currentSphere = 0; currentSphere <= sphere; currentSphere++) {
      if (max === 0) {
        atomList[max] = rootAtom;
        atomMask[rootAtom] = true;
        max++;
      } else {
        let newMax = max;
        for (let i = min; i < max; i++) {
          let atom = atomList[i];
          for (let j = 0; j < molecule.getAllConnAtoms(atom); j++) {
            let connAtom = molecule.getConnAtom(atom, j);
            if (!atomMask[connAtom]) {
              atomMask[connAtom] = true;
              atomList[newMax++] = connAtom;
            }
          }
        }
        min = max;
        max = newMax;
      }
      molecule.copyMoleculeByAtoms(fragment, atomMask, true, null);
      if (currentSphere === sphere) {
        makeRacemic(fragment);
        results.push(fragment.getCanonizedIDCode());
      }
    }
  }

  const atoms = {};
  for (let result of results) {
    if (!atoms[result]) {
      atoms[result] = 1;
    } else {
      atoms[result]++;
    }
  }

  return atoms;
}
