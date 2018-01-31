'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('./user');

class Auth {

  static getAccessTokenByPassword(email, password, scopes, expire=3600) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.getUserByEmail(email);

        if (!user || user.email !== email || user.password !== password) {
          // TODO: should well handle the error
          reject('email and password is not correct');
        }

        const cert = fs.readFileSync('../credentials/private_key.pem');
        const payload = {
          exp: Math.floor(Date.now() / 1000) + expire,
          email: user.email,
          scopes: scopes
        };
        const token = jwt.sign(payload, cert, { algorithm: 'RS256'});

        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  // XXX: Deprecate
  static getAccessToken(email, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.getUserByEmail(email);

        if (!user || user.email !== email || user.password !== password) {
          reject('email and password is not correct');
        }

        const cert = fs.readFileSync('../credentials/private_key.pem');
        const payload = {
          exp: Math.floor(Date.now() / 1000) + 3600,
          name: user.firstName,
          email: user.email,
          admin: await user.isAdmin()
        };
        const token = jwt.sign(payload, cert, { algorithm: 'RS256'});

        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }

  static authenticate(accessToken) {
    try {
      const cert = fs.readFileSync('../credentials/public_key.pem');
      const payload = jwt.verify(accessToken, cert, { algorithms: ['RS256'] });

      return payload;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Auth;
