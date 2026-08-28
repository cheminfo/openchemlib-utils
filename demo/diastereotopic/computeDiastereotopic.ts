import { FifoLogger } from 'fifo-logger';
import { Molecule } from 'openchemlib';

import { getChiralOrHeterotopicCarbons } from '../../src/diastereotopic/getChiralOrHeterotopicCarbons.js';
import { TopicMolecule } from '../../src/topic/TopicMolecule.ts';
import { errorMessage } from '../components/errorMessage.ts';

import {
  applyCustomLabels,
  buildAtomRows,
  buildGroupRows,
  diffStereoBonds,
  snapshotMolfiles,
} from './rows.ts';
import type {
  DiastereotopicOptionsState,
  DiastereotopicResult,
  TimingEntry,
} from './types.ts';

/**
 * Runs the whole diastereotopic analysis on a molfile and returns everything the
 * panels need, plus the per-step timings and the warnings emitted by the library.
 *
 * Every index-dependent read happens before `setProchiralHydrogenLabels`: a custom
 * label makes a hydrogen non-plain, and the next `ensureHelperArrays` then moves it
 * ahead of the plain hydrogens, which would desynchronise the atom-indexed arrays.
 * @param molfile - V2000 or V3000 molfile; an empty string yields an `empty` result
 * @param options - the options currently set in the OptionsBar
 * @returns a discriminated union: `empty`, `error` or `ok`
 */
