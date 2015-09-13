import { System } from '../index';

describe('System', () => {
  it('should be defined', () => {
    expect(System).toBeDefined();
  });

  it('should import a module from server and provide its export values', (done) => {
    System
      .import('/base/tests/assets/basic-export.js')
      .then((module) => {
        expect(module.value).toBe('value');
        expect(module.default()).toBe('My value');
      })
      .then(done);
  });
});
