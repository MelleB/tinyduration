
# TinyDuration
A small javascript package to parse and serialize ISO-8601 durations.
This package does only 2 things:
 1. It parses a duration string to an object
    - (e.g. `P1DT12H` to `{ days: 1, hours: 12 }`)
 2. The reverse, i.e. serialize an object to a string.

 ![Node.js CI](https://github.com/MelleB/tinyduration/workflows/Node.js%20CI/badge.svg)

This lib has 0 dependencies.

## Installation
- NPM: `npm install --save tinyduration`
- Yarn: `yarn add tinyduration`

## Usage
```js
import { parse, serialize } from 'tinyduration';

// Basic parsing
const durationObj = parse('P1Y2M3DT4H5M6S');
assert(durationObj, {
    years: 1,
    months: 2,
    days: 3,
    hours: 4,
    minutes: 5,
    seconds: 6
});

// Serialization
assert(serialize(durationObj), 'P1Y2M3DT4H5M6S');
```

## Development
This library is written in [TypeScript](https://typescriptlang.org).
During publication of the package, the code is transpiled to javascript and put into the `dist` folder.

The tests can be found the `src` folder under `*.test.ts`, testing is done using [Jest](https://jestjs.io)

Additional commands you'll need for development:
- `yarn test` to run all tests
- `yarn lint` to run the linter
- `yarn prettify` to auto-fix the indenting issues
- `yarn ci` to run coverage and linting


# API
## *Type:* Duration
|Property|Type|Description|
|-|-|-|
|negative|`boolean` or `undefined`|Duration is positive if undefined
|years|`number` or `undefined`||
|months|`number` or `undefined`||
|weeks|`number` or `undefined`||
|days|`number` or `undefined`||
|hours|`number` or `undefined`||
|minutes|`number` or `undefined`||
|seconds|`number` or `undefined`||


## *Function:* parse(string): Duration
`parse` accepts a string and returns a `Duration` object.

No attempt is made to change lower units into higher ones, e.g. to change 120 minutes into 2 hours.

**Throws** `InvalidDurationError` if an invalid duration string is supplied.

```js
import { parse } from 'tinyduraion';

const duration = parse('P1W');
assert(duration, { weeks: 1 })

try {
    parse('invalid-duration');
} catch (e) {
    assert(e.message === 'Invalid duration')
}
```

## *Function:* serialize(Duration): string
`serialize` accepts a Duration object and returns a serialized duration according to ISO-8601.

If the duration is empty (i.e. all values are 0), `PT0S` is returned.

```js
import * as Duration from 'tinyduraion';

const durationStr = Duration.serialize({ weeks: 1 });
assert(durationStr, 'P1W')

const durationStr = Duration.serialize({});
assert(durationStr, 'PT0S')
```

# License
MIT
