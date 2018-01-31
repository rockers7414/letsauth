'use strict';

class UnknownError {
  constructor() {
    this.err_msg = 'Unknown error.';
  }
}

class AuthenticationFailed {
  constructor() {
    this.err_msg = 'Failed to authentication.';
  }
}

class NoAccessToken {
  constructor() {
    this.err_msg = 'No access token provided.';
  }
}

class InvalidToken {
  constructor() {
    this.err_msg = 'Invalid token.';
  }
}


class PermissionDenied {
  constructor() {
    this.err_msg = 'Permission denied.';
  }
}

module.exports = {
  NoAccessToken: NoAccessToken,
  InvalidToken: InvalidToken,
  UnknownError: UnknownError,
  AuthenticationFailed: AuthenticationFailed,
  PermissionDenied: PermissionDenied
};
