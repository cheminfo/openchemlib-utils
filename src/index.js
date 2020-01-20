import * as Dia from './diastereotopic/Dia';
import * as Hose from './hose/Hose';
import * as Util from './util/Util';

export function initOCL(OCL) {
  Dia.initOCL(OCL);
  Hose.initOCL(OCL);
  Util.initOCL(OCL);
}

export { Dia, Hose, Util };
