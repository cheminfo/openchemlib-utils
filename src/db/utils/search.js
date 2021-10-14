import getMoleculeCreators from './getMoleculeCreators';

export default function search(moleculesDB, query, options = {}) {
  const {
    format = 'idCode',
    mode = 'substructure',
    flattenResult = true,
    keepMolecule = false,
    limit = Number.MAX_SAFE_INTEGER,
  } = options;

  if (typeof query === 'string') {
    const moleculeCreators = getMoleculeCreators(moleculesDB.OCL.Molecule);
    query = moleculeCreators.get(format.toLowerCase())(query);
  } else if (!(query instanceof moleculesDB.OCL.Molecule)) {
    throw new TypeError('toSearch must be a Molecule or string');
  }

  let result;
  switch (mode.toLowerCase()) {
    case 'exact':
      result = exactSearch(moleculesDB, query, limit);
      break;
    case 'substructure':
      result = subStructureSearch(moleculesDB, query, limit);
      break;
    case 'similarity':
      result = similaritySearch(moleculesDB, query, limit);
      break;
    default:
      throw new Error(`unknown search mode: ${options.mode}`);
  }
  return processResult(result, { flattenResult, keepMolecule, limit });
}

function exactSearch(moleculesDB, query) {
  const queryIDCode = query.getIDCode();
  let searchResult = moleculesDB.db[queryIDCode]
    ? [moleculesDB.db[queryIDCode]]
    : [];
  return searchResult;
}

function subStructureSearch(moleculesDB, query) {
  let resetFragment = false;
  if (!query.isFragment()) {
    resetFragment = true;
    query.setFragment(true);
  }

  const queryMW = getMW(query);
  const searchResult = [];
  if (query.getAllAtoms() === 0) {
    for (let idCode in moleculesDB.db) {
      searchResult.push(moleculesDB.db[idCode]);
    }
  } else {
    const queryIndex = query.getIndex();
    const searcher = moleculesDB.searcher;

    searcher.setFragment(query, queryIndex);
    for (let idCode in moleculesDB.db) {
      let entry = moleculesDB.db[idCode];
      searcher.setMolecule(entry.molecule, entry.index);
      if (searcher.isFragmentInMolecule()) {
        searchResult.push(entry);
      }
    }
  }

  searchResult.sort((a, b) => {
    return (
      Math.abs(queryMW - a.properties.mw) - Math.abs(queryMW - b.properties.mw)
    );
  });

  if (resetFragment) {
    query.setFragment(false);
  }

  return searchResult;
}

function similaritySearch(moleculesDB, query) {
  const queryIndex = query.getIndex();
  const queryMW = getMW(query);
  const queryIdCode = query.getIDCode();

  const searchResult = [];
  let similarity;
  for (let idCode in moleculesDB.db) {
    let entry = moleculesDB.db[idCode];
    if (entry.idCode === queryIdCode) {
      similarity = Number.MAX_SAFE_INTEGER;
    } else {
      similarity =
        moleculesDB.OCL.SSSearcherWithIndex.getSimilarityTanimoto(
          queryIndex,
          entry.index,
        ) *
          1000000 -
        Math.abs(queryMW - entry.properties.mw) / 10000;
    }
    searchResult.push({ similarity, entry });
  }
  searchResult.sort((a, b) => {
    return b.similarity - a.similarity;
  });
  return searchResult.map((entry) => entry.entry);
}

function getMW(query) {
  let copy = query.getCompactCopy();
  copy.setFragment(false);
  return copy.getMolecularFormula().relativeWeight;
}

function processResult(entries, options = {}) {
  const {
    flattenResult = true,
    keepMolecule = false,
    limit = Number.MAX_SAFE_INTEGER,
  } = options;
  let results = [];

  if (flattenResult) {
    for (let entry of entries) {
      for (let data of entry.data) {
        results.push({
          data,
          idCode: entry.idCode,
          properties: entry.properties,
          molecule: keepMolecule ? entry.molecule : undefined,
        });
      }
    }
  } else {
    for (let entry of entries) {
      results.push({
        data: entry.data,
        idCode: entry.idCode,
        properties: entry.properties,
        molecule: keepMolecule ? entry.molecule : undefined,
      });
    }
  }
  if (limit < results.length) results.length = limit;
  return results;
}
