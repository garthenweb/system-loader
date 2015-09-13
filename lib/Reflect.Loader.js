import Registry from './Registry';

const Registry = Symbol('Registry');
const Realm = Symbol('Realm');

const ResolveHook = Symbol('ResolveHook');

const Module = Symbol('Module');

const STAGE_READY = 'ready';
const STAGE_FETCH = 'fetch';
const STAGE_TRANSLATE = 'translate';
const STAGE_INSTANTIATE = 'instantiate';
const STAGE_LINK = 'link';

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function ensureLoader(loader) {
  if (!isObject(loader)) {
    throw new TypeError('`loader` is not Object');
  }
}

function ensureLoaderRegistry(loader) {
  if (loader[Registry] === undefined) {
    throw new TypeError('`Registry` is not defined');
  }
}


// 5.1.1.
function EnsureRegistered(loader, key) {
  let entry;
  let registry = loader[Registry];
  // @todo registrydata is not accessable
  let registryData = registry[RegistryData];
  let pair = registryData.get(key);
  if (!pair) {
    // create a new pair
    pair = {
      key,
      value: {
        key,
        state: 'fetch',
        metadata: undefined,
        fetch: undefined,
        translate: undefined,
        instantiate: undefined,
        dependencies: undefined,
        module: undefined,
        error: null
      },
    };
    registerData.set(key, pair);
  }

  return pair.value;
}

// 5.1.2.
function Resolve(loader, name, referrer) {
  return loader[ResolveHook](name, referrer);
}

// 5.2.5.
function RequestLink(loader, key) {
  const entry = EnsureRegistered(loader, key);
  if (entry.state === STAGE_READY) {
    return Promise.resolve(entry.module);
  }

  return RequestInstantiateAll(loader, key)
    .then(entry => {
      if (entry.status === STAGE_LINK) {
        const status = Link(loader, entry);
        // @todo handle error (ReturnIfAbrupt(status))
      }
      return entry;
    });
}

// 5.2.6.
function RequestReady(loader, key) {
  return RequestLink(loader, key)
    .then((entry) => {
      const { module } = entry;
      // const status =
    });
}

// 3.2.
// 3.3.
class Loader {
  // 3.3.1.
  constructor() {
    // @todo might not be valide objects
    this[Registry] = new Registry();
    this[Realm] = {};
  }

  /**
   * 3.3.2.
   * @param  {[type]} name       [description]
   * @param  {[type]} [referrer] [description]
   * @return {[type]}            [description]
   */
  import(name, referrer) {
    const loader = this;
    ensureLoader(loader);
    ensureLoaderRegistry(loader);

    return Resolve(loader, name, referrer)
      .then((key) => RequestReady(loader, key));
  }

  /**
   * [import description]
   * @param  {[type]} name       [description]
   * @param  {[type]} [referrer] [description]
   * @return {[type]}            [description]
   */
  resolve(name, referrer) {
    const loader = this;
    ensureLoader(loader);
    return Resolve(loader, name, referrer);
  }


  /**
   * [import description]
   * @param  {[type]} name       [description]
   * @param  {[type]} [referrer] [description]
   * @param  {[type]} [stage]    [description]
   * @return {[type]}            [description]
   */
  load(name, referrer, stage = STAGE_READY) {
    const loader = this;
    ensureLoader(loader);

    if (stage === STAGE_FETCH) {
      return RequestFetch(loader, key);
    }
    if (stage === STAGE_TRANSLATE) {
      return RequestTranslate(loader, key);
    }
    if (stage === STAGE_INSTANTIATE) {
      return RequestInstantiateAll(loader, key);
    }
    if (stage === STAGE_LINK) {
      return RequestLink(loader, key);
    }
    if (stage === STAGE_READY) {
      return RequestReady(loader, key);
    }

    throw new TypeError('`stage` does not match a given type.');
  }

  get registry() {
    return this[Registry];
  }

  get [Symbol.toStringTag]() {
    return 'Object';
  }

  // toString() {
  //   return '[object Loader]';
  // }
}

export default Loader;
