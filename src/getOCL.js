export function getOCL(OCL, options = {}) {
  if (options.OCL) return options.OCL;
  if (!OCL) {
    throw new Error('OCL has to be initialized using initOCL(OCL)');
  }
  return OCL;
}
