const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const fetchUserCollection = require('../db/models/user');
const cryptoUtils = require('../utils/crypto')();

const auth = async (req, res, next) => {
    // Decrypt token cipher
    const tokenCipher = req.header('Authorization').replace('Bearer ', '');
    let token = cryptoUtils.decryptCipher(tokenCipher);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userCollection = await fetchUserCollection();
        let user = await userCollection.findOne({ _id: new ObjectID(decoded._id), 'tokens.token': token });
        if(!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        const userCollection = await fetchUserCollection();
        let user = await userCollection.find({ 'tokens.token': token }).toArray();
        user.forEach(user => {
            userCollection.updateOne({ _id: user._id }, { $set: { tokens: [] } });
        });
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;