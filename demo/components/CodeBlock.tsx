import { Button } from '@blueprintjs/core';
import { useCallback, useEffect, useState } from 'react';

interface CodeBlockProps {
  code: string;
  label?: string;
  /** @default 240 */
  maxHeight?: number;
}

/**
 * Monospace block of text with a copy-to-clipboard button.
 * @param props - the text to show, an optional label and a maximum height
 * @returns the code panel
 */
export function CodeBlock(props: CodeBlockProps) {
  const { code, label, maxHeight = 240 } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    void navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
      })
      .catch(() => {
        setCopied(false);
      });
  }, [code]);

  useEffect(() => {
    if (!copied) return undefined;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <div className="panel">
      <div className="section-title">
        <span>{label ?? ''}</span>
        <Button
          size="small"
          variant="minimal"
          icon={copied ? 'tick' : 'clipboard'}
          onClick={handleCopy}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      <pre className="mono code-block" style={{ maxHeight }}>
        {code}
      </pre>
    </div>
  );
}
