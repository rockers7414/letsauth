'use strict';

const ObjectID = require('mongodb').ObjectID;
const Database = require('../lib/database');
const Page = require('../object/page');

class User {
  static getUsers(index, offset) {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await Database.getCollection('users');
        const total = await collection.count();
        const users = await collection.find().skip(index).limit(offset).toArray();

        resolve(new Page(index, offset, users, total));
      } catch (err) {
        reject(err);
      }
    });
  }

  static getUserByEmail(email) {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await Database.getCollection('users');
        const queryResult = await collection.findOne({ email: email });

        let user = null;

        if (queryResult) {
          user = new User(queryResult.email, queryResult.password);
          user._id = queryResult._id;
        }

        resolve(user);
      } catch (err) {
        reject(err);
      }
    });
  }

  constructor(email, password) {
    this.email = email;
    this.password = password;
  }

  save() {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await Database.getCollection('users');
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

  async isAdmin() {
    if (!this._id) {
      return false;
    }

    const collection = await Database.getCollection('admins');
    const queryResult = await collection.findOne({ _id: this._id });

    if (queryResult) {
      return true;
    }

    return false;
  }
}

module.exports = User;
