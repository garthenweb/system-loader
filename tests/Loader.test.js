import { default as Loader } from '../lib/Loader';

describe('Loader', () => {
  it('should be a valide Reflect.Loader object', () => {
    const proto = Loader.prototype;
    expect(Loader).toEqual(jasmine.any(Function));
    expect(Loader.constructor).toEqual(jasmine.any(Function));
    expect(proto).toEqual(jasmine.any(Object));
    expect(proto.import).toEqual(jasmine.any(Function));
    expect(proto.resolve).toEqual(jasmine.any(Function));
    expect(proto.load).toEqual(jasmine.any(Function));

    const registryDescriptor = Object.getOwnPropertyDescriptor(proto, 'registry');
    expect(registryDescriptor.get).toEqual(jasmine.any(Function));
    expect(registryDescriptor.set).not.toBeDefined();

    expect(proto.toString).toEqual(jasmine.any(Function));
  });

  it('should throw if called without `new`', () => {
    function callWithoutNew() {
      return Loader();
    }
    function callWithNew() {
      return new Loader();
    }

    expect(callWithoutNew).toThrow();
    expect(callWithNew).not.toThrow();
  });

  describe('instances', () => {
    const instance = new Loader();

    it('should inherit from `Reflect.Loader.prototype`', () => {
      const proto = Object.getPrototypeOf(instance);
      expect(proto).toBe(Loader.prototype);
    });
  });

  describe('import', () => {
    it('should throw if loader is not an object', () => {
      expect(Loader.prototype.import).toThrow();
    });
  });

  describe('resolve', () => {
    it('should throw if loader is not an object', () => {
      expect(Loader.prototype.resolve).toThrow();
    });
  });

  describe('load', () => {
    const instance = new Loader();
    it('should throw if loader is not an object', () => {
      expect(Loader.prototype.load).toThrow();
    });

    it('should throw if stage is not a valid value', () => {
      function callWithInvalidValue() {
        instance.load(null, null, 'invalid value');
      }
      expect(callWithInvalidValue).toThrow();
    });
  });
});
