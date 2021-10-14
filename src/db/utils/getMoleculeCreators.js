export default function getMoleculeCreators(Molecule) {
  const fields = new Map();

  fields.set('oclid', Molecule.fromIDCode);
  fields.set('idcode', Molecule.fromIDCode);
  fields.set('smiles', Molecule.fromSmiles);
  fields.set('molfile', Molecule.fromMolfile);

  return fields;
}
