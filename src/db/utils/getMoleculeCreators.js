export default function getMoleculeCreators(OCL) {
  const fields = new Map();

  fields.set('oclid', OCL.Molecule.fromIDCode);
  fields.set('idcode', OCL.Molecule.fromIDCode);
  fields.set('smiles', OCL.Molecule.fromSmiles);
  fields.set('molfile', OCL.Molecule.fromMolfile);
  fields.set('smarts', (smarts) => {
    const smilesParser = new OCL.SmilesParser({ smartsMode: 'smarts' });
    return smilesParser.parseMolecule(smarts);
  });

  return fields;
}
