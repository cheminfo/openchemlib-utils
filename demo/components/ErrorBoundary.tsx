import { Button, Callout, Collapse } from '@blueprintjs/core';
import type { ReactNode } from 'react';
import { Component } from 'react';

interface ErrorBoundaryProps {
  title?: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | undefined;
  showStack: boolean;
}

/** Catches a render error from one panel and shows it instead of unmounting the whole app. */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: undefined, showStack: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error, showStack: false };
  }

  handleReset = () => {
    this.setState({ error: undefined, showStack: false });
  };

  handleToggleStack = () => {
    this.setState((state) => ({ showStack: !state.showStack }));
  };

  override render(): ReactNode {
    const { error, showStack } = this.state;
    const { title = 'Something went wrong', children } = this.props;
    if (!error) return children;
    return (
      <Callout
        className="error-card"
        intent="danger"
        title={title}
        icon="error"
      >
        <p className="mono">{error.message}</p>
        <div className="chip-row">
          <Button size="small" onClick={this.handleReset}>
            Reset
          </Button>
          <Button
            size="small"
            variant="minimal"
            onClick={this.handleToggleStack}
          >
            {showStack ? 'Hide stack' : 'Show stack'}
          </Button>
        </div>
        <Collapse isOpen={showStack}>
          <pre className="mono code-block">{error.stack ?? 'no stack'}</pre>
        </Collapse>
      </Callout>
    );
  }
}
