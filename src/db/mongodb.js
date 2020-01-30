const { MongoClient } = require('mongodb');

const connURL = 'mongodb://127.0.0.1:27017';

const initialize = async () => {
    return await MongoClient.connect(connURL, { useNewUrlParser: true });
}

module.exports = initialize;