/**
 * Reads the message out of whatever was thrown.
 * @param error - the caught value
 * @returns the message of an `Error`, the stringified value otherwise
 */
export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
