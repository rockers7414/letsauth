'use strict';

const ObjectID = require('mongodb').ObjectID;
const Util = require('../lib/util');
const Database = require('../lib/database');

class Grant {

  static getGrantByCode(code) {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await Database.getCollection('codes');
        const queryResult = await collection.findOne({ code: code });

        let grant = null;

        if (queryResult) {
          grant = new Grant(queryResult.email, queryResult.scopes, queryResult.redirectUri);
          grant._id = queryResult._id;
        }

        resolve(grant);
      } catch (err) {
        reject(err);
      }
    });
  }

  constructor(email, scopes, redirectUri) {
    this.code = Util.randomHexString(32);
    this.email = email;
    this.scopes = scopes;
    this.redirectUri = redirectUri;
  }

  save() {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await Database.getCollection('codes');
        const id = this._id ? this._id : new ObjectID();
        const updateResult = await collection.updateOne({ _id: id }, { $set: this }, { upsert: true });

        if (!this._id) {
          this._id = updateResult.upsertedId._id;
        }

        resolve(this);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = Grant;
