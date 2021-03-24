import { getDiastereotopicAtomIDs } from '../diastereotopic/getDiastereotopicAtomIDs';

/**
 * Returns various information about atoms in the molecule
 * @param {OCL.Molecule} [molecule]
 */
export function getAtomsInfo(molecule) {
  const OCL = molecule.getOCL();
  molecule.ensureHelperArrays(OCL.Molecule.cHelperRings);

  let diaIDs = getDiastereotopicAtomIDs(molecule);

  let results = [];
  for (let i = 0; i < diaIDs.length; i++) {
    let result = {
      oclID: diaIDs[i],
      extra: {
        singleBonds: 0,
        doubleBonds: 0,
        tripleBonds: 0,
        aromaticBonds: 0,
        cnoHybridation: 0, // should be 1 (sp), 2 (sp2) or 3 (sp3)
      },
    };
    let extra = result.extra;
    results.push(result);
    result.abnormalValence = molecule.getAtomAbnormalValence(i); // -1 is normal otherwise specified
    result.charge = molecule.getAtomCharge(i);
    result.cipParity = molecule.getAtomCIPParity(i);
    result.color = molecule.getAtomColor(i);
    result.customLabel = molecule.getAtomCustomLabel(i);
    //        result.esrGroup=molecule.getAtomESRGroup(i);
    //        result.esrType=molecule.getAtomESRType(i);
    result.atomicNo = molecule.getAtomicNo(i);
    result.label = molecule.getAtomLabel(i);
    //        result.list=molecule.getAtomList(i);
    //        result.listString=molecule.getAtomListString(i);
    //        result.mapNo=molecule.getAtomMapNo(i);
    result.mass = molecule.getAtomMass(i);
    //        result.parity=molecule.getAtomParity(i);
    //        result.pi=molecule.getAtomPi(i);
    //        result.preferredStereoBond=molecule.getAtomPreferredStereoBond(i);
    //        result.queryFeatures=molecule.getAtomQueryFeatures(i);
    result.radical = molecule.getAtomRadical(i);
    result.ringBondCount = molecule.getAtomRingBondCount(i);
    //        result.ringCount=molecule.getAtomRingCount(i);
    result.ringSize = molecule.getAtomRingSize(i);
    result.x = molecule.getAtomX(i);
    result.y = molecule.getAtomY(i);
    result.z = molecule.getAtomZ(i);
    result.allHydrogens = molecule.getAllHydrogens(i);
    result.connAtoms = molecule.getConnAtoms(i);
    result.allConnAtoms = molecule.getAllConnAtoms(i);

    result.implicitHydrogens =
      result.allHydrogens + result.connAtoms - result.allConnAtoms;

    result.isAromatic = molecule.isAromaticAtom(i);
    result.isAllylic = molecule.isAllylicAtom(i);
    result.isStereoCenter = molecule.isAtomStereoCenter(i);
    result.isRing = molecule.isRingAtom(i);
    result.isSmallRing = molecule.isSmallRingAtom(i);
    result.isStabilized = molecule.isStabilizedAtom(i);

    // todo HACK to circumvent bug in OCL that consider than an hydrogen is connected to itself
    result.extra.singleBonds =
      result.atomicNo === 1 ? 0 : result.implicitHydrogens;
    for (let j = 0; j < molecule.getAllConnAtoms(i); j++) {
      let bond = molecule.getConnBond(i, j);
      let bondOrder = molecule.getBondOrder(bond);
      if (molecule.isAromaticBond(bond)) {
        extra.aromaticBonds++;
      } else if (bondOrder === 1) {
        // not an hydrogen
        extra.singleBonds++;
      } else if (bondOrder === 2) {
        extra.doubleBonds++;
      } else if (bondOrder === 3) {
        extra.tripleBonds++;
      }
    }
    result.extra.totalBonds =
      result.extra.singleBonds +
      result.extra.doubleBonds +
      result.extra.tripleBonds +
      result.extra.aromaticBonds;

    if (result.atomicNo === 6) {
      result.extra.cnoHybridation = result.extra.totalBonds - 1;
    } else if (result.atomicNo === 7) {
      result.extra.cnoHybridation = result.extra.totalBonds;
    } else if (result.atomicNo === 8) {
      result.extra.cnoHybridation = result.extra.totalBonds + 1;
    } else if (result.atomicNo === 1) {
      let connectedAtom =
        molecule.getAllConnAtoms(i) === 0
          ? 0
          : molecule.getAtomicNo(molecule.getConnAtom(i, 0));
      result.extra.hydrogenOnAtomicNo = connectedAtom;
      if (connectedAtom === 7 || connectedAtom === 8) {
        result.extra.labileHydrogen = true;
      }
    }
  }
  return results;
}
