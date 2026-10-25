import type { Intent } from '@blueprintjs/core';
import { Tag } from '@blueprintjs/core';

import type { HintIssue } from './hintCatalog.ts';
import { STATUS_INFO } from './statusInfo.ts';
import type { HintStatus } from './traceHints.ts';

interface StatusTagProps {
  status: HintStatus;
}

/**
 * Why a hint fired or not.
 * @param props - the status
 * @returns the status tag
 */
export function StatusTag(props: StatusTagProps) {
  const { status } = props;
  const info = STATUS_INFO[status];
  return (
    <Tag
      minimal={status !== 'fired'}
      intent={info.intent}
      htmlTitle={info.title}
    >
      {info.label}
    </Tag>
  );
}

interface FoundTagProps {
  /** `undefined` before both structures are drawn */
  found: boolean | undefined;
}

/**
 * Whether a fragment was found; a dash before both structures are drawn.
 * @param props - the search answer
 * @returns the answer tag
 */
export function FoundTag(props: FoundTagProps) {
  const { found } = props;
  if (found === undefined) return <span className="muted">—</span>;
  return (
    <Tag
      minimal
      intent={found ? 'success' : 'none'}
      icon={found ? 'tick' : 'cross'}
    >
      {found ? 'yes' : 'no'}
    </Tag>
  );
}

const ISSUE_INTENT: Record<HintIssue['level'], Intent> = {
  danger: 'danger',
  warning: 'warning',
  info: 'none',
};

interface IssueTagProps {
  issue: HintIssue;
}

/**
 * One problem of an idCode of the hint list.
 * @param props - the issue
 * @returns the issue tag, its full message as a tooltip
 */
export function IssueTag(props: IssueTagProps) {
  const { issue } = props;
  return (
    <Tag minimal intent={ISSUE_INTENT[issue.level]} htmlTitle={issue.message}>
      {issue.label}
    </Tag>
  );
}
