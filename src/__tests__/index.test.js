import OCL from 'openchemlib';
import OCL2 from 'openchemlib/minimal';

import { initOCL } from '..';

describe('openchemlib-utils', () => {
  it('initOCL', () => {
    initOCL(OCL);
    // Should not throw if called with the same OCL.
    initOCL(OCL);
    // Should be ok if we keep existing
    initOCL(OCL2, { keepExisting: true });
    expect(() => initOCL(OCL2)).toThrow(
      'OCL-utils was already initialized with a different OCL',
    );
  });
});
