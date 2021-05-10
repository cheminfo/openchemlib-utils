import OCL from 'openchemlib';

import { MoleculesDB } from '../MoleculesDB';

describe('MoleculesDB', () => {
  describe('pushMoleculeInfo', () => {
    it('should add idCode molecule manually', async () => {
      let moleculesDB = new MoleculesDB(OCL);
      moleculesDB.pushMoleculeInfo({ idCode: 'gC`@Dij@@' });
      moleculesDB.pushMoleculeInfo({ idCode: 'gC`@Dij@@' });
      let db = moleculesDB.getDB();
      expect(db).toHaveLength(1);
    });

    it('should add smiles molecule manually', async () => {
      let moleculesDB = new MoleculesDB(OCL);
      moleculesDB.pushMoleculeInfo({ smiles: 'CCCC' });
      moleculesDB.pushMoleculeInfo({ smiles: 'CCCC' });
      moleculesDB.pushMoleculeInfo({ smiles: 'CCCCC' });
      let db = moleculesDB.getDB();
      expect(db).toHaveLength(2);
      expect(db.filter((entry) => entry.properties)).toHaveLength(2);
      let result = moleculesDB.search('CC', {
        format: 'smiles',
        mode: 'substructure',
        flattenResult: false,
        keepMolecule: false,
      });
      expect(result).toHaveLength(2);
      expect(result).toMatchSnapshot();
    });
  });
});
