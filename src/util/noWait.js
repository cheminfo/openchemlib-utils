export async function noWait() {
  return new Promise((resolve) => {
    if (typeof setImmediate === 'function') {
      setImmediate(() => resolve());
    } else {
      // didn't find a better way to do it in the browser
      setTimeout(() => resolve(), 0);
    }
  });
}
