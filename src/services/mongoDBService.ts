const MongoClient = require('mongodb').MongoClient;
import config from '../config';
const url = config.mongo.connectionString;

const dbName = 'karmabot';
const collectionName = 'karma';

interface user {
  recipient: string;
  karma: number;
}

export default class MongoDBService {
  static connect(): Promise<any> {
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, { useNewUrlParser: true }, (err: any, db: any) => {
        if (err) {
          console.log(err);
          reject(new Error('Mongo Connection Fail'));
        }

        const dbo = db.db(dbName).collection(collectionName);

        // hacks
        dbo['$$closeDB'] = () => {
          db.close();
        };

        resolve(dbo);
      });
    })
  }

  static async find(query: any): Promise<user> {
    const dbo = await this.connect();
    return new Promise<user>((resolve, reject) => {
      dbo.findOne(query, (err: any, document: user) => {
        if (err) {
          console.log(err);
          reject(new Error('Mongo find error'));
        }

        dbo.$$closeDB();
        resolve(document);
      });
    });
  }

  static async update(query: any, newValues: object) {
    const dbo = await this.connect();
    dbo.updateOne(query, { $set: newValues });
    dbo.$$closeDB();
  }

  static async insertMany(entries: Array<object>) {
    const dbo = await this.connect();
    dbo.insertMany(entries);
    dbo.$$closeDB();
  }
}
