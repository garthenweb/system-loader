const ModuleStore = new Map();

function responseToText(resp) {
  return resp.text();
}

function execute(module) {
  const evalStr = `
    (function() {
      var exports = {};
      var module = { exports: exports };
      ${module};
      return module.exports;
    })();
  `;
  const ret = eval(evalStr);
  return ret;
}

const System = {
  import(url) {
    if (ModuleStore.has(url)) {
      return Promise.resolve(ModuleStore.get(url));
    }

    return window.fetch(url)
      .then(responseToText)
      .then(execute)
      .then(module => ModuleStore.set(url, module))
      .then(Store => Store.get(url));
  },
};

export default System;
