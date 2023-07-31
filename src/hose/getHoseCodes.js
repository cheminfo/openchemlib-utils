import { ensureHeterotopicChiralBonds } from '../diastereotopic/ensureHeterotopicChiralBonds.js';
import { makeRacemic } from '../util/makeRacemic.js';
import { tagAtom } from '../util/tagAtom.js';

/**
 * Returns the hose codes for all atoms in the molecule
 * @param {*} molecule
 * @param {object} [options={}]
 * @param {string[]} [options.atomLabels]
 * @param {number} [options.minSphereSize=0]
 * @param {number} [options.maxSphereSize=4]
 * @returns
 */
export function getHoseCodes(molecule, options = {}) {
  const { atomLabels } = options;
  const { Molecule } = molecule.getOCL();

  const atomicNumbers = atomLabels?.map((label) =>
    Molecule.getAtomicNoFromLabel(label),
  );

  const internalMolecule = molecule.getCompactCopy();
  internalMolecule.addImplicitHydrogens();
  ensureHeterotopicChiralBonds(internalMolecule);
  internalMolecule.ensureHelperArrays(
    Molecule.cHelperSymmetryStereoHeterotopicity,
  );

  const results = [];

  for (let i = 0; i < internalMolecule.getAllAtoms(); i++) {
    if (
      atomicNumbers &&
      !atomicNumbers.includes(internalMolecule.getAtomicNo(i))
    ) {
      results.push(undefined);
    } else {
      results.push(getHoseCodesForAtom(internalMolecule, i, options));
    }
  }

  return results;
}

function getHoseCodesForAtom(molecule, rootAtom, options = {}) {
  const { minSphereSize = 0, maxSphereSize = 4 } = options;
  const { Molecule } = molecule.getOCL();

  let results = [];
  let min = 0;
  let max = 0;
  let atomMask = new Array(molecule.getAllAtoms());
  let atomList = new Array(molecule.getAllAtoms());

  for (let sphere = 0; sphere <= maxSphereSize; sphere++) {
    let fragment = new Molecule(0, 0);
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
    const atomMap = [];
    molecule.copyMoleculeByAtoms(fragment, atomMask, false, atomMap);
    tagAtom(fragment, atomMap[rootAtom]);
    if (sphere >= minSphereSize) {
      makeRacemic(fragment);
      results.push(
        fragment.getCanonizedIDCode(
          Molecule.CANONIZER_ENCODE_ATOM_CUSTOM_LABELS,
        ),
      );
    }
  }
  return results;
}
