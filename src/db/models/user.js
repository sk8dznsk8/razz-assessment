/*
// https://docs.mongodb.com/manual/core/schema-validation/
// https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/
*/
const userSchema = {
   $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "password"],
      properties: {
         name: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         email: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         password: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         tokens: {
            bsonType: ["array"],
            items: {
               bsonType: "object",
               required: ["token"],
               properties: {
                  token: {
                     bsonType: "string",
                     description: "must be a string and is required"
                  }
               }
            }
         }
      }
   }
};
 
 const MongoClient = require('../mongodb')();
 const collection = 'User';
 
 const user = async () => {
    const db = (await MongoClient).db();
    // The validator command is a ONE-TIME type of execution, so it could be placed somewhere else in order to be executed once
    // I decided to leave it here to simplify and make sure that the code will execute and apply the validator
    const names = await db.listCollections({ name: collection }, { nameOnly: true }).toArray();
    if(names.length === 0) {
       await db.createCollection(collection);
       await db.command({ collMod: collection, validator: userSchema });
       await db.createIndex(collection, { 'email': 1 }, { unique: true });
    }
    return db.collection(collection);
 }
 
 module.exports = user;