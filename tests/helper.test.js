import url from 'url';
import { getStackPaths } from '../lib/helper';

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
