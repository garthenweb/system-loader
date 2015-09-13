const RegistryData = Symbol('RegistryData');
const Loader = Symbol('Loader');

// 4
class Registry {
  constructor(loader) {
    this[RegistryData] = new Map();
    this[Loader] = loader;
  }

  [Symbol.iterator]() {

  }

  lookup(key) {

  }

  install(key, module) {

  }

  uninstall(key) {

  }

  cancel(key) {

  }

  provide(key, stage, value) {

  }

  error(key, stage, value) {

  }
}
