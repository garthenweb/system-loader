import * as System from '../index';

function expectPromiseResolves(promise, done) {
  let error;
  promise
    .then(null, (err) => {
      error = err;
    })
    .then(() => {
      expect(error).toBeUndefined();
    })
    .then(done);
}

describe('System', () => {
  it('should be defined', () => {
    expect(System).toBeDefined();
  });

  it('should import a module from server and provide its export values', (done) => {
    System
      .import('/base/tests/assets/basic-export.es6.js')
      .then((module) => {
        expect(module.value).toBe('value');
        expect(module.default()).toBe('My value');
      })
      .then(done);
  });

  it('should execute scripts with window as context', (done) => {
    const promise = System.import('/base/tests/assets/context-this.js');
    expectPromiseResolves(promise, done);
  });

  it('should import modules with nested dependencies', (done) => {
    const promise = System.import('/base/tests/assets/import-module.es6.js');
    expectPromiseResolves(promise, done);
  });
});
