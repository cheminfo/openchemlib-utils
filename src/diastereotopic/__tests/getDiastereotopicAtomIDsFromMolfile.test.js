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

test.only('getDiastereotopicAtomIDsFromMolfile with H', () => {
  const molfile = `Empty String
  ACD/Labs09022211502D
  $$ Empty String
 21 23  0  0  0  0  0  0  0  0 22 V2000
    1.1400   -1.1882    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.3282   -1.8626    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.3282   -3.1793    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.1400   -3.8536    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -3.1793    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -1.8626    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.4843   -1.1882    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.6244   -1.8626    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.8447   -1.3167    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.7118   -2.2961    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    6.0695   -3.4362    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    4.7528   -3.1793    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.1016    0.0000    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
    6.6154   -4.6565    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.9321   -4.6565    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    8.6065   -5.8126    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    7.9321   -6.9526    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    6.6154   -6.9526    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    5.9410   -5.8126    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.7734   -4.0784    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
    3.5164   -2.6975    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0
  1  2  1  0  0  0  0
  1  6  2  0  0  0  0
  2  3  2  0  0  0  0
  2  7  1  0  0  0  0
  3  4  1  0  0  0  0
  4  5  2  0  0  0  0
  5  6  1  0  0  0  0
  7  8  2  0  0  0  0
  8  9  1  0  0  0  0
  8 12  1  0  0  0  0
  9 10  1  0  0  0  0
  9 13  2  0  0  0  0
 10 11  1  0  0  0  0
 11 12  1  0  0  0  0
 11 14  1  0  0  0  0
 12 21  1  0  0  0  0
 12 20  1  0  0  0  0
 14 15  1  0  0  0  0
 14 19  2  0  0  0  0
 15 16  2  0  0  0  0
 16 17  1  0  0  0  0
 17 18  2  0  0  0  0
 18 19  1  0  0  0  0
M  END`;

  const result = getDiastereotopicAtomIDsFromMolfile(OCL, molfile);

  expect(result.diaIDs[20]).toMatchInlineSnapshot(`
    {
      "heavyAtom": "flu@\`@@HRYYvYU\\eGQBejf\`@@BBAJHTfHThOt\`eGBj@",
      "hydrogenOCLIDs": [],
      "nbHydrogens": 0,
      "oclID": "fbm@b@FBALiLsKwJkdYyL\\uSS@@@DBHDXh\`Q_iA@HeT",
    }
  `);
});
