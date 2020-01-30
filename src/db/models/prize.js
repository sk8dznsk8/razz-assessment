/*
// https://docs.mongodb.com/manual/core/schema-validation/
// https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/
db.createCollection("Prize", {
   validator: {
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
   }
})
*/

const MongoClient = require('../mongodb')();
const collection = 'Prize';

const prize = async () => {
    return (await MongoClient).db().collection(collection);
}

module.exports = prize;