global.__DEV__ = true;

Object.defineProperty(global, '__ExpoImportMetaRegistry', {
  value: {},
  writable: true,
  configurable: true,
});

if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}
