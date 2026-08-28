/**
 * Data defects of individual `autoLabelDatabase` entries, keyed by entry label.
 *
 * Every claim was measured against the decoded entry; an entry absent from this
 * map has no known defect.
 */
export const KNOWN_ISSUES: Record<string, string[]> = buildKnownIssues();

function buildKnownIssues(): Record<string, string[]> {
  const flavonoidSubstitution =
    'drawn with the 5,7,4′-trihydroxy substitution pattern, so the unsubstituted parent flavonoid does not match.';
  return {
    Ursane: [
      '`mf` is C30H50, one C=C short of its four C30H52 siblings — the template is urs-12-ene, not ursane. It matches ursolic acid and can never match a saturated ursane.',
    ],
    Protostane: [
      'locant 30 is missing — 29 of 30 atoms are labelled; the C14 methyl carries no custom label, while every sibling tetracyclic triterpene labels it `]30`.',
    ],
    Lycopene: [
      'four labels carry a stray leading space (`"] 4′"`, `"] 3′"`, `"] 2′"`, `"] 1′"`) straight from the V3000 source. Substring search still finds them; equality search does not.',
    ],
    Coumarin: [
      'only 8 of the 11 atoms are labelled — the two ring-fusion carbons (C4a, C8a) and the lactone carbonyl oxygen carry no locant, while its twin `2H-Chromene` labels the same ring-fusion positions `]8α` and `]4α`.',
    ],
    deoxythymidine: [
      'only 11 of the 17 atoms are labelled — the thymine 5-methyl and the five oxygens carry no locant.',
    ],
    methionine: [
      'drawn as methioninal — `mf` is C5H11NOS (real methionine is C5H11NO2S), the SMILES is `CSCC[C@@H](C=O)N`. It still matches real methionine, but the entry’s own formula and depiction are wrong.',
    ],
    Gonane: [deadSteroidEntry('steroid core')],
    Estrane: [deadSteroidEntry('steroid')],
    Anthocyanidine: [
      'contains a pyrylium `[o+]`; `SSSearcher`’s default `matchAtomCharge: false` means it also matches neutral chromenes.',
      flavonoidSubstitution,
    ],
    Flavone: [flavonoidSubstitution],
    Flavonol: [flavonoidSubstitution],
    Flavanone: [flavonoidSubstitution],
    Chalcone: [flavonoidSubstitution],
    'Flavan-3-ol': [flavonoidSubstitution],
    'Flavan-3,4-diol': [flavonoidSubstitution],
    Dihydroflavonol: [flavonoidSubstitution],
  };
}

function deadSteroidEntry(shadowedBy: string): string {
  return `\`not0Hydrogen\` query features demand a hydrogen on atoms that are quaternary in any real steroid (C10 / C13), so this entry can never match a steroid bearing its angular methyls. It is also shadowed in the mw tie-break by \`${shadowedBy}\`.`;
}
