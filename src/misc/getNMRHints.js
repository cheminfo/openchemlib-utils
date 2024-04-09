// this page allows to debug the hints: https://my.cheminfo.org/?viewURL=https%3A%2F%2Fmyviews.cheminfo.org%2Fdb%2Fvisualizer%2Fentry%2F108024089da99d0cb70a57724486d0c6%2Fview.json

const defaultPossibleHints = [
  {
    idCode: 'eF@Hp\\pcc',
    message: 'What about a non-aromatic ring?',
  },
  {
    idCode: 'eF@H`_qb@c',
    message: 'How to get such a high DBE?',
  },
  {
    idCode: 'gFp@DiTt@@B',
    message: 'Did you think about benzene derivatives?',
  },
  {
    idCode: 'eFHBLFLYpB@QVE_cD',
    message: 'An aromatic cycle can be an heterocycle.',
  },
  {
    idCode: 'gFx@@eJf`@@P',
    message: 'Did you think about pyridine derivatives?',
  },
  {
    idCode: 'eFHBJD',
    message: 'Adding a carbonyl could help.',
  },
  {
    idCode: 'eMHAIhMi}EqfFBmN?vP',
    message: 'You should consider an alcohol.',
  },
  {
    idCode: 'gJQ@@eKU@[KFJtLAa`sAUR]g_zlP',
    message: 'You should consider an ether.',
  },
  {
    idCode: 'gJQ@@eKU@[KFJtLAa`r`q?EAcuX`',
    anyMatches: ['gJQ@@eKU@[KFJtLAa`?uX`'],
    message: 'An ether can be in a cycle.',
  },
  {
    idCode: 'eM`AIhLHmLYa`kSo}d',
    message: 'You should consider an amine.',
    remarks: 'primary',
  },
  {
    idCode: 'gJX@@eKU@XPVVLUhXCCAUIv]?jq@',
    message: 'You should consider an amine.',
    remarks: 'secondary',
  },
  {
    idCode: 'gNx@@eRmUPFDElZxxppVFAppUv\\WUw~xu`',
    message: 'You should consider an amine.',
    remarks: 'tertiary',
  },
  {
    idCode: 'gJX@@eKU@XPVVLUhXCCAeAcUIv]~JCGjq@',
    anyMatches: ['gJX@@eKU@XPVVLUhXCCAfBjd{N?uX`'],
    message: 'An amine can be in a cycle.',
    remarks: 'secondary cyclic amine',
  },
  {
    idCode: 'gNx@@eRmUPFDElZxxppVFAppYPXuv\\WUwxhL^xu`',
    anyMatches: ['gNx@@eRmUPFDElZxxppVFAppY`j{NKj{?\\Zp'],
    message: 'An amine can be in a cycle.',
    remarks: 'tertiary cyclic amine',
  },
  {
    idCode: 'gGP`@df]j`MekEZFBppUa]?ju@',
    message: 'What about an ester?',
  },
  {
    idCode: 'gGP`@df]j`MekEZFBppYdZpn?FQzmP',
    anyMatches: ['gGP`@df]j`MekEZFBppUa]?ju@'],
    message: 'An ester can be in a cycle.',
  },
  {
    idCode: 'gGY@DDf]j`MekEZFBppUa]?ju@',
    message: 'There is an amide function in the molecule.',
  },
  {
    idCode: 'gGY@DDf]j`MekEZFBppYdZpn?FQzmP',
    anyMatches: ['gGY@DDf]j`MekEZFBppUa]?ju@@'],
    message: 'An amide can be in a cycle.',
  },
  {
    idCode: 'gCi@DDfZ@~btl',
    message: 'There is a primary amide in the molecule.',
  },
  {
    idCode: 'gC``@dfZ@~bl',
    message:
      'You should think about carboxylic acids. The OH signal may be very wide.',
  },
  {
    idCode: 'eF@Hh\\q@',
    message: 'What about having an olefin?',
  },
  {
    idCode: 'gFp@DiTt@@CqC^LmV[m`',
    anyMatches: ['gFp@DiTt@@CBqXwd@'],
    message: 'Did you think about disubstituted aromatic rings?',
    remarks: 'meta',
  },
  {
    idCode: 'gFp@DiTt@@CqB~LmWkM`',
    anyMatches: ['gFp@DiTt@@CBqXwd@'],
    message: 'Did you think about disubstituted aromatic rings?',
    remarks: 'para',
  },
  {
    idCode: 'gFp@DiTt@@CqB^JoV[m',
    anyMatches: ['gFp@DiTt@@CBqXwd@'],
    message: 'Did you think about disubstituted aromatic rings?',
    remarks: 'ortho',
  },
  {
    idCode: 'gFp@DiTt@@CqB^JoV[m',
    anyMatches: ['gFp@DiTt@@CqC^LmV[m`', 'gFp@DiTt@@CqB~LmWkM`'],
    message: 'Disubstituted aromatic ring can be o, m or p.',
    remarks: 'ortho',
  },
  {
    idCode: 'gFp@DiTt@@CqC^LmV[m`',
    anyMatches: ['gFp@DiTt@@CqB^JoV[m', 'gFp@DiTt@@CqB~LmWkM`'],
    message: 'Disubstituted aromatic ring can be o, m ocr p.',
    remarks: 'meta',
  },
  {
    idCode: 'gFp@DiTt@@CqB~LmWkM`',
    anyMatches: ['gFp@DiTt@@CqC^LmV[m`', 'gFp@DiTt@@CqB^JoV[m'],
    message: 'Disubstituted aromatic ring can be o, m or p.',
    remarks: 'para',
  },
  {
    idCode: 'gGP`@df]j`H',
    anyMatches: ['gGP`@dfUj`H'],
    message: 'You should check the orientation of the ester.',
  },
  {
    idCode: 'gOq@@drm\\@@Aa@',
    message: 'Alcohols on aromatic ring may have surprising chemical shifts.',
  },
  {
    idCode: 'gOx@@drm\\@@A}A@',
    message: 'NH on aromatic ring may have surprising chemical shifts.',
  },
  {
    idCode: 'eFHBJGuP',
    message: 'Hydrogens on a carbonyl have very high chemical shifts.',
  },
];

