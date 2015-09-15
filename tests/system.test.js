import System from '../lib/System';

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
    let error = false;
    System
      .import('/base/tests/assets/context-this.js')
      .then(null, () => {
        error = true;
      })
      .then(() => {
        expect(error).toBe(false);
      })
      .then(done);
  });
});
