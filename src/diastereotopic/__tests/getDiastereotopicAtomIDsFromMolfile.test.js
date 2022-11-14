import OCL from 'openchemlib';

import { getDiastereotopicAtomIDsFromMolfile } from '../getDiastereotopicAtomIDsFromMolfile';

test('getDiastereotopicAtomIDsFromMolfile', () => {
  const molfile = `$$ Empty String
  ACD/Labs09022211552D
  $$ Empty String
 19 20  0  0  0  0  0  0  0  0 20 V2000
    1.1284   -0.6416    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.1284   -1.9913    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.2790   -2.6772    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.4516   -1.9913    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.4516   -0.6416    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.2790    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.5800   -2.6772    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0
    5.7085   -1.9913    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.7085   -0.6416    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.5800    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.0000    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    6.8811   -2.6772    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.0317   -1.9913    0.0000 Si  0  0  0  0  0  0  0  0  0  0  0  0
    9.2043   -2.6772    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.0317   -0.6416    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    9.2043   -1.3275    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.8811    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   10.3328   -1.9913    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    9.2043   -3.9605    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  2  0  0  0  0
  1  6  1  0  0  0  0
  1 11  1  0  0  0  0
  2  3  1  0  0  0  0
  3  4  2  0  0  0  0
  4  5  1  0  0  0  0
  4  7  1  0  0  0  0
  5  6  2  0  0  0  0
  5 10  1  0  0  0  0
  7  8  2  0  0  0  0
  8  9  1  0  0  0  0
  8 12  1  0  0  0  0
  9 10  2  0  0  0  0
 12 13  1  0  0  0  0
 13 14  1  0  0  0  0
 13 15  1  0  0  0  0
 13 16  1  0  0  0  0
 14 19  1  0  0  0  0
 15 17  1  0  0  0  0
 16 18  1  0  0  0  0
M  END`;

  const result = getDiastereotopicAtomIDsFromMolfile(OCL, molfile);

  expect(result.diaIDs[10]).toMatchInlineSnapshot(`
    {
      "hydrogenOCLIDs": [
        "fle\`A@E@f\\NFQIRIIPiSIV]EMUUP@@@@@RB@QJh",
      ],
      "nbHydrogens": 3,
      "oclID": "fdy\`B@I@\\LddRRtJTrQkAcUUP@@@@@qBeA~dDhxUP",
    }
  `);
  expect(result.map[10]).toMatchInlineSnapshot(`
    {
      "destination": 18,
      "heavyAtom": "fdy\`B@I@\\LddRRTjTrQkAcUUP@@@@@qBMA~dDbxUP",
      "hydrogenOCLIDs": [],
      "nbHydrogens": 0,
      "oclID": "fle\`A@A@fSNBSJvnmJtYIT@@AUUP@@RB@QJh",
      "source": 10,
    }
  `);
});
