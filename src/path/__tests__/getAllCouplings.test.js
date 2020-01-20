'use strict';

const OCLE = require('../../../..');
const getAllCouplings = require('../getAllCouplings');

const molfile = `CCC
JME 2017-03-21 Wed Jun 14 14:53:08 GMT+200 2017

 11 10  0  0  0  0  0  0  0  0999 V2000
   -0.1232    0.7436   -0.4151 C   0  0  0  0  0  0  0  0  0  0  0  0
    1.0515    0.3612    0.4948 C   0  0  0  0  0  0  0  0  0  0  0  0
    2.3644    0.3884   -0.2987 C   0  0  0  0  0  0  0  0  0  0  0  0
    3.1833    0.1175    0.3527 H   0  0  0  0  0  0
    2.3078   -0.3162   -1.1167 H   0  0  0  0  0  0
    2.5303    1.3822   -0.6904 H   0  0  0  0  0  0
    1.1135    1.0640    1.3137 H   0  0  0  0  0  0
    0.8912   -0.6329    0.8877 H   0  0  0  0  0  0
   -1.0412    0.7208    0.1550 H   0  0  0  0  0  0
    0.0315    1.7390   -0.8073 H   0  0  0  0  0  0
   -0.1910    0.0406   -1.2336 H   0  0  0  0  0  0
  1  2  1  0  0  0  0
  2  3  1  0  0  0  0
  3  4  1  0  0  0
  3  5  1  0  0  0
  3  6  1  0  0  0
  2  7  1  0  0  0
  2  8  1  0  0  0
  1  9  1  0  0  0
  1 10  1  0  0  0
  1 11  1  0  0  0
M  END`;

describe('test getAllCouplings', () => {
  it('from CCC', () => {
    let molecule = OCLE.Molecule.fromMolfile(molfile);
    let result = getAllCouplings(molecule, {});
    expect(result).toHaveLength(5);

    expect(result).toMatchSnapshot();
  });
});
