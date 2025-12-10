export default function getMoleculeCreators(OCL) {
  const fields = new Map([['oclid', OCL.Molecule.fromIDCode], ['idcode', OCL.Molecule.fromIDCode], ['smiles', OCL.Molecule.fromSmiles], ['molfile', OCL.Molecule.fromMolfile], ['smarts', (smarts) => {
    const smilesParser = new OCL.SmilesParser({ smartsMode: 'smarts' });
    return smilesParser.parseMolecule(smarts);
  }]]);


  return fields;
}
