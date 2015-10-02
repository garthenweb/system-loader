import url from 'url';
import { getStackPaths, isRelativePath } from '../lib/helper';

describe('getStackPaths', () => {
  it('should return an array', () => {
    const paths = getStackPaths();
    expect(paths).toEqual(jasmine.any(Array));
  });

  it('should return at least one valid path', () => {
    const { host } = url.parse(location.href);
    const paths = getStackPaths();
    expect(paths[0]).toEqual(jasmine.any(String));
    expect(paths[0].indexOf(host)).not.toBe(-1);
    expect(paths[0].match(/:\d+$/)).toBe(null);
  });
});

describe('isRelativePath', () => {
  it('should detect relative paths starting with a dot', () => {
    expect(isRelativePath('./my/path')).toBe(true);
    expect(isRelativePath('../my/path')).toBe(true);
  });

  it('should detect relative paths starting without a dot', () => {
    expect(isRelativePath('my/path')).toBe(true);
  });

  it('should detect non relative paths starting with a protocol', () => {
    expect(isRelativePath('http://my/path')).toBe(false);
    expect(isRelativePath('https://my/path')).toBe(false);
    expect(isRelativePath('djkasdhajhdas://my/path')).toBe(false);
  });

  it('should detect non relative paths starting with a slash', () => {
    expect(isRelativePath('/my/path')).toBe(false);
    expect(isRelativePath('//my/path')).toBe(false);
  });
});


