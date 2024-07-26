module.exports.sortObject = (obj) => {
  const sorted = {};
  const keys = [];

  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      keys.push(encodeURIComponent(key));
    }
  }

  keys.sort();

  for (let i = 0; i < keys.length; i++) {
    const encodedKey = keys[i];
    const originalKey = decodeURIComponent(encodedKey);
    sorted[encodedKey] = encodeURIComponent(obj[originalKey]).replace(
      /%20/g,
      "+"
    );
  }

  return sorted;
};
