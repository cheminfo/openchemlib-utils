import type { Molecule } from 'openchemlib';

export function changeMolfileCustomLabelPosition(
  molecule: Molecule,
  customLabelPosition: 'normal' | 'superscript' | undefined,
) {
  switch (customLabelPosition) {
    case 'superscript':
      for (let i = 0; i < molecule.getAllAtoms(); i++) {
        const label = molecule.getAtomCustomLabel(i);
        if (label && !label.startsWith(']')) {
          molecule.setAtomCustomLabel(i, `]${label}`);
        }
      }
      break;
    case 'normal':
      for (let i = 0; i < molecule.getAllAtoms(); i++) {
        const label = molecule.getAtomCustomLabel(i);
        if (label?.startsWith(']')) {
          molecule.setAtomCustomLabel(i, label.slice(1));
        }
      }
      break;
    case undefined:
      // nothing to do
      break;
    default:
      break;
  }
}
