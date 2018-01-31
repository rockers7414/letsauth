'use strict';

const crypto = require('crypto');

class Util {
  static randomHexString(len) {
    return crypto.randomBytes(Math.ceil(len/2))
      .toString('hex')
      .slice(0, len);
  }
}

module.exports = Util;
