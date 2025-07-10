import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { MoleculesDB } from '../MoleculesDB';

describe('MoleculesDB', () => {
  describe('pushMoleculeInfo', () => {
    it('should add idCode molecule manually', async () => {
      const moleculesDB = new MoleculesDB(OCL);
      moleculesDB.pushMoleculeInfo({ idCode: 'gC`@Dij@@' });
      moleculesDB.pushMoleculeInfo({ idCode: 'gC`@Dij@@' });
      const db = moleculesDB.getDB();

      expect(db).toHaveLength(1);
    });

    it('should add smiles molecule manually', async () => {
      const moleculesDB = new MoleculesDB(OCL);
      moleculesDB.pushMoleculeInfo({ smiles: 'CCCC' });
      moleculesDB.pushMoleculeInfo({ smiles: 'CCCC' });
      moleculesDB.pushMoleculeInfo({ smiles: 'CCCCC' });
      const db = moleculesDB.getDB();

      expect(db).toHaveLength(2);
      expect(db.filter((entry) => entry.properties)).toHaveLength(2);

      const result = moleculesDB.search('CC', {
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
