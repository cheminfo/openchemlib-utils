# Changelog

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
