# system loader [![build status][1]][2] [![Coverage Status][3]][4]

A module loader for the browser inspired by the [JavaScript Loader Standard](https://whatwg.github.io/loader/).

_Caution: This repo may become close to the JavaScript Loader Standard, at the moment this is just a prove of concept and **not** a polyfill._

## Documentation

Files to import must be transpiled with babel when written in ES2015 and above to get proper loaded into the system. You can run `babel src --out-dir dest` to transpile all your files.

The loader can be loaded via package.

``` javascript
// get a System object
import * as System from 'system-loader';
```

## Dependencies

The loader is dependent on [Promise](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-promise-objects), [Fetch](https://fetch.spec.whatwg.org/) and [Map](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-map-constructor) api. Please make sure to include [es6-promise](https://github.com/jakearchibald/es6-promise), [whatwg-fetch](https://github.com/github/fetch) and [es6-collections](https://github.com/WebReflection/es6-collections) Polyfills if your users might not use supported browsers.

## Examples

Load Polyfills before stating your app.

``` javascript
import * as System from 'system-loader';

const polyfills = [];
if(!(/* test for feature1 */)) {
  polyfills.push('./path/to/feature1');  
}
if(!(/* test for feature2 */)) {
  polyfills.push('./path/to/feature2');  
}
Promise
  .all(polyfills.map(url => System.import(url))])
  .then(System.import('./app'))
  .then(
    console.log.bind(console, 'App ready'),
    console.error.bind(console),
  );
```

Load new code after an interaction of the user to load JavaScript when needed and reduce the initial load time of your app.

``` javascript
import * as System from 'system-loader';

document
  .querySelector('button')
  .addEventListener('click', () => {
    System
      .import('./module')
      .then(
        module => module.initialize()
      );
  });
```

## Contributing

Contributions in form of filling bug reports, add pull requests or give feedback are highly welcome.

Please make sure that your pull requests pass all tests (`npm test`) and the linting rules are respected.


[1]: https://travis-ci.org/garthenweb/system-loader.svg
[2]: https://travis-ci.org/garthenweb/system-loader
[3]: https://coveralls.io/repos/garthenweb/system-loader/badge.svg?branch=master&service=github
[4]: https://coveralls.io/github/garthenweb/system-loader?branch=master
