/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, 'src/'),
    },
  },
};
