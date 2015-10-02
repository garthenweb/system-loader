/**
 * Get the text from stream
 * @param  {Stream} resp
 * @return {Promise}
 */
export function responseToText(resp) {
  return resp.text();
}

/**
 * Read the current call stack and return the files containing file paths
 * @return {array} Filepaths
 */
export function getStackPaths() {
  try {
    throw new Error();
  } catch (e) {
    const { stack } = e;
    // matches "(http://myurl.de:898:89)" and "@http://myurl.de:898"
    // const regex = /\((.+):(\d+(:\d+))?\)/gim;
    const regex = /[\(|@](.+?):(?:\d+)(?::\d+)?\)?$/gim;
    const filenamesFromStack = [];
    let match = regex.exec(stack);
    while (match) {
      filenamesFromStack.push(match[1]);
      match = regex.exec(stack);
    }
    return filenamesFromStack;
  }
}

/**
 * Tests a path whether its relative or not
 * @param  {string}  path path to check against
 * @return {Boolean}
 */
export function isRelativePath(path) {
  // starts with a slash
  if (path.indexOf('/') === 0) {
    return false;
  }

  // check for protocol
  const hasProtocol = /^\w+:\/\/.+$/gi;
  if (hasProtocol.test(path)) {
    return false;
  }

  return true;
}

/**
 * resolves the file path into a unified form
 * @param  {string} url      Url to resolve
 * @param  {string} referrer The referrer the url was called from.
 *                           This is important to resolve relative urls
 * @return {string}          Normalized url
 */
export function normalizeURL(url, referrer) {
  let dirtyPath = url;
  const a = document.createElement('a');
  if (isRelativePath(url)) {
    if (!referrer) {
      throw new TypeError('Referrer must be defined for relative paths');
    }
    // when starting with a dot it is a relative path
    const filenameStartIndex = referrer.lastIndexOf('/');
    const executingLocation = referrer.substr(0, filenameStartIndex);
    dirtyPath = executingLocation + '/' + url;
    console.warn(`Relative path was detected ´${url}´. After concatenating files, relative path can become inaccessible.`);
  }

  const hasJSExtension = /\.js$/;
  if (!hasJSExtension.test(dirtyPath)) {
    dirtyPath = dirtyPath + '.js';
  }

  a.href = dirtyPath;

  // href attribute will now be the beautyfied version resolved by the browser
  return a.href;
}