/**
 *
 * @param {import('openchemlib').Molecule} correct
 * @param {import('openchemlib').Molecule} proposed
 * @param {Record<string,any>} [options ={}]
 * @param {Array} [options.possibleHints=defaultPossibleHints]
 * @returns
 */
export function getNMRHints(correct, proposed, options = {}) {
  const hints = [
    ...checkMF(correct, proposed),
    ...checkStereoAndTautomer(correct, proposed),
  ];

  const { possibleHints = defaultPossibleHints } = options;
  const OCL = correct.getOCL();
  const searcherCorrect = new OCL.SSSearcher();
  searcherCorrect.setMolecule(correct);

  const searcherAnswer = new OCL.SSSearcher();
  searcherAnswer.setMolecule(proposed);

  for (const possibleHint of possibleHints) {
    const { anyMatches } = possibleHint;
    if (anyMatches) {
      // we filter the molecules so they match at least one of the anyMatches
      let match = false;
      for (const anyMatch of anyMatches) {
        const matchFragment = OCL.Molecule.fromIDCode(anyMatch);
        searcherAnswer.setFragment(matchFragment);
        if (searcherAnswer.isFragmentInMolecule()) {
          match = true;
          break;
        }
      }
      if (!match) continue;
    }

    const fragment = OCL.Molecule.fromIDCode(possibleHint.idCode);
    searcherCorrect.setFragment(fragment);
    searcherAnswer.setFragment(fragment);
    if (
      searcherCorrect.isFragmentInMolecule() &&
      !searcherAnswer.isFragmentInMolecule()
    ) {
      hints.push(possibleHint);
    }
  }

  return hints.map((hint) => ({
    ...hint,
    hash: getHash(JSON.stringify(hint)),
  }));
}

function checkMF(correct, answer) {
  const mfCorrect = correct.getMolecularFormula().formula;
  const mfAnswer = answer.getMolecularFormula().formula;
  if (mfCorrect === mfAnswer) return [];
  return [
    {
      message: 'You should check the molecular formula.',
    },
  ];
}

function checkStereoAndTautomer(correct, answer) {
  if (correct.getIDCode() === answer.getIDCode()) return [];
  if (getNoStereoIDCode(correct) === getNoStereoIDCode(answer)) {
    return [
      {
        message: 'There is only a problem with stereochemistry.',
      },
    ];
  }
  if (getTautomerIDCode(correct) === getTautomerIDCode(answer)) {
    return [
      {
        message: "Weird, you didn't draw the expected tautomer.",
      },
    ];
  }
  return [];
}

function getTautomerIDCode(molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(molecule, OCL.CanonizerUtil.TAUTOMER);
}

function getNoStereoIDCode(molecule) {
  const OCL = molecule.getOCL();
  return OCL.CanonizerUtil.getIDCode(molecule, OCL.CanonizerUtil.NOSTEREO);
}

/*
    https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
    cyrb53a (c) 2023 bryc (github.com/bryc)
    License: Public domain. Attribution appreciated.
    The original cyrb53 has a slight mixing bias in the low bits of h1.
    This shouldn't be a huge problem, but I want to try to improve it.
    This new version should have improved avalanche behavior, but
    it is not quite final, I may still find improvements.
    So don't expect it to always produce the same output.
*/
function getHash(str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x85ebca77);
    h2 = Math.imul(h2 ^ ch, 0xc2b2ae3d);
  }
  h1 ^= Math.imul(h1 ^ (h2 >>> 15), 0x735a2d97);
  h2 ^= Math.imul(h2 ^ (h1 >>> 15), 0xcaf649a9);
  h1 ^= h2 >>> 16;
  h2 ^= h1 >>> 16;
  return 2097152 * (h2 >>> 0) + (h1 >>> 11);
}
