// this page allows to debug the hints: https://my.cheminfo.org/?viewURL=https%3A%2F%2Fmyviews.cheminfo.org%2Fdb%2Fvisualizer%2Fentry%2F108024089da99d0cb70a57724486d0c6%2Fview.json

const defaultPossibleHints = [
  {
    idCode: 'gFp@DiTt@@B',
    message: 'Did you think about benzene derivatives?',
  },
  {
    idCode: 'gFx@@eJf`@@P',
    message: 'Did you think about pyridine derivatives?',
  },
  {
    idCode: 'eFHBLFLYpB@QVE_cD',
    message: 'An aromatic cycle can be an heterocycle.',
  },
  {
    idCode: 'eFHBJD',
    message: 'Adding a carbonyl could help.',
  },
  {
    idCode: 'gGP`@df]j`MekEZFBpp_zmPl',
    message: 'What about an ester?',
  },
  {
    idCode: 'gGY@DDf]j`MiXrppUaYl',
    message: 'There is an amide function in the molecule.',
  },
  {
    idCode: 'gCi@DDfZ@~btl',
    message: 'There is a primary amide in the molecule.',
  },
  {
    idCode: 'gC``@dfZ@~bl',
    message: 'You should think about carboxylic acids.',
  },
  {
    idCode: 'eF@Hp\\pcc',
    message: 'What about a non-aromatic ring?',
  },
  {
    idCode: 'eF@H`_qb@c',
    message: 'How to get such a high DBE?',
  },
  {
    idCode: 'eF@Hh\\q@',
    message: 'What about having an olefin?',
  },
  {
    idCode: 'gFp@DiTt@@CxbyZoV',
    anyMatches: ['daD@@DjWjXHB@CYL{qQZWUmX', 'gFp@DiTt@@CxbyYnv'],
    message: 'Disubstituted aromatic ring can be o, m or p.',
    remarks: 'ortho',
  },
  {
    idCode: 'daD@@DjWjXHB@CYL{qQZWUmX',
    anyMatches: ['gFp@DiTt@@CxbyZoV', 'gFp@DiTt@@CxbyYnv'],
    message: 'Disubstituted aromatic ring can be o, m or p.',
    remarks: 'meta',
  },
  {
    idCode: 'gFp@DiTt@@CxbyYnv',
    anyMatches: ['daD@@DjWjXHB@CYL{qQZWUmX', 'gFp@DiTt@@CxbyZoV'],
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

export function getHints(correct, answer, options = {}) {
  const hints = [
    ...checkMF(correct, answer),
    ...checkStereoAndTautomer(correct, answer),
  ];

  const { possibleHints = defaultPossibleHints } = options;
  const OCL = correct.getOCL();
  const searcherCorrect = new OCL.SSSearcher();
  searcherCorrect.setMolecule(correct);

  const searcherAnswer = new OCL.SSSearcher();
  searcherAnswer.setMolecule(answer);

  for (const possibleTip of possibleHints) {
    const { anyMatches } = possibleTip;
    if (anyMatches) {
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

    const fragment = OCL.Molecule.fromIDCode(possibleTip.idCode);
    searcherCorrect.setFragment(fragment);
    searcherAnswer.setFragment(fragment);
    if (
      searcherCorrect.isFragmentInMolecule() &&
      !searcherAnswer.isFragmentInMolecule()
    ) {
      hints.push(possibleTip);
    }
  }
  return hints;
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
