import { noWait } from '../../util/noWait.js';

import getMoleculeCreators from './getMoleculeCreators';

class AbortError extends Error {
  name = 'AbortError';
  code = 20;
}

function getQuery(moleculesDB, query, options) {
  const { format = 'idCode' } = options;

  if (typeof query === 'string') {
    const moleculeCreators = getMoleculeCreators(moleculesDB.OCL);
    query = moleculeCreators.get(format.toLowerCase())(query);
  } else if (!(query instanceof moleculesDB.OCL.Molecule)) {
    throw new TypeError('toSearch must be a Molecule or string');
  }
  return query;
}

export function search(moleculesDB, query = '', options = {}) {
  const { mode = 'substructure' } = options;

  query = getQuery(moleculesDB, query, options);

  let result;
  switch (mode.toLowerCase()) {
    case 'exact':
      result = exactSearch(moleculesDB, query);
      break;
    case 'substructure':
      result = subStructureSearch(moleculesDB, query);
      break;
    case 'similarity':
      result = similaritySearch(moleculesDB, query);
      break;
    default:
      throw new Error(`unknown search mode: ${options.mode}`);
  }
  return processResult(result, options);
}

export async function searchAsync(moleculesDB, query = '', options = {}) {
  const { mode = 'substructure' } = options;

  query = getQuery(moleculesDB, query, options);

  let result;
  switch (mode.toLowerCase()) {
    case 'exact':
      result = exactSearch(moleculesDB, query);
      break;
    case 'substructure':
      result = await subStructureSearchAsync(moleculesDB, query, options);
      break;
    case 'similarity':
      result = similaritySearch(moleculesDB, query);
      break;
    default:
      throw new Error(`unknown search mode: ${options.mode}`);
  }
  return processResult(result, options);
}

function exactSearch(moleculesDB, query) {
  query = query.getCompactCopy();
  query.setFragment(false);

  const queryIDCode = query.getIDCode();
  const searchResult = moleculesDB.db[queryIDCode]
    ? [moleculesDB.db[queryIDCode]]
    : [];
  return searchResult;
}

function substructureSearchBegin(moleculesDB, query) {
  const searchResult = [];
  if (query.getAllAtoms() === 0) {
    for (const idCode in moleculesDB.db) {
      searchResult.push(moleculesDB.db[idCode]);
    }
  }
  return { searchResult };
}

function substructureSearchEnd(searchResult, queryMW) {
  searchResult.sort((a, b) => {
    return (
      Math.abs(queryMW - a.properties.mw) - Math.abs(queryMW - b.properties.mw)
    );
  });

  return searchResult;
}

function subStructureSearch(moleculesDB, query) {
  const queryMW = getMW(query); // we
  query = query.getCompactCopy();
  query.setFragment(true);

  const { searchResult } = substructureSearchBegin(moleculesDB, query);

  if (searchResult.length === 0) {
    const queryIndex = query.getIndex();
    const searcher = moleculesDB.searcher;
    searcher.setFragment(query, queryIndex);
    for (const idCode in moleculesDB.db) {
      const entry = moleculesDB.db[idCode];
      searcher.setMolecule(entry.molecule, entry.index);
      if (searcher.isFragmentInMolecule()) {
        searchResult.push(entry);
      }
    }
  }

  return substructureSearchEnd(searchResult, queryMW);
}

async function subStructureSearchAsync(moleculesDB, query, options = {}) {
  const queryMW = getMW(query); // we
  query = query.getCompactCopy();
  query.setFragment(true);

  const { interval = 100, onStep, controller } = options;
  let shouldAbort = false;

  if (controller) {
    const abortEventListener = () => {
      shouldAbort = true;
    };
    controller.signal.addEventListener('abort', abortEventListener);
  }

  const { searchResult } = substructureSearchBegin(moleculesDB, query);

  let begin = performance.now();

  if (searchResult.length === 0) {
    const queryIndex = query.getIndex();
    const searcher = moleculesDB.searcher;
    searcher.setFragment(query, queryIndex);
    let index = 0;
    const length = Object.keys(moleculesDB.db).length;
    for (const idCode in moleculesDB.db) {
      if (shouldAbort) {
        throw new AbortError('Query aborted');
      }
      const entry = moleculesDB.db[idCode];
      searcher.setMolecule(entry.molecule, entry.index);
      if (searcher.isFragmentInMolecule()) {
        searchResult.push(entry);
      }
      if ((onStep || controller) && performance.now() - begin >= interval) {
        begin = performance.now();
        if (onStep) {
          onStep(index, length);
        }
        if (controller && !onStep) {
          await noWait();
        }
      }
      index++;
    }
  }
  return substructureSearchEnd(searchResult, queryMW);
}

function similaritySearch(moleculesDB, query) {
  const queryIndex = query.getIndex();
  const queryMW = getMW(query);
  const queryIdCode = query.getIDCode();

  const searchResult = [];
  let similarity;
  for (const idCode in moleculesDB.db) {
    const entry = moleculesDB.db[idCode];
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
  const copy = query.getCompactCopy();
  copy.setFragment(false);
  return copy.getMolecularFormula().relativeWeight;
}

function processResult(entries, options = {}) {
  const {
    flattenResult = true,
    keepMolecule = false,
    limit = Number.MAX_SAFE_INTEGER,
  } = options;
  const results = [];

  if (flattenResult) {
    for (const entry of entries) {
      for (const data of entry.data) {
        const result = {
          data,
          idCode: entry.idCode,
          properties: entry.properties,
        };
        if (keepMolecule) {
          result.molecule = entry.molecule;
        }
        results.push(result);
      }
    }
  } else {
    for (const entry of entries) {
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
