const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      fs: false,
      http: false,
      https: false,
      url: false,
      zlib: false,
      util: false,
      stream: false,
    },
  },
};
