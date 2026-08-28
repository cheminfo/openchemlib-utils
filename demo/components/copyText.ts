/**
 * Copies a value to the clipboard, ignoring the rejection an insecure context gives.
 * @param text - the value to copy
 */
export function copyText(text: string): void {
  void navigator.clipboard.writeText(text).catch(() => null);
}
