let toxicityPredictor;
let druglikenessPredictor;

/**
 *
 * @param {import('openchemlib').Molecule} molecule
 * @param {object} [options={}]
 * @param {boolean} [options.includeToxicities=false]
 * @param {boolean} [options.includeDruglikeness=false]
 */
export function getProperties(molecule, options = {}) {
  const { includeToxicities = false, includeDruglikeness = false } = options;
  const OCL = molecule.getOCL();
  if (!OCL.MoleculeProperties) {
    throw new Error('OCL.MoleculeProperties is not defined');
  }
  const props = new OCL.MoleculeProperties(molecule);
  const moleculeFormula = molecule.getMolecularFormula();
  const result = {
    acceptorCount: props.acceptorCount,
    donorCount: props.donorCount,
    logP: props.logP,
    logS: props.logS,
    polarSurfaceArea: props.polarSurfaceArea,
    rotatableBondCount: props.rotatableBondCount,
    stereoCenterCount: props.stereoCenterCount,
    mw: moleculeFormula.relativeWeight,
    mf: moleculeFormula.formula,
  };

  if (includeToxicities) {
    const { ToxicityPredictor } = molecule.getOCL();
    if (!ToxicityPredictor) {
      throw new Error('OCL.ToxicityPredictor is not defined');
    }
    if (!toxicityPredictor) {
      toxicityPredictor = new ToxicityPredictor();
    }
    result.mutagenic = toxicityPredictor.assessRisk(
      molecule,
      ToxicityPredictor.TYPE_MUTAGENIC,
    );
    result.tumorigenic = toxicityPredictor.assessRisk(
      molecule,
      ToxicityPredictor.TYPE_TUMORIGENIC,
    );
    result.irritant = toxicityPredictor.assessRisk(
      molecule,
      ToxicityPredictor.TYPE_IRRITANT,
    );
    result.reproductiveEffective = toxicityPredictor.assessRisk(
      molecule,
      ToxicityPredictor.TYPE_REPRODUCTIVE_EFFECTIVE,
    );
  }

  if (includeDruglikeness) {
    const { DruglikenessPredictor } = molecule.getOCL();
    if (!DruglikenessPredictor) {
      throw new Error('OCL.DruglikenessPredictor is not defined');
    }
    if (!druglikenessPredictor) {
      druglikenessPredictor = new DruglikenessPredictor();
    }
    result.drugLikeness = druglikenessPredictor.assessDruglikeness(molecule);
  }

  if (result.drugLikeness !== undefined && result.mutagenic !== undefined) {
    result.drugScore = OCL.DrugScoreCalculator.calculate(
      result.logP,
      result.polarSurfaceArea,
      result.mw,
      result.drugLikeness,
      [
        result.mutagenic,
        result.tumurogenic,
        result.irritant,
        result.reproductiveEffective,
      ],
    );
  }

  return result;
}
