const ModuleStore = new Map();

function responseToText(resp) {
  return resp.text();
}

function execute(moduleCode) {
  const evalStr = `
    (function() {
      var exports = {};
      var module = { exports: exports };

      ${moduleCode};

      return module.exports;
    })();
  `;
  // @todo write a test for this inside of eval
  const ret = eval.call(this, evalStr);
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
      .then(
        module => ModuleStore.set(url, module)
      )
      .then(
        Store => Store.get(url)
      );
  },
};

export default System;
