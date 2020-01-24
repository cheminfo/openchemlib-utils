// run with `node -r esm ./getPathsInfo.js`

import OCL from 'openchemlib';

import { getPathsInfo, initOCL } from '../src';

initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('CCCCC');

const paths = getPathsInfo(molecule, {
  fromLabel: 'H',
  toLabel: 'H',
  minLength: 1,
  maxLength: 4,
});

console.log(paths);
