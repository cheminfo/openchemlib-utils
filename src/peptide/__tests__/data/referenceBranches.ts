/**
 * Diastereotopic branch assignments read off experimental structures.
 *
 * The two methyls of valine and of leucine are diastereotopic, so which one is
 * `γ1`/`δ1` is a fact about the structure, not a choice. These 73 residues come
 * from seven Protein Data Bank entries — 3NIR (crambin, 0.48 Å, hydrogens
 * included), 1UBQ, 5PTI, 2LZM, 1CRN, 7RSA and 4LZT — fetched from
 * pdb.cheminfo.org, whose atom names follow the IUPAC convention.
 *
 * `branchOne` is the atom the IUPAC rule numbers `1`, computed from the
 * measured coordinates: sighting down the bond from the main chain, `Hβ`, `Z1`
 * and `Z2` run clockwise. All 73 agree with the name the entry itself gives the
 * atom (`CG1`, `CD1`), and on the 18 residues that carry explicit hydrogens the
 * hydrogen-free form of the test agrees with the hydrogen-based one.
 */
export interface ReferenceBranch {
  /** Entry and residue the row was read from. */
  source: string;
  code: string;
  idCode: string;
  coordinates: string;
  /** The prochiral centre: `Cβ` for valine, `Cγ` for leucine. */
  centre: number;
  /** The neighbour of `centre` that leads back to the main chain. */
  main: number;
  /** The branch IUPAC numbers `1`. */
  branchOne: number;
  /** The branch IUPAC numbers `2`. */
  branchTwo: number;
}

