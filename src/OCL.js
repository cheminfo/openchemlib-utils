let OCL;

export function getOCL() {
  if (!OCL) {
    throw new Error('OCL has to be initialized using initOCL(OCL)');
  }
  return OCL;
}
/**
 * 
 * @param {OCL} newOCL 
 * @param {object} [options={}]
 * @param {boolean} [options.keepExisting=false] Will keep current OCL if we initialize more than once
 */
export function initOCL(newOCL, options = {}) {
  const { keepExisting = false } = options;
  if (OCL && keepExisting) return;
  if (OCL && OCL !== newOCL) {
    throw new Error('OCL-utils was already initialized with a different OCL');
  }
  OCL = newOCL;
}
