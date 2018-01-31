'use strict';

class AccessToken {
  constructor(token, scopes, type='Bearer', expire=3600, refreshToken=null) {
    this.access_token = token;
    this.scopes = scopes;

    this.expires_in = expire;
    this.token_type = type;

    if (refreshToken) {
      this.refresh_token = refreshToken;
    }
  }
}

module.exports = AccessToken;
