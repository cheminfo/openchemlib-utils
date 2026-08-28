import { Button, Callout, Tag } from '@blueprintjs/core';

import { CodeBlock } from '../components/CodeBlock.tsx';
import { CodeDialog } from '../components/CodeDialog.tsx';
import { StructureThumbnail } from '../components/StructureThumbnail.tsx';

import { FamilyTag } from './FamilyTag.tsx';
import {
  NO_MATCH_TEXT,
  describeTried,
  findEntry,
  shadowedHeading,
} from './applyRun.ts';
import type { RunAutoLabelResult } from './runAutoLabel.ts';

interface RunResultProps {
  result: RunAutoLabelResult;
  /** The run applied one entry only, so it never walked the database. */
  single: boolean;
  onSelectEntry: (index: number) => void;
}

/**
 * The outcome of one run: winner, shadowed entries, labelled depiction, duplicates, molfile.
 * @param props - the run result and the selection callback
 * @returns the result block
 */
export function RunResult(props: RunResultProps) {
  const { result, single, onSelectEntry } = props;
  const {
    winnerIndex,
    found,
    labelledAtoms,
    triedEntries,
    elapsedMs,
    allMatches,
    nonUniqueLabels,
    molecule,
    molfileWithLabels,
  } = result;
  const winner = findEntry(winnerIndex);
  const shadowed =
    winnerIndex === undefined
      ? allMatches
      : allMatches.filter((index) => index > winnerIndex);

  return (
    <div className="result-card">
      {winner ? (
        <div className="panel">
          <div className="section-title">
            <Button
              variant="minimal"
              onClick={() => onSelectEntry(winner.index)}
            >
              #{winner.index} {winner.label}
            </Button>
            <Tag intent="success">found = {found}</Tag>
          </div>
          <div className="chip-row">
            <StructureThumbnail
              molecule={winner.target}
              width={160}
              height={120}
            />
            <FamilyTag family={winner.family} />
            <Tag minimal>{labelledAtoms} labelled atoms</Tag>
            <Tag minimal>{describeTried(single, triedEntries)}</Tag>
            <Tag minimal>{elapsedMs.toFixed(1)} ms</Tag>
          </div>
        </div>
      ) : (
        <Callout intent="warning" title="No entry matched">
          {NO_MATCH_TEXT}
        </Callout>
      )}
      {shadowed.length > 0 ? (
        <div className="panel">
          <div className="section-title">
            <span>{shadowedHeading(winnerIndex)}</span>
          </div>
          <div className="chip-row">
            {shadowed.map((index) => (
              <Tag key={index} interactive onClick={() => onSelectEntry(index)}>
                #{index} {findEntry(index)?.label ?? '?'}
              </Tag>
            ))}
          </div>
        </div>
      ) : null}
      {nonUniqueLabels.length > 0 ? (
        <Callout intent="danger" title="Duplicate custom labels">
          {nonUniqueLabels.join(', ')}
        </Callout>
      ) : null}

      <div className="panel">
        <div className="section-title">
          <span>labelled molecule</span>
          <CodeDialog title="Molfile with V lines" buttonText="Molfile">
            <CodeBlock
              label="molfile with V lines"
              code={molfileWithLabels}
              maxHeight={480}
            />
          </CodeDialog>
        </div>
        <StructureThumbnail molecule={molecule} width={420} height={340} />
      </div>
    </div>
  );
}
