import type { Intent } from '@blueprintjs/core';

import type { HintStatus } from './traceHints.ts';

interface StatusInfo {
  label: string;
  intent: Intent;
  /** what the status means, shown as a tooltip */
  title: string;
}

/** Label, colour and meaning of every trace status, in the order they are listed. */
export const STATUS_INFO: Record<HintStatus, StatusInfo> = {
  fired: {
    label: 'fired',
    intent: 'primary',
    title: 'in the correct structure and missing from the proposed one',
  },
  gated: {
    label: 'gate closed',
    intent: 'none',
    title: 'the proposed structure contains none of the anyMatches fragments',
  },
  absentFromCorrect: {
    label: 'not in correct',
    intent: 'none',
    title: 'the fragment is not in the correct structure',
  },
  presentInProposed: {
    label: 'already in proposed',
    intent: 'success',
    title: 'the proposed structure already contains the fragment',
  },
  invalid: {
    label: 'invalid',
    intent: 'danger',
    title: 'an idCode of this hint cannot be decoded',
  },
  idle: {
    label: 'idle',
    intent: 'none',
    title: 'draw both structures to evaluate the hint',
  },
};
