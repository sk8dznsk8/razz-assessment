/*
// https://docs.mongodb.com/manual/core/schema-validation/
// https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/
*/
const prizeSchema = {
   $jsonSchema: {
      bsonType: "object",
      required: [ "name", "description", "image_url", "quantity" ],
      properties: {
         name: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         description: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         image_url: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         quantity: {
            bsonType: "int",
            minimum: 0,
            description: "must be an integer greater than 0 and is required"
         }
      }
   }
};

const MongoClient = require('../mongodb')();
const collection = 'Prize';

const prize = async () => {
   const db = (await MongoClient).db();
   // The validator command is a ONE-TIME run, so it could be placed somewhere else in order to be executed once
   // I decided to leave it here to simplify and make sure that the code will execute and apply the validator
   const names = await db.listCollections({ name: collection }, { nameOnly: true }).toArray();
   if(names.length === 0) {
      await db.createCollection(collection);
      await db.command({ collMod: collection, validator: prizeSchema });
   }
   return db.collection(collection);
}

module.exports = prize;