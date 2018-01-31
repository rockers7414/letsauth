'use strict';

class Response {
  constructor(data, error) {
    this.data = data;
    this.error = error;
  }
}

class Collection extends Response {
  constructor(page) {
    super(page.data, null);

    this.type = 'collection';
    this.index = page.index;
    this.offset = page.offset;
    this.total = page.total;
  }
}

class Data extends Response {
  constructor(data, error = null) {
    super(data, error);

    this.type = 'single';
  }
}

class Error extends Response {
  constructor(error) {
    super(null, error);
  }
}

module.exports = {
  Data: Data,
  Collection: Collection,
  Error: Error
};
