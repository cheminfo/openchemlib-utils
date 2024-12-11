/**
 * Converts a string to camel case.
 * @param {string} name
 * @returns {string}
 */
export function getCamelCase(name) {
  return name.replaceAll(/[ -][a-z]/g, (string) => string[1].toUpperCase());
}
