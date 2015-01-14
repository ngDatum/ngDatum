
# Project Name: ngDatum

>  Making data look easy in Angularjs!

>  The goal of this project is to create a directive-based approach for easing the creation of common graphs and charts with d3.





##  Team

  - __Development Team Members__: 
[Brian Schermerhorn](https://github.com/elderbas), [Patrick McPike](https://github.com/mcpike)

## Table of Contents

1. [Team](#team)
1. [Usage](#Usage)
1. [Dependencies](#dependencies)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Running the Development environment](#running-the-development-environment)
    1. [Applying changes to production file](#applying-changes-to-production-file)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)

## Usage

> coming soon.

## Dependencies

- Angular.js (1.2+)
- d3.js (v3)


## Development

### Installing Dependencies

The development environment requires [node.js](http://nodejs.org/).  For installation details, see [here](http://nodejs.org/download/)

From within the root directory:

```sh
$ npm install
```

### Running the development environment

From within the root directory:

```sh
$ grunt watch:dev
```

This will launch a grunt task that will watch for changes to *.js files in the /src directory.  Any changes will initiate JSHint syntax checking.

### Applying changes to production file

From within the root directory:

```sh
$ grunt
```

This will launch a grunt task that will initiate JSHint syntax checking against *.js files in the /src directory.  Then publish concatated and uglified versions to the /dist directory.  


## Roadmap

View the project roadmap [here](https://github.com/ngDatum/ngDatum/issues)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.