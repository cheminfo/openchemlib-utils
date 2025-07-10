import OCL from 'openchemlib';
import { describe, expect, it } from 'vitest';

import { getHoseCodesFromDiastereotopicID } from '../getHoseCodesFromDiastereotopicID';

describe('getHoseCodesFromDiastereotopicID', () => {
  it('CC(Cl)CC', () => {
    const molecule = OCL.Molecule.fromIDCode('gJPHADILuTe@X`hOtbCpfuP');
    let hoses = getHoseCodesFromDiastereotopicID(molecule);
    hoses = hoses.map((hose) => escape(hose));

    expect(hoses).toMatchInlineSnapshot(`
      [
        "fHdPAqTGzT%5EDvj@",
        "eFBBHcAqEAjguW%7EdaxSZh",
        "gC%60HADIMUHaqAPZtTy%7DiZw%5D%7EdP%5EDvj@",
        "gJPHADILuTe@x%60hMFJ%5Ce%7CYZw%5C%5E%7FRHOB%5BU@",
        "gJPHADILuTe@x%60hMFJ%5Ce%7CYZw%5C%5E%7FRHOB%5BU@",
      ]
    `);
  });

  it('CC(Cl)CC maxSphere:2', () => {
    const molecule = OCL.Molecule.fromIDCode('gJPHADILuTe@X`hOtbCpfuP');
    let hoses = getHoseCodesFromDiastereotopicID(molecule, {
      maxSphereSize: 2,
    });
    hoses = hoses.map((hose) => escape(hose));

    expect(hoses).toMatchInlineSnapshot(`
      [
        "fHdPAqTGzT%5EDvj@",
        "eFBBHcAqEAjguW%7EdaxSZh",
        "gC%60HADIMUHaqAPZtTy%7DiZw%5D%7EdP%5EDvj@",
      ]
    `);
  });
});
