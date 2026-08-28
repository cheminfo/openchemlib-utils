import { Button, Callout, Card, Collapse, Tag } from '@blueprintjs/core';
import { useState } from 'react';

import type { DiastereotopicError, LogEntry } from './types.ts';

interface AnalysisErrorProps {
  error: DiastereotopicError;
}

interface LoggerCardProps {
  logs: LogEntry[];
}

/**
 * The failing step, its message and its collapsible stack.
 * @param props - the error result of `computeDiastereotopic`
 * @returns the danger callout
 */
export function AnalysisError(props: AnalysisErrorProps) {
  const { error } = props;
  const [showStack, setShowStack] = useState(false);

  return (
    <Callout
      className="error-card"
      intent="danger"
      icon="error"
      title="Cannot analyse this structure"
    >
      <div className="muted">{`failing step: ${error.step}`}</div>
      <pre className="mono code-block">{error.message}</pre>
      <Button
        size="small"
        variant="minimal"
        onClick={() => {
          setShowStack(!showStack);
        }}
      >
        {showStack ? 'Hide stack' : 'Show stack'}
      </Button>
      <Collapse isOpen={showStack}>
        <pre className="mono code-block">{error.stack ?? 'no stack'}</pre>
      </Collapse>
    </Callout>
  );
}

/**
 * The warnings the library sent to the injected `FifoLogger` — the only place the
 * `too many atoms to evaluate heterotopicity` messages ever surface.
 * @param props - the collected log entries
 * @returns the logger card
 */
export function LoggerCard(props: LoggerCardProps) {
  const { logs } = props;

  return (
    <Card elevation={0} className="result-card">
      <div className="section-title">
        <span>Library logger ({logs.length})</span>
        <Tag minimal intent="warning">
          FifoLogger
        </Tag>
      </div>
      {withKeys(logs).map((entry) => (
        <div key={entry.key} className="mono">
          <Tag minimal>{entry.log.level}</Tag> {entry.log.message}
        </div>
      ))}
    </Card>
  );
}

// The library repeats the same warning verbatim, so a key is the message plus the
// number of identical messages already rendered.
function withKeys(logs: LogEntry[]): Array<{ key: string; log: LogEntry }> {
  const seen = new Map<string, number>();
  const entries: Array<{ key: string; log: LogEntry }> = [];
  for (const log of logs) {
    const base = `${log.level}: ${log.message}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    entries.push({ key: `${base}#${count}`, log });
  }
  return entries;
}
