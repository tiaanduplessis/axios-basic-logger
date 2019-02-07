
# axios-basic-logger
[![package version](https://img.shields.io/npm/v/axios-basic-logger.svg?style=flat-square)](https://npmjs.org/package/axios-basic-logger)
[![package downloads](https://img.shields.io/npm/dm/axios-basic-logger.svg?style=flat-square)](https://npmjs.org/package/axios-basic-logger)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![package license](https://img.shields.io/npm/l/axios-basic-logger.svg?style=flat-square)](https://npmjs.org/package/axios-basic-logger)
[![make a pull request](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![Greenkeeper badge](https://badges.greenkeeper.io/tiaanduplessis/axios-basic-logger.svg)](https://greenkeeper.io/)

> Axios logging interceptors

## Table of Contents

- [axios-basic-logger](#axios-basic-logger)
  - [Table of Contents](#table-of-contents)
  - [Install](#install)
  - [Usage](#usage)
  - [Contribute](#contribute)
  - [License](#license)

## Install

This project uses [node](https://nodejs.org) and [npm](https://www.npmjs.com). 

```sh
$ npm install axios-basic-logger
$ # OR
$ yarn add axios-basic-logger
```

## Usage

```js
import axios from "axios";
import useLogger from "axios-basic-logger";

useLogger(axios);

axios
  .get("https://jsonplaceholder.typicode.com/todos")
  .then(() => console.log("ja"));

// REQUEST  10:35:16:244 GET https://jsonplaceholder.typicode.com/todos 
// RESPONSE 10:35:16:283 200 (GET https://jsonplaceholder.typicode.com/todos) 39ms 
// ja
```

## Contribute

1. Fork it and create your feature branch: `git checkout -b my-new-feature`
2. Commit your changes: `git commit -am "Add some feature"`
3. Push to the branch: `git push origin my-new-feature`
4. Submit a pull request

## License

MIT
    