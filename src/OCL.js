let OCL;

export function getOCL() {
  if (!OCL) {
    throw new Error('OCL has to be initialized using initOCL(OCL)');
  }
  return OCL;
}

export function initOCL(newOCL) {
  if (OCL && OCL !== newOCL) {
    throw new Error('OCL-utils was already initialized with a different OCL');
  }
  OCL = newOCL;
}
