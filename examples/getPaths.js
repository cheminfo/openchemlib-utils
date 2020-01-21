// run with `node -r esm ./getPathsInfo.js`

import OCL from 'openchemlib';

import { Path, initOCL } from '../src';

initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('CCCCC');

const paths = Path.getPathsInfo(molecule, {
  fromLabel: 'H',
  toLabel: 'H',
  minLength: 1,
  maxLength: 4,
});

console.log(paths);
