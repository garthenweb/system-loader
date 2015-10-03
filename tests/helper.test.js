import url from 'url';
import {
  getStackPaths,
  isRelativePath,
  normalizeURL,
  isSameOrigin,
} from '../lib/helper';

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
  describe('should detect relative paths starting', () => {
    it('with a dot', () => {
      expect(isRelativePath('./my/path')).toBe(true);
      expect(isRelativePath('../my/path')).toBe(true);
    });

    it('without a dot', () => {
      expect(isRelativePath('my/path')).toBe(true);
    });
  });

  describe('should detect non relative paths starting', () => {
    it('with a protocol', () => {
      expect(isRelativePath('http://my/path')).toBe(false);
      expect(isRelativePath('https://my/path')).toBe(false);
      expect(isRelativePath('djkasdhajhdas://my/path')).toBe(false);
    });

    it('with a slash', () => {
      expect(isRelativePath('/my/path')).toBe(false);
      expect(isRelativePath('//my/path')).toBe(false);
    });
  });
});

describe('normalizeURL', () => {
  const origin = location.protocol + '//' + location.host;
  it('should not change perfect paths', () => {
    const urls = [
      'http://test.tld/script.js',
      '//test.tld/script.js',
      'https://test.tld/script.js',
    ];
    urls
      .map(u => normalizeURL(u))
      .forEach(u => expect(u).toBe(u));
  });

  it('should add js extension if missing', () => {
    expect(
      normalizeURL('http://test.tld/script')
    ).toBe('http://test.tld/script.js');
  });

  it('should add origin if missing', () => {
    expect(normalizeURL('/script.js')).toBe(origin + '/script.js');
  });

  it('should beautify path', () => {
    expect(
      normalizeURL('http://test.tld/test/.././script.js')
    ).toBe('http://test.tld/script.js');
  });

  it('should merge relative path with referrer', () => {
    expect(
      normalizeURL('./script.js', 'http://test.tld/js/myscript.js')
    ).toBe('http://test.tld/js/script.js');
  });

  it('should throw if relative path without a referrer is given', () => {
    function throwFn() {
      normalizeURL('./script.js');
    }
    expect(throwFn).toThrow();
  });

  it('should ignore referrer if absolute path is given', () => {
    expect(
      normalizeURL('http://test.tld/script.js', 'http://test.tld/js/myscript.js')
    ).toBe('http://test.tld/script.js');
  });
});

describe('isSameOrigin', () => {
  it('should succeed the test for the current url', () => {
    expect(isSameOrigin(location.href)).toBe(true);
  });

  it('should not require a protocol to succeed', () => {
    expect(isSameOrigin('//' + location.host)).toBe(true);
  });

  it('should fail for google.com', () => {
    expect(isSameOrigin('http://google.com')).toBe(false);
  });
});
