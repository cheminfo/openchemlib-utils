let OCL;

export function getOCL() {
  if (!OCL) {
    throw new Error('OCL has to be initialized using initOCL(OCL)');
  }
  return OCL;
}

export function initOCL(newOCL) {
  OCL = newOCL;
}
