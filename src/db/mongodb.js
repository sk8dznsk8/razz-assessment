const { MongoClient } = require('mongodb');

const initialize = async () => {
    return await MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true });
}

module.exports = initialize;