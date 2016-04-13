exports.isFunction = function (value) {
  return typeof  value === "function";
};

exports.isString = function (value) {
  return typeof value === 'string'
};

// compare two given objects (shallow)
exports.shallowEqual = function (a, b) {
  if (a === b) {
    return true;
  }

  var keysA = Object.keys(a);
  var keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(b, keysA[i]) || a[keysA[i]] !== b[keysA[i]]) {
      return false;
    }
  }

  return true;
};
