# Changelog

## [5.16.1](https://github.com/cheminfo/openchemlib-utils/compare/v5.16.0...v5.16.1) (2024-04-16)


### Bug Fixes

* use limited number of elements for unsaturation calculation ([54f72f9](https://github.com/cheminfo/openchemlib-utils/commit/54f72f9a113f75e50edeb933ad16e20890c1bdfe))

## [5.16.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.15.0...v5.16.0) (2024-04-16)


### Features

* add hints about unsaturation ([be9490b](https://github.com/cheminfo/openchemlib-utils/commit/be9490b4787f33ea2822bd36fe167f9769649733))

## [5.15.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.14.0...v5.15.0) (2024-04-10)


### Features

* getNMRHints checks symmetry of the molecule ([df70382](https://github.com/cheminfo/openchemlib-utils/commit/df7038261428a022e4545882d905ff8653b4bdeb))

## [5.14.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.13.0...v5.14.0) (2024-04-09)


### Features

* add more NMRHints ([2d25c48](https://github.com/cheminfo/openchemlib-utils/commit/2d25c48c983b429927590219a0d40bfb39b55fcc))

## [5.13.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.12.1...v5.13.0) (2024-04-09)


### Features

* improve and rename getHints to getNMRHints ([9bf8286](https://github.com/cheminfo/openchemlib-utils/commit/9bf828626557ac9a5122134e92caa00471319cbc))

## [5.12.1](https://github.com/cheminfo/openchemlib-utils/compare/v5.12.0...v5.12.1) (2024-03-11)


### Bug Fixes

* migrate getAtoms to typescript ([#100](https://github.com/cheminfo/openchemlib-utils/issues/100)) ([afa4e4e](https://github.com/cheminfo/openchemlib-utils/commit/afa4e4e768b356e6fb90a2f667082e53908cd2eb))

## [5.12.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.11.0...v5.12.0) (2024-03-10)


### Features

* add new method getNextHint ([#97](https://github.com/cheminfo/openchemlib-utils/issues/97)) ([76b5b29](https://github.com/cheminfo/openchemlib-utils/commit/76b5b29652d0bab5431fd66bc22c727232860533))

## [5.11.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.10.0...v5.11.0) (2024-02-28)


### Features

* add option markMonomer to createPolymer ([a8c9c4a](https://github.com/cheminfo/openchemlib-utils/commit/a8c9c4a442dc7cdbd686aa5981091b09a96aaec0))

## [5.10.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.9.0...v5.10.0) (2024-02-28)


### Features

* add new method createPolymer ([cbf6730](https://github.com/cheminfo/openchemlib-utils/commit/cbf67309a4eb7369a7c0ba83ab5932377540cf41))

## [5.9.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.8.0...v5.9.0) (2024-02-10)


### Features

* add a Hash to hints ([ba03d24](https://github.com/cheminfo/openchemlib-utils/commit/ba03d24b26e735a97a5522dcb5dd229152e7b5d6))


### Bug Fixes

* rename getTips to getHints ([76bb572](https://github.com/cheminfo/openchemlib-utils/commit/76bb57222c4456c283b12f33b2f86b7fa2782d4c))

## [5.8.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.7.0...v5.8.0) (2024-01-24)


### Features

* getDiaIDsObject returns corresponding present atoms in the molecule (no implicit H) ([d53206a](https://github.com/cheminfo/openchemlib-utils/commit/d53206a25c85a0f4ff4daf29f66c9a8c5723fb6d))

## [5.7.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.6.1...v5.7.0) (2024-01-23)


### Features

* add GetDiaIDsObject ([abe7d3e](https://github.com/cheminfo/openchemlib-utils/commit/abe7d3ea22c917f1ae7488adbd8ba2bf72074b48))
* add getTips ([299d84b](https://github.com/cheminfo/openchemlib-utils/commit/299d84bb3609a62065def2e9bbe6f38e37b3e7a3))

## [5.6.1](https://github.com/cheminfo/openchemlib-utils/compare/v5.6.0...v5.6.1) (2023-12-07)


### Bug Fixes

* mapping of atoms with exploded hydrogens could fail ([da0f69b](https://github.com/cheminfo/openchemlib-utils/commit/da0f69befbc8a92a358d831970d82243888c99a6))

## [5.6.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.5.0...v5.6.0) (2023-11-27)


### Features

* TopicMolecule can map to a new molecule ([6dac09e](https://github.com/cheminfo/openchemlib-utils/commit/6dac09ef408f9e6e35cd71d3d275d425d86933bc))

## [5.5.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.4.2...v5.5.0) (2023-11-20)


### Features

* remove molfile of applyReactions to improve speed ([0dc4152](https://github.com/cheminfo/openchemlib-utils/commit/0dc4152437a90ad3e3d64865b32a181fbe9129cf))

## [5.4.2](https://github.com/cheminfo/openchemlib-utils/compare/v5.4.1...v5.4.2) (2023-11-14)


### Bug Fixes

* if searching exact we force query not to be a fragment ([c74d60c](https://github.com/cheminfo/openchemlib-utils/commit/c74d60c3ee4cb78e7c5ed211198f377ad9ab8fc5))

## [5.4.1](https://github.com/cheminfo/openchemlib-utils/compare/v5.4.0...v5.4.1) (2023-11-14)


### Bug Fixes

* copy the query before changing to fragment ([035949a](https://github.com/cheminfo/openchemlib-utils/commit/035949af829c2ddd584e29bc9e9c280b1aa7d836))

## [5.4.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.3.0...v5.4.0) (2023-10-09)


### Features

* add method getFilteredReactions ([#83](https://github.com/cheminfo/openchemlib-utils/issues/83)) ([a16c2da](https://github.com/cheminfo/openchemlib-utils/commit/a16c2dada1dce00724b92e4c4535fe827390dff7))

## [5.3.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.2.0...v5.3.0) (2023-09-26)


### Features

* add method to getMoleculeInfo ([d9ebce2](https://github.com/cheminfo/openchemlib-utils/commit/d9ebce2a4f8dbd7910af5744b0cfa83732034679))
* new Reactions class ([560f97c](https://github.com/cheminfo/openchemlib-utils/commit/560f97ceb3a5604092cf79750da2f1f0670c9182))
* new Reactions class ([560f97c](https://github.com/cheminfo/openchemlib-utils/commit/560f97ceb3a5604092cf79750da2f1f0670c9182))

## [5.2.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.1.0...v5.2.0) (2023-08-23)


### Features

* getProductsTrees in order to get products tree only when necessary ([2a680bc](https://github.com/cheminfo/openchemlib-utils/commit/2a680bce4b8333f46e779baca4dd41db3bd639a2))


### Bug Fixes

* break loop if limit is reached ([aae30c0](https://github.com/cheminfo/openchemlib-utils/commit/aae30c06457637179beb9ebe1bf9a8e147c50e6c))

## [5.1.0](https://github.com/cheminfo/openchemlib-utils/compare/v5.0.2...v5.1.0) (2023-08-23)


### Features

* add limitReactions as options for applyReactions ([e855b91](https://github.com/cheminfo/openchemlib-utils/commit/e855b91c1d17ea5e50b70a5c6b2b0eed946f5932))


### Documentation

* fix examples ([21c8fbe](https://github.com/cheminfo/openchemlib-utils/commit/21c8fbebd693074807916e607f88579ba477e5a1))

## [5.0.2](https://github.com/cheminfo/openchemlib-utils/compare/v5.0.1...v5.0.2) (2023-08-18)


### Bug Fixes

* missing docs and undo digits rounding ([5d859e0](https://github.com/cheminfo/openchemlib-utils/commit/5d859e041fc168494c83e3b04278f6b540efd737))

## [5.0.1](https://github.com/cheminfo/openchemlib-utils/compare/v5.0.0...v5.0.1) (2023-08-18)


### Bug Fixes

* formatting ([21e2912](https://github.com/cheminfo/openchemlib-utils/commit/21e291292767eae01e9c05122d1835c071bc18d8))

## [5.0.0](https://github.com/cheminfo/openchemlib-utils/compare/v4.4.0...v5.0.0) (2023-08-17)


### ⚠ BREAKING CHANGES

* remove non significant digits

### Bug Fixes

* prettier format ([eefbc64](https://github.com/cheminfo/openchemlib-utils/commit/eefbc641e0d2c35f64a9938c0c91aaf434541f3c))
* remove non significant digits ([3136a95](https://github.com/cheminfo/openchemlib-utils/commit/3136a955700f1aedae4eb8991551a297b0cb9782))

## [4.4.0](https://github.com/cheminfo/openchemlib-utils/compare/v4.3.2...v4.4.0) (2023-08-17)


### Features

* groupTreesByProducts ([828c02d](https://github.com/cheminfo/openchemlib-utils/commit/828c02d12c9abc3df2a242838d8e8f476edacce8))

## [4.3.2](https://github.com/cheminfo/openchemlib-utils/compare/v4.3.1...v4.3.2) (2023-08-17)


### Documentation

* correctly build documentation from index.js ([bdc0721](https://github.com/cheminfo/openchemlib-utils/commit/bdc07215bf2d8d94b1075c48163661468b1557e1))

## [4.3.1](https://github.com/cheminfo/openchemlib-utils/compare/v4.3.0...v4.3.1) (2023-08-17)


### Bug Fixes

* correctly rename type DiaIDAndH to DiaIDAndInfo ([f38ea28](https://github.com/cheminfo/openchemlib-utils/commit/f38ea28870a147e10b73a03f3761209b87afc4bc))

## [4.3.0](https://github.com/cheminfo/openchemlib-utils/compare/v4.2.1...v4.3.0) (2023-08-16)


### Features

* add getImplicityHydrogensCount and toggleHydrogens ([33ded8d](https://github.com/cheminfo/openchemlib-utils/commit/33ded8d3943a5e1c6ce745cb4d61da9a6db99a74))
* Create TopicMolecule a class optimised for hoses codes and diastereotopic IDs ([633d618](https://github.com/cheminfo/openchemlib-utils/commit/633d618a793da62b2473c13df60d3c49f179617b))
* Create TopicMolecule a class optimised for hoses codes and diastereotopic IDs ([633d618](https://github.com/cheminfo/openchemlib-utils/commit/633d618a793da62b2473c13df60d3c49f179617b))

## [4.2.1](https://github.com/cheminfo/openchemlib-utils/compare/v4.2.0...v4.2.1) (2023-08-09)


### Bug Fixes

* return correctly diaIDs=undefined in getHoseCodesAndInfo=false ([4328552](https://github.com/cheminfo/openchemlib-utils/commit/43285528c51a7298e2270bee64ca73d1e733df92))

## [4.2.0](https://github.com/cheminfo/openchemlib-utils/compare/v4.1.0...v4.2.0) (2023-08-08)


### Features

* add distanceMatrix in getHoseCodesAndInfo ([9351a59](https://github.com/cheminfo/openchemlib-utils/commit/9351a596667b6749a3f0423baf6d519fbaa7ff9d))

## [4.1.0](https://github.com/cheminfo/openchemlib-utils/compare/v4.0.0...v4.1.0) (2023-08-06)


### Features

* getHoseCodesAndInfo returns moleculeWithHydrogens ([f9ff5bd](https://github.com/cheminfo/openchemlib-utils/commit/f9ff5bd424b7ffc006a9657b1db676f2e2f76fe9))

## [4.0.0](https://github.com/cheminfo/openchemlib-utils/compare/v3.1.0...v4.0.0) (2023-08-06)


### ⚠ BREAKING CHANGES

* replace getHosesAndInfoFromMolfile and getHoseCodesAndDiastereotopicIDs by  getHoseCodesAndInfo

### Features

* replace getHosesAndInfoFromMolfile and getHoseCodesAndDiastereotopicIDs by  getHoseCodesAndInfo ([a3bc686](https://github.com/cheminfo/openchemlib-utils/commit/a3bc686dd2d7f121f1e7537012be702b49818ba3))

## [3.1.0](https://github.com/cheminfo/openchemlib-utils/compare/v3.0.0...v3.1.0) (2023-08-02)


### Features

* add method getHosesAndInfoFromMolfile ([3d5a25a](https://github.com/cheminfo/openchemlib-utils/commit/3d5a25acf319f00d8d77b85246ee838336f17d24))


### Bug Fixes

* getHoseCodes shares code with getHoseCodesForAtoms ([e037133](https://github.com/cheminfo/openchemlib-utils/commit/e037133c9c83ef929f3c5422d5bf8ba4c411b9d1))
* nodejs workflow ([18532b0](https://github.com/cheminfo/openchemlib-utils/commit/18532b0a2b6fe794c97b434783c8b738bb1637f8))
* recalculate helper after makeRacemic ([3cf35a8](https://github.com/cheminfo/openchemlib-utils/commit/3cf35a8f2335ff9c55a678139103113a5969d310))

## [3.0.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.9.0...v3.0.0) (2023-07-31)


### ⚠ BREAKING CHANGES

* add ensureHeterotopicChiralBonds and remove addDiastereotopicMissingChirality

### Features

* add ensureHeterotopicChiralBonds and remove addDiastereotopicMissingChirality ([c846f5d](https://github.com/cheminfo/openchemlib-utils/commit/c846f5d0e499a7eff2a7a96ef80a331369cb5d3f))
* add getHoseCodes, fast code to retrieve all the hose codes ([dfef04e](https://github.com/cheminfo/openchemlib-utils/commit/dfef04ef65ec2e88dc2c43278b1a0a7585bc5a56))
* fast method to get the list of all the chiral or heterotopic carbons ([45c3019](https://github.com/cheminfo/openchemlib-utils/commit/45c3019d5b42e9b19b7dfd1fa021efc405634d73))


### Bug Fixes

* add chirality bonds if H are present ([0aae9fc](https://github.com/cheminfo/openchemlib-utils/commit/0aae9fca10ad5d9104afa4ecf5916a3e3f8db3b4))


### Documentation

* replace oclCode by idCode ([b3e4b6e](https://github.com/cheminfo/openchemlib-utils/commit/b3e4b6e070e8b6f1f4583fb8d5e75ad6c1e32505))

## [2.9.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.8.0...v2.9.0) (2023-07-26)


### Features

* add getProperties ([073c67e](https://github.com/cheminfo/openchemlib-utils/commit/073c67eafa978cd91a1c71ba7cd40c322c8f6423))
* get em and charge for products ([#59](https://github.com/cheminfo/openchemlib-utils/issues/59)) ([9eb9788](https://github.com/cheminfo/openchemlib-utils/commit/9eb9788a5774cdfd6940ab2bdc093d21d2c55459))


### Bug Fixes

* do not add undefined property in search result ([a7aa4af](https://github.com/cheminfo/openchemlib-utils/commit/a7aa4afb8a865f2b47c848e5bebd9eea63a30dbd))

## [2.8.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.7.1...v2.8.0) (2023-07-25)


### Features

* add appendEntries ([801f284](https://github.com/cheminfo/openchemlib-utils/commit/801f2840d3a6ac38fe19e24d28f5628f3c156bfe))
* add getCharge ([0ea8f66](https://github.com/cheminfo/openchemlib-utils/commit/0ea8f6690478e8b9f6934253c7113ce31a604ef7))
* allow to search by smarts ([9800ad9](https://github.com/cheminfo/openchemlib-utils/commit/9800ad935d3ab4fde49dd1969ac9a58bb9f63500))

## [2.7.1](https://github.com/cheminfo/openchemlib-utils/compare/v2.7.0...v2.7.1) (2023-07-18)


### Bug Fixes

* test case check if works when needToBeCharged is not defined ([9897cc8](https://github.com/cheminfo/openchemlib-utils/commit/9897cc854f6e945d1d410014272ba48b85ae2ae1))

## [2.7.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.6.0...v2.7.0) (2023-07-17)


### Features

* add prop in applyReactions to groupTreesByProducts ([#52](https://github.com/cheminfo/openchemlib-utils/issues/52)) ([dd8e62d](https://github.com/cheminfo/openchemlib-utils/commit/dd8e62de0834b6953c2a0a0caa9f28c55a0309cd))

## [2.6.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.5.0...v2.6.0) (2023-07-13)


### Features

* add getAtoms method ([822d7b2](https://github.com/cheminfo/openchemlib-utils/commit/822d7b2a804a3df1b90e05e53d99982f3371d7d6))

## [2.5.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.4.0...v2.5.0) (2023-07-12)


### Features

* add nbLabileH ([b1a090c](https://github.com/cheminfo/openchemlib-utils/commit/b1a090c113027e7f127247f677c6d6b61e86034e))

## [2.4.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.3.0...v2.4.0) (2023-02-13)


### Features

* getAtomFeatures allows to specify sphere ([43068ae](https://github.com/cheminfo/openchemlib-utils/commit/43068ae7988707c5cc4b926a21d003c5da4e2761))


### Bug Fixes

* applyReaction should not return oclReaction internal object ([10dadc7](https://github.com/cheminfo/openchemlib-utils/commit/10dadc716c1d64de71a6a84a2c58a102667dd5a9))

## [2.3.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.2.0...v2.3.0) (2023-01-25)


### ⚠ BREAKING CHANGES

* Remove compatibility with node 14

### Features

* add parseDwar, parser for DataWarrior files ([107b4f3](https://github.com/cheminfo/openchemlib-utils/commit/107b4f319016321952612287c0e7661b39a78b0f))
* improve applyReactions to have maxDepth ([217db99](https://github.com/cheminfo/openchemlib-utils/commit/217db99a94837d40a0c6e07a3a0698ac241401c2))


### Miscellaneous Chores

* Remove compatibility with node 14 ([1635eeb](https://github.com/cheminfo/openchemlib-utils/commit/1635eeb8f7021cfc7212e3aaeb0b248b744d5deb))


### release-as

* 2.3.0 ([81004d4](https://github.com/cheminfo/openchemlib-utils/commit/81004d43f138ebee9ae6f39a0cbb7fd9bede79cc))

## [2.2.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.1.3...v2.2.0) (2023-01-17)


### Features

* crease searchAsync ([#49](https://github.com/cheminfo/openchemlib-utils/issues/49)) ([7800d90](https://github.com/cheminfo/openchemlib-utils/commit/7800d90e649de5f9d61306ad17d727317383b953))


### Documentation

* add OCL types ([7892125](https://github.com/cheminfo/openchemlib-utils/commit/7892125aa054941ba4e4aaaf1dc8fe8065c55f01))

## [2.1.3](https://github.com/cheminfo/openchemlib-utils/compare/v2.1.2...v2.1.3) (2022-12-15)


### Bug Fixes

* update dependencies ([1ca9c69](https://github.com/cheminfo/openchemlib-utils/commit/1ca9c690d4a17cdac022c61daaadc5952967d5dc))


### Documentation

* improve jsDoc ([7c80d68](https://github.com/cheminfo/openchemlib-utils/commit/7c80d686f2b665f7ff6f5fdf49cce6a5fc665848))

## [2.1.2](https://github.com/cheminfo/openchemlib-utils/compare/v2.1.1...v2.1.2) (2022-11-28)


### Bug Fixes

* split groupedDiastereotopicAtomIDs ([#42](https://github.com/cheminfo/openchemlib-utils/issues/42)) ([8e1ee5a](https://github.com/cheminfo/openchemlib-utils/commit/8e1ee5a7684871a6086e98bc0ffd0c130a57dbc3))

## [2.1.1](https://github.com/cheminfo/openchemlib-utils/compare/v2.1.0...v2.1.1) (2022-11-23)


### Bug Fixes

* getConnectivityMatrix with pathLength ([#44](https://github.com/cheminfo/openchemlib-utils/issues/44)) ([0363399](https://github.com/cheminfo/openchemlib-utils/commit/0363399b060f1cb17ab10dede5894d6a9dff8398))

## [2.1.0](https://github.com/cheminfo/openchemlib-utils/compare/v2.0.0...v2.1.0) (2022-11-14)


### Features

* add getDiastereotopicAtomIDsFromMolfile ([05950e9](https://github.com/cheminfo/openchemlib-utils/commit/05950e9b45d37eb54240865c67b23251b9ad278c))
* getDiastereotopicAtomIDsFromMolfile ([1bc20c8](https://github.com/cheminfo/openchemlib-utils/commit/1bc20c812815055326502eaca4ba6b41c79d83d9))


### Documentation

* add example of substructure search in wikipedia ([c4d27e9](https://github.com/cheminfo/openchemlib-utils/commit/c4d27e937520e608cdc0d3453b5273b2657f2e99))
* add one jsdoc ([5a1226b](https://github.com/cheminfo/openchemlib-utils/commit/5a1226b9100881745fb156993534f6d80b798c95))

## [2.0.0](https://github.com/cheminfo/openchemlib-utils/compare/v1.11.0...v2.0.0) (2022-08-15)


### ⚠ BREAKING CHANGES

* update OpenChemLib to v8.0.0
* remove deprecated function getExtendedDiastereotopicAtomIDs

### Features

* null query returns the full DB ([4279051](https://github.com/cheminfo/openchemlib-utils/commit/4279051c118579564597f4a0db6babb12acea32f))
* update OpenChemLib to v8.0.0 ([09c88c4](https://github.com/cheminfo/openchemlib-utils/commit/09c88c45df6c5603ebcfc7cd67985863529d0ae6))


### Miscellaneous Chores

* remove deprecated function getExtendedDiastereotopicAtomIDs ([09c88c4](https://github.com/cheminfo/openchemlib-utils/commit/09c88c45df6c5603ebcfc7cd67985863529d0ae6))

## [1.11.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.10.0...v1.11.0) (2022-04-19)


### Features

* add getAtomFeatures ([9ecde24](https://www.github.com/cheminfo/openchemlib-utils/commit/9ecde24496aa48ef4eee3a28c4ba570ce9ed9ef3))

## [1.10.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.9.0...v1.10.0) (2022-03-25)


### Features

* add getPathAndTorsion ([8c587c8](https://www.github.com/cheminfo/openchemlib-utils/commit/8c587c8fd15f9a27e0e2e21c3659f0abab6e262e))
* add options withHOSES (defualt false) to getPathsInfo ([1af6b9e](https://www.github.com/cheminfo/openchemlib-utils/commit/1af6b9ef1b15ce63da91ca247e81d8e134112643))

## [1.9.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.8.0...v1.9.0) (2022-02-15)


### Features

* add nbOH ([27cc29a](https://www.github.com/cheminfo/openchemlib-utils/commit/27cc29a5147511772357c7b9e51f60708ae2ba65))
* groups numbers inside molecule ([b5fce46](https://www.github.com/cheminfo/openchemlib-utils/commit/b5fce46e5f699f423e0b600f5c2cc3416b4b5b38))


### Bug Fixes

* groups are counted only if they have at least one C or H as neig… ([#32](https://www.github.com/cheminfo/openchemlib-utils/issues/32)) ([4f2df84](https://www.github.com/cheminfo/openchemlib-utils/commit/4f2df84fadad9561d02b8f6b7690a5056cc14a8c))

## [1.8.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.7.0...v1.8.0) (2021-12-14)


### Features

* add getHoseCodesForAtoms ([b0f2b6b](https://www.github.com/cheminfo/openchemlib-utils/commit/b0f2b6bf2dab7e6a184225eb27612aa89f659ddb))

## [1.7.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.6.0...v1.7.0) (2021-12-14)


### Features

* add getHoseCodesForPath ([3584377](https://www.github.com/cheminfo/openchemlib-utils/commit/358437790716b6dcf7bb2e197d8702956061e9a0))


### Bug Fixes

* getMF return type ([7ac70ea](https://www.github.com/cheminfo/openchemlib-utils/commit/7ac70ea2a0a4be3296a6f682e87fd082892b1d56))
* rename SimpleBonds to SingleBonds ([d2ff8ed](https://www.github.com/cheminfo/openchemlib-utils/commit/d2ff8ed4001ded1678e04570219ca408c530962f))

## [1.6.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.5.1...v1.6.0) (2021-10-14)


### Features

* update dependencies ([00bae71](https://www.github.com/cheminfo/openchemlib-utils/commit/00bae71d7648362256eaefb4eb20525afe94e31b))

### [1.5.1](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.5.0...v1.5.1) (2021-08-29)


### Bug Fixes

* add package description ([b1d726b](https://www.github.com/cheminfo/openchemlib-utils/commit/b1d726b3835c2423c4d4a7105bcf74f6a822d8d1))

## [1.5.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.4.0...v1.5.0) (2021-08-04)


### Features

* add appendColor in MoleculesDB ([bde1b8f](https://www.github.com/cheminfo/openchemlib-utils/commit/bde1b8faccf6c047807c1e27da824475e1653983))

## [1.4.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.3.0...v1.4.0) (2021-08-03)


### Features

* appendSmiles text file for Molecules DB ([62365c6](https://www.github.com/cheminfo/openchemlib-utils/commit/62365c6845331e8e4356178e3443163956efaa48))

## [1.3.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.2.0...v1.3.0) (2021-07-29)


### Features

* add fragmentAcyclicSimpleBonds ([093b7dc](https://www.github.com/cheminfo/openchemlib-utils/commit/093b7dc523453df038eaa04145aa9d60d795236a))


### Bug Fixes

* toVisualizerMolfile still contained a this ([b5c0eb7](https://www.github.com/cheminfo/openchemlib-utils/commit/b5c0eb7e0abc16d0072ad1e258b439950a645071))
* update dependencies ([29a7253](https://www.github.com/cheminfo/openchemlib-utils/commit/29a7253427ce9cec79d7a529fe16b8190bab40f5))

## [1.2.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.1.0...v1.2.0) (2021-05-11)


### Features

* add toVisualizerMolfile ([3d8ee95](https://www.github.com/cheminfo/openchemlib-utils/commit/3d8ee950fa281c64b01d14c4adbd21fed7726e39))

## [1.1.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v1.0.0...v1.1.0) (2021-05-10)


### Features

* add MoleculesDB to store and search molecules ([da7cbc9](https://www.github.com/cheminfo/openchemlib-utils/commit/da7cbc9eb47f6232d566f98206c1df362faeb852))

## [1.0.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v0.7.1...v1.0.0) (2021-03-24)


### ⚠ BREAKING CHANGES

* 

### Features

* combineSmiles requires to pass OCL ([aa9218a](https://www.github.com/cheminfo/openchemlib-utils/commit/aa9218ad530d5a1a98d90d7215c97e7ed4e35edb))
* getHoseCodesFromDiastereotopicID requires an OCL.Molecule ([00b8845](https://www.github.com/cheminfo/openchemlib-utils/commit/00b8845682c86dfb45cafc3c195840f285c783c4))


### Bug Fixes

* add openchemlib to peer dependencies ([c856127](https://www.github.com/cheminfo/openchemlib-utils/commit/c8561273dc0a224a03949853ace5067c03ecc0e9))

### [0.7.1](https://www.github.com/cheminfo/openchemlib-utils/compare/v0.7.0...v0.7.1) (2021-03-24)


### Bug Fixes

* use molecule.getOCL where possible ([936c791](https://www.github.com/cheminfo/openchemlib-utils/commit/936c791a5d393fc4c3aa1372418a29c270d0e5f9))

## [0.7.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v0.6.1...v0.7.0) (2021-03-01)


### Features

* allow to initOCL with keepExisting option ([6f9049a](https://www.github.com/cheminfo/openchemlib-utils/commit/6f9049aaad5416d4beeb117eafe680108d67d2ec))

### [0.6.1](https://www.github.com/cheminfo/openchemlib-utils/compare/v0.6.0...v0.6.1) (2021-01-17)


### Bug Fixes

* correctly export combineSmiles ([a8354c3](https://www.github.com/cheminfo/openchemlib-utils/commit/a8354c37df48ef3648ca36d1c500c954d067dd60))

## [0.6.0](https://www.github.com/cheminfo/openchemlib-utils/compare/v0.5.3...v0.6.0) (2021-01-17)


### Features

* add combineSmiles ([87bad19](https://www.github.com/cheminfo/openchemlib-utils/commit/87bad1943f121b9400646b39714fa15885e3602d))
* add complexity options in combineSmiles ([e54072e](https://www.github.com/cheminfo/openchemlib-utils/commit/e54072e22a0bac34690f7d856ef741e86d47c67e))


### Bug Fixes

* Correct readme example ([d22f119](https://www.github.com/cheminfo/openchemlib-utils/commit/d22f1193d51f0ce4d2aa2cec14c127931200b43b))

### [0.5.3](https://www.github.com/cheminfo/openchemlib-utils/compare/v0.5.2...v0.5.3) (2020-10-28)


### Bug Fixes

* release from github actions ([5fc49da](https://www.github.com/cheminfo/openchemlib-utils/commit/5fc49dad3bfe64366985647a40972ca999219d2d))

### [0.5.2](https://github.com/cheminfo/openchemlib-utils/compare/v0.5.1...v0.5.2) (2020-10-28)

## [0.5.1](https://github.com/cheminfo/openchemlib-utils/compare/v0.5.0...v0.5.1) (2020-09-09)


### Bug Fixes

* allow to call initOCL multiple times with the same OCL ([843a4c6](https://github.com/cheminfo/openchemlib-utils/commit/843a4c6fd9c24dbcef61769f6fa4cf3e0bc0cbd0))



# [0.5.0](https://github.com/cheminfo/openchemlib-utils/compare/v0.4.0...v0.5.0) (2020-06-28)


### Features

* add getGroupedDiastereotopicAtomIDs ([fef69d7](https://github.com/cheminfo/openchemlib-utils/commit/fef69d71bf2b5d3935229fe18c7f0792ab5571b6))



# [0.4.0](https://github.com/cheminfo/openchemlib-utils/compare/v0.3.0...v0.4.0) (2020-05-08)


### Features

* add heavy atom in getDiastereotopicAtomIDsAndH ([9920a0b](https://github.com/cheminfo/openchemlib-utils/commit/9920a0b990eb1a9266b972dae75753ffb7e3ae66))



# [0.3.0](https://github.com/cheminfo/openchemlib-utils/compare/v0.2.1...v0.3.0) (2020-02-21)


### Features

* add negative atomicNo option ([44f812f](https://github.com/cheminfo/openchemlib-utils/commit/44f812fbd237240592f89485e4f39e655af6281b))
* add sdta for getConnectivityMatrix ([9fe9640](https://github.com/cheminfo/openchemlib-utils/commit/9fe9640f4e5ab23e2f5837249eff528a2da8bdd6))



## 0.0.1 (2020-01-21)


### Bug Fixes

* fix build with new version of ml-floyd-warshall ([a530c8e](https://github.com/cheminfo/openchemlib-utils/commit/a530c8ef0d9a99455bbc4053325be50864d136d2))
* getHoseCodesforPath ([c121973](https://github.com/cheminfo/openchemlib-utils/commit/c1219736b169cc5ce4ce0e580e29f2a8584b5a12))
