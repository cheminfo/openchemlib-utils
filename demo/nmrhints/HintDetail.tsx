import { Callout, NonIdealState, Tag } from '@blueprintjs/core';
import type { Molecule } from 'openchemlib';
import { useMemo } from 'react';

import { CopyableCode } from '../components/CopyableCode.tsx';
import { StructureThumbnail } from '../components/StructureThumbnail.tsx';
import { NO_ATOM_HIGHLIGHT } from '../components/highlight.ts';

import { FoundTag, IssueTag, StatusTag } from './HintTags.tsx';
import type { HintFragment } from './hintCatalog.ts';
import type { HintTrace } from './traceHints.ts';
import { findMatchAtoms } from './traceHints.ts';

interface HintDetailProps {
  trace: HintTrace | undefined;
  correct: Molecule | undefined;
  proposed: Molecule | undefined;
}

/**
 * One possible hint in full: its idCodes, and where its fragment sits in both structures.
 * @param props - the selected trace and the two structures
 * @returns the detail panel
 */
export function HintDetail(props: HintDetailProps) {
  const { trace, correct, proposed } = props;
  if (!trace) {
    return (
      <div className="panel">
        <NonIdealState
          icon="select"
          title="No hint selected"
          description="Click a row of the possible hints, or use the arrow keys."
        />
      </div>
    );
  }
  const { entry, gate, inCorrect, inProposed, status } = trace;

  return (
    <div className="panel">
      <div className="section-title">
        <span>{`Hint #${entry.index}`}</span>
        <StatusTag status={status} />
      </div>
      <b>{entry.hint.message}</b>
      {entry.hint.remarks === undefined ? null : (
        <span>
          <Tag minimal>{entry.hint.remarks}</Tag>
        </span>
      )}
      {entry.issues.length === 0 ? null : (
        <Callout intent="warning" title="idCode issues">
          <ul>
            {entry.issues.map((issue) => (
              <li key={issue.label}>
                <IssueTag issue={issue} /> {issue.message}
              </li>
            ))}
          </ul>
        </Callout>
      )}

      <div className="section-title">
        <span>Fragment, and its matches in both structures</span>
      </div>
      <div className="chip-row">
        <FragmentFacts fragment={entry.fragment} />
        <HighlightedStructure
          title="correct"
          fragment={entry.fragment.molecule}
          molecule={correct}
          found={inCorrect}
        />
        <HighlightedStructure
          title="proposed"
          fragment={entry.fragment.molecule}
          molecule={proposed}
          found={inProposed}
        />
      </div>

      <div className="section-title">
        <span>anyMatches gate</span>
      </div>
      {entry.anyMatches.length === 0 ? (
        <span className="muted">
          No gate: the hint is considered whatever the proposed structure is.
        </span>
      ) : (
        <>
          <span className="muted">
            The hint is considered only if the proposed structure contains at
            least one of these.
          </span>
          <div className="chip-row">
            {entry.anyMatches.map((anyMatch, position) => (
              <div key={anyMatch.idCode} className="stack-cell">
                <FragmentFacts fragment={anyMatch} />
                <span>
                  in proposed: <FoundTag found={gate[position]} />
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function FragmentFacts(props: { fragment: HintFragment }) {
  const { fragment } = props;
  return (
    <div className="stack-cell">
      {fragment.molecule ? (
        <StructureThumbnail
          molecule={fragment.molecule}
          width={140}
          height={110}
        />
      ) : (
        <Callout className="error-card" intent="danger">
          {fragment.error}
        </Callout>
      )}
      <CopyableCode value={fragment.idCode} label="idCode" length={32} />
      {fragment.canonicalIdCode === undefined ||
      fragment.canonicalIdCode === fragment.idCode ? null : (
        <span className="muted">
          canonical:{' '}
          <CopyableCode
            value={fragment.canonicalIdCode}
            label="canonical idCode"
            length={32}
          />
        </span>
      )}
      {fragment.smarts === undefined ? null : (
        <span className="mono" title="SMARTS">
          {fragment.smarts}
        </span>
      )}
    </div>
  );
}

function HighlightedStructure(props: {
  title: string;
  fragment: Molecule | undefined;
  molecule: Molecule | undefined;
  found: boolean | undefined;
}) {
  const { title, fragment, molecule, found } = props;
  const atoms = useMemo(
    () =>
      fragment && molecule && found
        ? findMatchAtoms(fragment, molecule)
        : NO_ATOM_HIGHLIGHT,
    [fragment, molecule, found],
  );
  return (
    <div className="stack-cell">
      <span>
        {`${title}: `}
        <FoundTag found={found} />
      </span>
      <StructureThumbnail
        molecule={molecule}
        width={180}
        height={140}
        atomHighlight={atoms}
      />
    </div>
  );
}
