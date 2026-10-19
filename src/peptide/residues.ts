/**
 * The twenty common amino-acid residues, each as an openchemlib query fragment
 * whose atoms carry their IUPAC identifier as a custom label.
 *
 * A fragment is the residue core — backbone `N`, `Cα`, `C′`, `O` and the heavy
 * side chain — with open valences on `N` and `C′`, so it matches a residue
 * anywhere in a chain. Hydrogens are absent on purpose: openchemlib drops
 * explicit hydrogens from a query fragment, so they are named from the heavy
 * atom they hang on instead.
 *
 * Labels are stored with a leading `]`, which openchemlib renders as a
 * superscript and which also keeps a label such as `N` from being dropped —
 * openchemlib discards a custom label equal to the atom's own element symbol.
 *
 * Listed from the largest residue to the smallest, which is the order a match
 * must be attempted in so that tryptophan claims its atoms before glycine can.
 *
 * The fallback used for a modified residue is derived from these at run time —
 * see `getSkeleton` — rather than stored, so the two can never disagree.
 */
export interface LabelledResidue {
  /** Three-letter code of the residue. */
  code: string;
  /** The residue core, atom custom labels included. */
  idCode: string;
}

export const LABELLED_RESIDUES: LabelledResidue[] = [
  {
    code: 'Trp',
    idCode:
      'dg}H@LTDemfUqT{ZjP`HaHG}D`MwMw|SP\\@BFz@S@T[hBMpIn`DwBfz@s\\F{h@mpS@N{h@mpc@A{hBmpS@I{hBmps@E{hBmpc@M{hAmpS@C{hAmps@K{hCmpS@@',
  },
  {
    code: 'Tyr',
    idCode:
      'dcND@LCTeme^UZh@HaHG}D`MwMw|UP\\@BFz@S@T[hBMpIn`DwBfz@s\\F{h@mpS@N{h@mpc@A{hBmpS@I{hBmpc@E[hAmpun`Nw@',
  },
  {
    code: 'Arg',
    idCode:
      'dmTh@LzUAI[UYjjfaHG}D`MwMw|YP\\@BFz@S@T[hBMpIn`DwBfz@s\\F[h@mpyn`Jw@Vz@[\\I{hCmpc@E{hCmpS@@',
  },
  {
    code: 'Phe',
    idCode:
      'dmvH@LAI[YVUZh@BD`_tR@w\\w_qeAp@H[hALAQn`Hw@fz@S\\J[hCMp[n`BwAL@{n`BwBL@Gn`JwAL@gn`JwBL@Un`Fw@',
  },
  {
    code: 'His',
    idCode:
      'deWH@LZPRVvTYZjVhRAQHC]s]DTG@@an`DpEFz@c\\B[hAMpin`LwAnz@K\\HpCnz@K\\Dp@^z@k\\HpB^z@k\\Dp@',
  },
  {
    code: 'Gln',
    idCode:
      'diED@DXAR[VvjibdG}Damt]w|^P\\@@Nz@k\\HpBFz@K\\D{hBmpS@L[hCMpIn`DwBfz@c\\N[hALA@',
  },
  {
    code: 'Glu',
    idCode:
      'diFL@FAAR[VvjibdG}Damt]w|^P\\@@Nz@k\\HpBFz@K\\D{hBmpS@L[hCMpIn`DwBfz@c\\N[hALA@',
  },
  {
    code: 'Lys',
    idCode:
      'diEH@LDDemUjjhRAQHC]s]GdG@@an`DpEFz@c\\B[hAMpin`LwAfz@K\\N[hBmpEn`Fw@',
  },
  {
    code: 'Leu',
    idCode:
      'dazH@LAI[YjjaHG}D`MwMw|VP\\@BFz@S@T[hBMpIn`DwBfz@s\\F{h@mpS@N{h@mpc@@',
  },
  {
    code: 'Ile',
    idCode:
      'dazH@LAI[ejjQDRC~bPF{f{~KHN@AC]@I`JMtAFxDwPB[aW]@YnDX@w]@YnBXAw]@EnDX@',
  },
  {
    code: 'Met',
    idCode:
      'dazH`Jx@aJ]nji`dG}Dbmwmw|VP\\@@Fz@K\\H[hCMpQn`JwCFz@S\\B[hBMpYn`DpD',
  },
  {
    code: 'Asn',
    idCode:
      'dayD@DhNR[[ZjXIAQHk]{]EdG@@Cn`BwBL@an`LwANz@K\\DpCFz@S\\B[hBMpYn`DpD',
  },
  {
    code: 'Asp',
    idCode:
      'dazL@JANR[[ZjXIAQHk]{]EdG@@Cn`BwBL@an`LwANz@K\\DpCFz@S\\B[hBMpYn`DpD',
  },
  {
    code: 'Val',
    idCode: 'gNy@LDenZjb`hhF{mw|Z`x@D[hALAS]@QnA[hAMpo]@YnBX@~z@s\\Hp@',
  },
  {
    code: 'Pro',
    idCode: 'gOy@LDeekZjhhOzJAn{]FhN@AFz@S@TwPD[`Vz@S\\JwPA[`vz@s\\@',
  },
  {
    code: 'Thr',
    idCode: 'gNx`LJdmsURRJG}E@w]ncTG@@c]@I`J[hBMpK]@InE{hCMpc@GwPF[`f@@',
  },
  {
    code: 'Ser',
    idCode: 'gGX`LJdmmUEAQPMw[oxeAp@HwPBXBfz@c\\BwPB[aVz@s\\@',
  },
  {
    code: 'Cys',
    idCode: 'gGYHMPDIK]TqH_tT[]n{~IP\\@@MtAfxQn`DwAMtAFxEn`DpD',
  },
  {
    code: 'Ala',
    idCode: 'gJY@LDefjJC~b`[nw_qrC`@Qn`DpEMtAFxEn`Dw@',
  },
  {
    code: 'Gly',
    idCode: 'gCi@LDeZ@hhF{mw|T`x@D[hALAS]@Qn@',
  },
];
