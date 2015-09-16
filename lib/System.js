const ModuleStore = new Map();

function responseToText(resp) {
  return resp.text();
}

function getStackPaths() {
  try {
    throw new Error();
  } catch (e) {
    const regex = /\((.+):(\d+(:\d+))?\)/gim;
    const filenamesFromStack = [];
    let match;
    while (match = regex.exec(e.stack)) {
      filenamesFromStack.push(match[1]);
    }
    return filenamesFromStack;
  }
}

function getRequiredFilesFromCode(moduleCode) {
  const regex = /require\(['|"](.*)['|"]\)/gmi;
  const files = [];
  let match;
  while (match = regex.exec(moduleCode)) {
    files.push(match[1]);
  }
  return files;
}

function normalizeURL(url, referrer) {
  let dirtyPath = url;
  const a = document.createElement('a');
  if (url.indexOf('.') === 0) {
    // when starting with a dot it is a relative path
    let executingFile;
    if (!referrer) {
      executingFile = getStackPaths()[3];
    } else {
      executingFile = referrer;
    }

    const filenameStartIndex = executingFile.lastIndexOf('/');
    const executingLocation = executingFile.substr(0, filenameStartIndex);
    dirtyPath = executingLocation + '/' + url;
    console.warn(`
      After concatenating files relative path can become inaccessible.
      Be sure that your file structure will not change.
    `);
  }

  a.href = dirtyPath;

  // href attribute will now be the beautyfied version resolved by the browser
  return a.href;
}

function importFromRefferer(url, referrer) {
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

function loadAndExecute(moduleCode, referrer) {
  // get all inner modules
  const innerModules = getRequiredFilesFromCode(moduleCode);
  // load all inner modules so that they are cached
  return Promise
    .all(
      innerModules.map(module => importFromRefferer(module, referrer))
    )
    // then execute modules
    .then(() => execute(moduleCode, referrer));
}

const System = {
  import(url) {
    return importFromRefferer(url);
  },
};

export default System;
