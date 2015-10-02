import { responseToText, getStackPaths, isRelativePath } from './helper';

/**
 * Cache for loaded modules
 * @type {Map}
 */
const ModuleStore = new Map();

/**
 * reads a codeblock to return its required files
 * @param  {string} moduleCode Code to get required files from
 * @return {array}             List of required files
 */
function getRequiredFilesFromCode(moduleCode) {
  const regex = /require\(['|"](.*)['|"]\)/gmi;
  const files = [];
  let match = regex.exec(moduleCode);
  while (match) {
    files.push(match[1]);
    match = regex.exec(moduleCode);
  }
  return files;
}

/**
 * resolves the file path into a unified form
 * @param  {string} url      Url to resolve
 * @param  {string} referrer The referrer the url was called from.
 *                           This is important to resolve relative urls
 * @return {string}          Normalized url
 */
function normalizeURL(url, referrer) {
  let dirtyPath = url;
  const a = document.createElement('a');
  if (isRelativePath(url)) {
    // when starting with a dot it is a relative path
    const filenameStartIndex = referrer.lastIndexOf('/');
    const executingLocation = referrer.substr(0, filenameStartIndex);
    dirtyPath = executingLocation + '/' + url;
    console.warn(`Relative path was detected ´${url}´. After concatenating files, relative path can become inaccessible.`);
  }

  a.href = dirtyPath;

  // href attribute will now be the beautyfied version resolved by the browser
  return a.href;
}

/**
 * Executes a code block of code and returns its exports
 * @param  {string} moduleCode code to execute
 * @param  {string} referrer   The referrer the code was executed from.
 *                             This is important to resolve paths of required
 *                             modules within the code
 * @return {Object}            Exported values from exports
 */
function execute(moduleCode, referrer) {
  const oldRequire = window.require;
  window.require = function requireFromCache(name) {
    const normalizedURL = normalizeURL(name, referrer);
    return ModuleStore.get(normalizedURL);
  };
  const evalStr = `
    (function() {
      var exports = {};
      var module = { exports: exports };

      ${moduleCode};

      return module.exports;
    })();
  `;

  const ret = eval.call(window, evalStr);
  window.require = oldRequire;

  return ret;
}

/**
 * Takes a codeblock, loads all of its dependencies and executes it
 * @param  {string} moduleCode Code to execute
 * @param  {string} referrer   The referrer the code was executed from.
 *                             This is important to resolve paths of required
 *                             modules within the code
 * @return {Promise}           Resolves with the return value of the code block
 */
function loadAndExecute(moduleCode, referrer) {
  // get all inner modules
  const innerModules = getRequiredFilesFromCode(moduleCode);
  // load all inner modules so that they are cached
  return Promise
    .all(
      innerModules.map(module => importWithReferrer(module, referrer))
    )
    // then execute modules
    .then(() => execute(moduleCode, referrer));
}

/**
 * Imports a module from its url with an referrer if provided to resolve
 * relative path names
 * @param  {string} url      Url to resolve
 * @param  {string} referrer The referrer the url was called from.
 *                           This is important to resolve relative urls
 * @return {Promise}         A Promise that resolves when the module was loaded
 *                           and executed.
 */
function importWithReferrer(url, referrer) {
  const normalizedURL = normalizeURL(url, referrer);
  if (ModuleStore.has(normalizedURL)) {
    return Promise.resolve(ModuleStore.get(normalizedURL));
  }

  return window.fetch(normalizedURL)
    .then(responseToText)
    .then(code => loadAndExecute(code, normalizedURL))
    .then(
      module => ModuleStore.set(normalizedURL, module)
    )
    .then(
      Store => Store.get(normalizedURL)
    );
}

/**
 * System object inspired by the ES6 Module Loader API
 * @type {Object}
 */
const System = {
  import(url) {
    return importWithReferrer(url, getStackPaths()[2]);
  },
};

export default System;
