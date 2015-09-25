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