export const REFERENCE_BRANCHES: ReferenceBranch[] = [
  {
    source: '3nir:A8VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!q|u_Zkfl|gBl@@NEvulorpPQ`k@mCNk}?UROHw?a]zbROoJ]gaUiv@JP@s@D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '3nir:A15VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates: String.raw`!qKM]gpQXFaXLZ\@aJI~O\vY?HbGNEHmnGwSqngmt_dJT@@LEj?ek@@YP@A@D`,
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '3nir:A18LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qi{\\sZZXmc[|rhig|tw^f^z^n?qT@@MHscWmgqLtl?eTA|Aa{sXJYX`B@[Ui|@YP@K@D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '3nir:A25LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qQxQQP\\~BJdqbSyuAvFZSeRx`|}A@]jYSj]IE{rRM@@Be]cpMPwNu`vm{GUkd@Hd@V@D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1UBQ:A5VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qnbrw[_irMKy??~~EWdZG`XX_}B|N{\\Zf{JdVglD@OoyQ_vGerUi|`BFAhPD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '1UBQ:A8LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qZiU|z?QU]aisSuSjacTwnwvcAegAF\\W@XxI}Q|VRBUFEo`@@~TBh@^nyCUj|`HnARpD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1UBQ:A15LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qMg^}dTbnA]vdYBkd\\~p[bEF~xZyykP@@Bh_`ZQgDc]\\GeEuALXIQ?mu@_eiB`KrAO@D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1UBQ:A17VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qiZMefYhLO^m^yO?rexFaZNichWk?a`@@qlolcMBBU|CYBjD~fUiL`K|As@D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '1UBQ:A26VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qJEk@jsJrVDrojpd}eQW_syTVaXBbSd]zo_h@@D^AVDsmx~`sOeh^`JRA\\PD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '1UBQ:A43LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qRRfdeOFC_?~Xef|UNllBLPjXTtWXR|}giH}@ehjcLsdPm{tsAK[e|K`sUUkD`@rAqpD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1UBQ:A50LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qGXs`gTSex]`Z@fImcp[av@Z\\UTg^zl?_F`Rm[BTmindNug??x]BBGSVnjUkl`NBA]pD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1UBQ:A56LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates: String.raw`!qMcomCVTu_?|j@aWV?[oOQsCFVgVr[JroKw|DwAz^~]fVw@J?i]ynzHXx]Ui_@H\ABPD`,
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1UBQ:A67LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qHrjBBuSlycHH{?tCPgkbfg??VK]F~qrA^GxMExU{y^_Qa~ufbhA|?_tASUjX`IZAaPD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1UBQ:A69LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qGM{kc~Dv~iY[By^WwsAcIoV]Bj]Ucc|G_??gTVzRmtdL_qnJJ]l|IdhgAujB`DFAJpD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1UBQ:A70VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!q@FZsRDWnz@AmZfoyb@ZLtqYWujPWBZ]XqoeLWAAp@@BNynYeZUiZ`EZAKpD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '1UBQ:A71LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qKkVxD??}{~xkkg??eyAJaaZEttnMQMBMajO_c^?GaHp^LwNcN|wJa@actuhV`DFArHD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1UBQ:A73LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qvxLb`RfK`[j]|fqOq\\C{D[aqJtWjXISiM\\Tb^huozuriW^s[LDx@@JoQ}UiY`FzAPhD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '5PTI:A6LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qVpVwZ@rfxDYbYKwGqQerDBQJ@oNjnVZwF}yGeMyw{[L[]_~g@@AZKoxuYUjJ`@pAR`@',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '5PTI:A29LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!q{bKqAJlQnHpNylZomquzHuqgNxAtDvxFXIc?pVH{m[B}D?hFwEH@@JTy~Uiw@LXA@`@',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '5PTI:A34VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qNdJakD]Z@@BJPTZaKSiI`P[on@iGy|DbkTUfKjs`YL@OwnLQtujx`NPA\\`D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A7LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qt@xdMwG^fr`qo_wm@Ge??pxeHtb[KgqTFfCh?f`CL_`KAXUD}fZaD@xcEUhc`IXAw`D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A13LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qlOaGb[xfl~JjMvve\\]GJXPw_^IwKIt~b{BE_C`@@XqA]{fjJ]nukizaRBUkPPBTAKPD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A15LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qOXWCTUUGHygRKvsu]RfuhXMo}wmSoRBBlKE??t]ix_nfuVRlWNcSPrjzPUko`@lA?pD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A32LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qHXomxcumVBtl]Ry_lnUh_zlnaz`XOj|[[QJz`CD~B@m[EOgc@@BKomaMkUjN`DlATpD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A33LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qFv]oOiu}Wg^kQ~SVbOUpKYc_{H~X@koLcR]Hauejmg?}KOiVpoJdgP@@weif`F|ANpD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A39LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qXeYLeJ^]ZXwj]m|_zarXuArmwV|VhoyNTK\\@DpiaJpm`ZkCDuYY??smvqejU`GrA`HD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A46LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qxPErz@WY|ZDEjg??DzPSEJmY`}}}bl{YhmouNwjFke[QU{SsSI}l\\m?YdUkI`NlAmHD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A57VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qgrUWPR`GTeWqrMAmktrUQGYfBS~UijLFjqDQG`@@S_NmayEygyiw`ElAKHD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A66LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qT@_\\_hFrvoFV`bI`voMap?}lo{T@@GWI{czCeM{hLDtIDFme@XB\\MoPZluha`LxAapD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A71VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qzLm{adFL_?~^gE?EHhgZZIBddZ|Qv~zahLZbSqKK~i|gHnRmjUhj`OpA]PD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A75VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qV}MYaiF\\_?|to`eyLNwIjGaFFOtEQwbR]Qs@]{YiME}rhR{MyUjX`MPAJPD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A79LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!q[Sm?_NxN_??w[ZzEzgmu^C_yvPv~YzoxDi~U?__u@Ev}fq`xyGimxyz_^ek[@HPAlPD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A84LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qoGpj`nNrb_xl`Mgi\\kBst`wA@mml@aHlsoD@@IXyOGv|_DmxdRuLmfSoXuio@IPA``D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A87VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qbvKj]Bgra[atgMEcqxcDGfb\\eyT@@GpECl?oHZesBfbccGKMOUhp`L@Aa@D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A91LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qAcgrffV{DErYQCampACOohIFTvuElN|ZN~jGJLgCw@wsbJvbIRTwxW??xMjt`KP@M@D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A94VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!q?PY]C}GuNpm??t}j{tRJC~KZhw\\LyPDwrWlyp@ReXLnA[wGBRUk^`H@A}@D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A99LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qS`UDywWijHyZcW??@V^rTwtyhqCKlpRQk\\Ch@nENFuYcyJdWarcCFsRNaujR`OHAT`D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A103VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qgrW_}pdM|UP@dqtoiYlyuXgohEbZcptRMTriH`@@sX`rmYkwNUiR`NDAS`D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A111VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qYyEHvcGh[e}mVd@JaI{aFBQlUow^Y~E|lgxmS}Ls_?|s~axjIUip`HDA^@D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A118LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qZ~YaHNuizuNwtD|lMWTozJsGa|QwPf]Py^MaVIExKYcjpmGh_??q@{I|cuh?@HpAj@@',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A121LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qqVkXrN_~uEnjBMlEcsqcIAJK^IvTxdA@_]^[NDDqTuDxkLY@_??xwRqefuih`J@AA@@',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A131VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qv]jtUvXqTZlp^}I]unFEU}pls]hwYW??FbHyvIgcrK_PkUjCWeiZ`BDAI`@',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A133LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qU`yTjrgsykbxC{]V\\CIACXm?guORcwyl_EPyYyalfWM??tAFAuKH`fJ@jMij`DdAm@@',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '2LZM:A149VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qJbuH^MR^w`NtJobHHB~r|lgyMyr|QOM\\@@CVe_WVc]tQUaw`~UhQ`HHAH@@',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '2LZM:A164LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qfwu`b[JgUtZ^UJVOAyxPDtNo@@Cv`d\\Naj{wB@][sL\\R@VwWQ`@]L^[]jehXPMpAh`D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '1CRN:A8VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qe]TBk`OHytGbc|?x~O|qHRW\\yPbochLxUBB@Lf}]lIY??xj\\\\UkL@BPAC`D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '1CRN:A15VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates: String.raw`!qKofDwfxh\}WeSyz|yK]vQfJldga\WP~L\YANtYHSyuU??vpzeuhD@IPAP@@`,
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '1CRN:A18LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qTZJFYbyhHJuUgP@@u]Gp~LBHFNpZw|qJb]NAqwvTz~`wU?Tza\\?IGUlsRuil@APAo@@',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '7RSA:A35LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qPgRPQf[\\vnEbxGERiwBCrl|Jvx\\PscLduvD@@LWrrCnrWgYDlKDhQJJ[kUkg@HxAh`D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '7RSA:A43VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qFrdjs[aTfkVN[{BQuCK\\{_U{_?|i@_EaM@tQs~wvxqWcporgIei\\`BxAI`D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '7RSA:A47VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qms^shsDZBM_X@~YO~OPEQqmGzHoMlGGkAUo@zNkx|imn_W??ZUiD`GlABpD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '7RSA:A51LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qmHpjWbClrnPaA?fnu^YQz_d`t@aUin|ckGGkig??]oTbIzoC_sBzzk@msekL`ErAkPD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '7RSA:A54VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qu@ScUhL|`jXUv}_PsBkRkEupoBQXC|HEfOfEpw??rqxN~ugpJUhF`MRAAPD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '7RSA:A57VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qbeb|SlUVMHjcMUxp?GbiOGbZKLY??wx~d@_|TsuuG`Z`YZwPNehy`CrARPD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '7RSA:A63VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qs`\\ea[FJXhu|ten`eaIjtANVux{JVunhh`tNlb?`@@BTmUZVZejk`IBA\\`D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '7RSA:A108VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qWbRAP{aq_SKqTvqpPV\\\\^QwDej`YSBB||bHqLtMH\\iT@@F]J\\UiI`ABAq`D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '7RSA:A116VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qX\\ZYecgD|hZ^LFIzVIUL]Mas@@Aymbz~X\\Zv|BzrhiKZ\\_wwzUjj`NrA\\`D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '7RSA:A118VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qKWwe?LSb}QX@@B^^h\\LNpcFT^|FKHb[oLXkwhMP^_~~Rd[wuQeiB`J|AW@D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '7RSA:A124VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qOprB@kFuQ`yFrW??BACK~n}yM^lk?LHs}~zxI_^?}u{L`M[n[UjS`FTALpD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '4LZT:A2VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!q~XGskdjhtVNjbxr\\rBidsxCI_?|C[eNyw~WXxJSFkfMsNthbgejT@MXAC`D',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '4LZT:A8LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!q\\Tnz}go}fHmbAuKyVWfhWf|_DS]uWialLNYp\\P@@gfK]CpdfF}]Kmlk\\`Uit@XtAZPD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '4LZT:A17LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qzXjrWUMSZ\\{PWxCVqkP|wSCckZ~gW^laFiEC}sXBPa}j}YTqWYXv}`@@BUjF@S\\AApD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '4LZT:A25LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!q~]JkYA`i@@AMoaN~vTj`NLXRPGJDT[Co`~deuqO}\\`kEysHBNwHSgh~ovejd@Z|AHpD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '4LZT:A29VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates: String.raw`!q}\p|sIb^@@@ZrYZuJyRbjdZT@U[PXhw_jWlVy\L[?RAB~QPu@ehX@LlAhpD`,
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '4LZT:A56LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates: String.raw`!q~VDjo[Dk}zH^NadOEdFUVrukvFBujf\vWxiUSE{{@@Ce}kbNNgwqLKbA@UjH@ODAVHD`,
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '4LZT:A75LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!q]j]qI^an\\qwTh^w`cwmHJ?r^{bU_xMijYAWkO`@@xuW[pKzFohRQyPTtPUjv@WhAChD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '4LZT:A83LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qBZJ]QxGjIH`z}oAX?Or?_}ZzWAtZoD@`kqcx~`NhBQNRB`@@hgaTvGMuzejP@_pASpD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '4LZT:A84LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qqqsfZbhTIcutz`@@k}bVamtDMMlaEvArpqOEN`k@G?Ny{psJN~oElIFqGeh@@U`A|pD',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
  {
    source: '4LZT:A92VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qUOFAn?@SYl]ewaqwm^L][yUa|EsCag??IG`PrNPNVx^AAkGgqeiz@TdADHD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '4LZT:A99VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qIDf`dywK@t~|lXdS[bWhoqZi@|x[xn`?QmH@@KWVmr}E@]zc`ekF@YlAihD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '4LZT:A109VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!qsTk|e~_~R`k[gRR`Ge@Cx|_ISh]wrvi\\ga~KKA}fiqJcmP@@Feir@F\\AWHD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '4LZT:A120VAL',
    code: 'VAL',
    idCode: 'gNy@LDenZjb`@',
    coordinates:
      '!q_kDEVO{r_oOLkb]PLJT@@DxVXepSO\\phF^nj\\YrHvmCU{FJzRei`@JRASPD',
    centre: 4,
    main: 1,
    branchOne: 5,
    branchTwo: 6,
  },
  {
    source: '4LZT:A129LEU',
    code: 'LEU',
    idCode: 'dazH@LAI[YjjaH@',
    coordinates:
      '!qnozQzG[u~N~Q`hSQcNU`|dPo`adGNIrD_?~}b^rrtOeSvA{dr[DCGxyBzUkf@QlAn`D',
    centre: 5,
    main: 4,
    branchOne: 6,
    branchTwo: 7,
  },
];
