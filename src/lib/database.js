'use strict';
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
let connection = null;

class Database {

  static getConnection() {
    return new Promise(async (resolve, reject) => {
      try {
        if (!connection) {
          const client = await MongoClient.connect(url);
          connection = client.db('auth');
        }
        resolve(connection);
      } catch( err){
        reject(err);
      }
    });
  }

  static close() {
    connection.close();
    connection = null;
  }

  static async getCollection(collection) {
    const connection = await Database.getConnection();
    return connection.collection(collection);
  }
}

module.exports = Database;
