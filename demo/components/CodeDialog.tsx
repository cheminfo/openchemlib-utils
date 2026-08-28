import { Button, Dialog, DialogBody } from '@blueprintjs/core';
import type { IconName } from '@blueprintjs/icons';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface CodeDialogProps {
  /** Heading of the dialog, and the button text unless `buttonText` is given. */
  title: string;
  /** @default title */
  buttonText?: string;
  /** @default 'code' */
  icon?: IconName;
  /** Body of the dialog, usually one or more `CodeBlock`. */
  children: ReactNode;
}

const DIALOG_STYLE = { width: 'min(900px, 92vw)' } as const;

/**
 * Keeps raw text out of the layout: a small button that opens the blocks to
 * read and copy in a dialog.
 * @param props - the dialog heading, its button and the blocks to show
 * @returns the opener button
 */
export function CodeDialog(props: CodeDialogProps) {
  const { title, buttonText = title, icon = 'code', children } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        size="small"
        variant="minimal"
        icon={icon}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {buttonText}
      </Button>
      <Dialog
        isOpen={isOpen}
        title={title}
        icon={icon}
        style={DIALOG_STYLE}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DialogBody>{children}</DialogBody>
      </Dialog>
    </>
  );
}
