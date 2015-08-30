# es6-loader

Polyfill for the [JavaScript Loader Standard](https://whatwg.github.io/loader/).

_Caution: This repo may possibly become a polyfill for the JavaScript Loader Standard, at the moment this is just a prove of concept and **not** production ready._

## Documentation

Files to import must be precompiled with babel to get proper loaded into the system. You can run `babel src --out-dir dest` to compile all your files.

The loader can be used via package or via a global variable.

``` javascript
// use api as object
import { System } from 'es6-loader';

// or just load the polyfill to access it globally
import 'es6-loader/polyfill';
```

## Dependencies

The polyfill if dependent on [Promise](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects) and [Fetch](https://fetch.spec.whatwg.org/) api. Please make sure to include [es6-promise](jakearchibald/es6-promise) and [whatwg-fetch](https://github.com/github/fetch) Polyfills if your users might not use supported browsers.

## Examples

Load Polyfills before running your app.

``` javascript
import 'es6-loader/polyfill';

const polyfills = [];
if(!(/* test for feature1 */)) {
  polyfills.push('path/to/feature1');  
}
if(!(/* test for feature2 */)) {
  polyfills.push('path/to/feature2');  
}
Promise
  .all(polyfills.map(url => System.import(url))])
  .then(System.import('app'))
  .then(
    console.log.bind(console, 'App ready'),
    console.error.bind(console),
  );
```

Load new code after a user action to reduce the initial amount of javascript to load.

``` javascript
import 'es6-loader/polyfill';

document
  .querySelector('button')
  .addEventListener('click', () => {
    System
      .import('module')
      .then(
        module => module.initialize()
      );
  });
```