export function computeDiastereotopic(
  molfile: string,
  options: DiastereotopicOptionsState,
): DiastereotopicResult {
  if (!molfile.trim()) return { kind: 'empty' };
  const logger = new FifoLogger();
  const timings: TimingEntry[] = [];
  function time<T>(step: string, run: () => T): T {
    const start = performance.now();
    const value = run();
    timings.push({ step, ms: performance.now() - start });
    return value;
  }

  let parsed: Molecule;
  try {
    parsed = time('Molecule.fromMolfile', () => Molecule.fromMolfile(molfile));
    // fromMolfile never throws; a nonsensical molfile silently yields 0 atoms.
    if (parsed.getAllAtoms() === 0) {
      throw new Error('the molfile parsed to a molecule without any atom');
    }
  } catch (error) {
    return toError('Molecule.fromMolfile', error);
  }

  let step = 'new TopicMolecule';
  try {
    const topicMolecule = new TopicMolecule(parsed, {
      maxPathLength: options.maxPathLength,
      maxNbAtoms: options.maxNbAtoms,
      minSphereSize: options.minSphereSize,
      maxSphereSize: options.maxSphereSize,
      logger,
    });

    step = 'moleculeWithH';
    const liveWithH = time(step, () => topicMolecule.moleculeWithH);
    step = 'heterotopicSymmetryRanks';
    const symRanks = time(step, () =>
      topicMolecule.heterotopicSymmetryRanks.slice(),
    );
    step = 'finalRanks';
    const finalRanks = time(step, () => topicMolecule.finalRanks.slice());
    step = 'diaIDs';
    const diaIDs = time(step, () => topicMolecule.diaIDs.slice());
    step = 'enantioIDs';
    const enantioIDs = time(step, () => topicMolecule.enantioIDs.slice());
    step = 'prochiralities';
    const prochiralities = time(step, () =>
      topicMolecule.prochiralities.slice(),
    );
    step = 'diaIDsAndInfo';
    const diaIDsAndInfo = time(step, () => topicMolecule.diaIDsAndInfo.slice());
    step = 'distanceMatrix';
    const distanceMatrix = time(step, () => topicMolecule.distanceMatrix);
    step = 'hoseCodes';
    const hoseCodes = options.computeHoseCodes
      ? time(step, () => topicMolecule.hoseCodes.slice())
      : undefined;

    step = 'molfiles (before labelling)';
    const molfilesBefore = time(step, () => snapshotMolfiles(topicMolecule));

    step = 'stable copies';
    const atomCountMolecule = topicMolecule.getMolecule().getAllAtoms();
    const { molecule, moleculeWithH, moleculeForDisplay } = time(step, () => ({
      molecule: topicMolecule.getMolecule().getCompactCopy(),
      moleculeWithH: liveWithH.getCompactCopy(),
      moleculeForDisplay: (options.showHydrogens
        ? liveWithH
        : topicMolecule.getMolecule()
      ).getCompactCopy(),
    }));

    step = 'build atom rows';
    const rows = time(step, () =>
      buildAtomRows({
        moleculeWithH: liveWithH,
        atomCountMolecule,
        symRanks,
        finalRanks,
        diaIDs,
        enantioIDs,
        prochiralities,
        diaIDsAndInfo,
        hoseCodes,
      }),
    );

    step = 'getDiaIDsObject / getGroupedDiastereotopicAtomIDs';
    const { groups, hydrogenGroups } = time(step, () => {
      const context = {
        diaIDsObject: topicMolecule.getDiaIDsObject(),
        prochiralities,
        enantioIDs,
      };
      return {
        groups: buildGroupRows(
          topicMolecule.getGroupedDiastereotopicAtomIDs() ?? [],
          context,
        ),
        hydrogenGroups: buildGroupRows(
          topicMolecule.getGroupedDiastereotopicAtomIDs({ atomLabel: 'H' }) ??
            [],
          context,
        ),
      };
    });

    step = 'stereo bonds';
    const stereoBonds = time(step, () => diffStereoBonds(molfile, liveWithH));

    step = 'getChiralOrHeterotopicCarbons';
    let chiralOrHeterotopicCarbons: number[] = [];
    let chiralCarbonsError: string | undefined;
    try {
      chiralOrHeterotopicCarbons = time(step, () =>
        getChiralOrHeterotopicCarbons(molecule.getCompactCopy()),
      );
    } catch (error) {
      chiralCarbonsError = errorMessage(error);
    }

    step = 'setProchiralHydrogenLabels';
    const labelledCount = time(step, () =>
      topicMolecule.setProchiralHydrogenLabels({
        includeEnantiotopic: options.includeEnantiotopic,
      }),
    );
    step = 'read custom labels';
    time(step, () => applyCustomLabels(rows, liveWithH));
    step = 'molfiles (after labelling)';
    const molfilesAfter = time(step, () => snapshotMolfiles(topicMolecule));

    const spheres: number[] = [];
    for (let s = options.minSphereSize; s <= options.maxSphereSize; s++) {
      spheres.push(s);
    }
    let prochiralHydrogens = 0;
    let diastereotopicHydrogens = 0;
    let enantiotopicHydrogens = 0;
    for (const row of rows) {
      if (row.prochirality !== undefined) prochiralHydrogens++;
      if (row.topicity === 'diastereotopic') diastereotopicHydrogens++;
      if (row.topicity === 'enantiotopic') enantiotopicHydrogens++;
    }

    return {
      kind: 'ok',
      topicMolecule,
      molecule,
      moleculeWithH,
      moleculeForDisplay,
      rows,
      groups,
      hydrogenGroups,
      stereoBonds,
      chiralOrHeterotopicCarbons,
      chiralCarbonsError,
      distanceMatrix,
      hoseCodes,
      spheres,
      molfilesBefore,
      molfilesAfter,
      overMaxNbAtoms: rows.length > options.maxNbAtoms,
      summary: {
        atomCountMolecule,
        atomCountMoleculeWithH: rows.length,
        distinctDiaIDs: new Set(diaIDs).size,
        distinctEnantioIDs: new Set(enantioIDs).size,
        groupCount: groups.length,
        prochiralHydrogens,
        diastereotopicHydrogens,
        enantiotopicHydrogens,
        labelledCount,
      },
      timings,
      logs: logger.getLogs().map((log) => ({
        level: log.levelLabel,
        message: log.message,
      })),
    };
  } catch (error) {
    return toError(step, error);
  }
}

function toError(step: string, error: unknown): DiastereotopicResult {
  return {
    kind: 'error',
    step,
    message: errorMessage(error),
    stack: error instanceof Error ? error.stack : undefined,
  };
}
