'use strict';

const ObjectID = require('mongodb').ObjectID;
const Database = require('../lib/database');
const Page = require('../object/page');

class Client {
  static getClients(index, offset) {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await Database.getCollection('clients');
        const total = await collection.count();
        const clients = await collection.find().skip(index).limit(offset).toArray();

        resolve(new Page(index, offset, clients, total));
      } catch (err) {
        reject(err);
      }
    });
  }

  static getClientById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await Database.getCollection('clients');
        const queryResult = await collection.findOne({ _id: new ObjectID(id) });

        let client = null;

        if (queryResult) {
          client = new Client(queryResult.name, queryResult.secret, queryResult.redirectUri);
          client._id = queryResult._id;
        }

        resolve(client);
      } catch (err) {
        reject(err);
      }
    });
  }

  static getClientByName(name) {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await Database.getCollection('clients');
        const queryResult = await collection.findOne({ name: name });

        let client = null;

        if (queryResult) {
          client = new Client(queryResult.name, queryResult.secret, queryResult.redirectUri);
          client._id = queryResult._id;
        }

        resolve(client);
      } catch (err) {
        reject(err);
      }
    });
  }

  constructor(name, secret, redirectUri) {
    this.name = name;
    this.secret = secret;
    this.redirectUri = redirectUri;
  }

  save() {
    return new Promise(async (resolve, reject) => {
      try {
        const collection = await Database.getCollection('clients');
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

module.exports = Client;
