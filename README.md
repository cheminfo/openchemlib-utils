# openchemlib-utils

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![npm download][download-image]][download-url]

.

## Installation

`$ npm i openchemlib-utils`

## Usage

```js
import OCL from 'openchemlib'; // version should be greater than 7.4

import { getPathsInfo, initOCL } from 'openchemlib-utils';
initOCL(OCL);

const molecule = OCL.Molecule.fromSmiles('CCCCC');

const paths = getPathsInfo(molecule, {
  fromLabel: 'H',
  toLabel: 'H',
  minLength: 1,
  maxLength: 4,
});

console.log(paths);
```

We will add more examples in `/examples`.

## [API Documentation](https://cheminfo.github.io/openchemlib-utils/)

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/openchemlib-utils.svg
[npm-url]: https://www.npmjs.com/package/openchemlib-utils
[ci-image]: https://github.com/cheminfo/openchemlib-utils/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/openchemlib-utils/actions?query=workflow%3A%22Node.js+CI%22
[download-image]: https://img.shields.io/npm/dm/openchemlib-utils.svg
[download-url]: https://www.npmjs.com/package/openchemlib-utils
