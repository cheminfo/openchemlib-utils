import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Molecule } from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { getChiralOrHeterotopicCarbons } from '../getChiralOrHeterotopicCarbons';

describe('getChiralOrHeterotopicCarbons', () => {
  it('CCC', async () => {
    const molecule = Molecule.fromSmiles('CCC');
    const atoms = getChiralOrHeterotopicCarbons(molecule);

    expect(atoms).toStrictEqual([]);
  });

  it('CCO', async () => {
    const molecule = Molecule.fromSmiles('CCO');
    molecule.addImplicitHydrogens();
    const atoms = getChiralOrHeterotopicCarbons(molecule);

    expect(molecule.getConnAtoms(1)).toBe(2);
    expect(atoms).toStrictEqual([1]);
  });

  it('[H]CCO', async () => {
    const molecule = Molecule.fromSmiles('[H]CCO');
    molecule.addImplicitHydrogens();
    molecule.ensureHelperArrays(Molecule.cHelperNeighbours);

    const atoms = getChiralOrHeterotopicCarbons(molecule);

    expect(molecule.getConnAtoms(2)).toBe(2);
    expect(atoms).toStrictEqual([2]);
  });

  it('C1CC1', async () => {
    const molecule = Molecule.fromSmiles('C1CC1');
    molecule.addImplicitHydrogens();
    const atoms = getChiralOrHeterotopicCarbons(molecule);

    expect(atoms).toStrictEqual([]);
  });

  it('CC1CC1', async () => {
    const molecule = Molecule.fromSmiles('CC1CC1');
    const atoms = getChiralOrHeterotopicCarbons(molecule);

    expect(atoms).toStrictEqual([1, 2, 3]);
  });

  it('FC(C(C)C)Cl', async () => {
    const molecule = Molecule.fromSmiles('FC(C(C)C)Cl');
    const atoms = getChiralOrHeterotopicCarbons(molecule);

    expect(atoms).toStrictEqual([1, 2]);
  });

  it('FC(C(C)C)Cl - 2', async () => {
    const molecule = Molecule.fromSmiles('FC(CC(C)C)Cl');
    const atoms = getChiralOrHeterotopicCarbons(molecule);

    expect(atoms).toStrictEqual([1, 2, 3]);
  });

  it('cyclosporin', () => {
    const molfile = readFileSync(
      join(import.meta.dirname, '/data/cyclosporin.mol'),
      'utf8',
    );
    const molecule = Molecule.fromMolfile(molfile);
    const atoms = getChiralOrHeterotopicCarbons(molecule);

    expect(atoms).toHaveLength(25);
  });
});
