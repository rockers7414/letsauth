'use strict';

module.exports = {
  dev: {
    script: './server.js',
    options: {
      nodeArgs: ['--inspect'],
      cwd: 'src'
    }
  }
};
