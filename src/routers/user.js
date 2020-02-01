const express = require('express');
const fetchUserCollection = require('../db/models/user');
const authUtils = require('../utils/auth')();
const cryptoUtils = require('../utils/crypto')();
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/users/signup', async (req, res) => {
    try {
        // Decrypt body
        const body = cryptoUtils.decryptCipher(req.body.cipher);
        // Validate email format and Hash password before saving to DB
        const hashedUser = await authUtils.validateAndHash(body);
        if(!hashedUser) {
            return res.status(400).send({ handledError: 'Invalid email!' });
        }
        // Insert user to DB
        const userCollection = await fetchUserCollection();
        const result = await userCollection.insertOne(hashedUser);
        let user = result.ops.shift();
        // If valid generate token and add token to DB
        const token = await authUtils.generateAuthToken(user);
        authUtils.toPublic(user);
        // Send encrypted object
        res.status(201).send(cryptoUtils.generateCipherObject({ user, token }));
    } catch (error) {
        const errorMsg = error.toString();
        // Check for duplicate email message
        if(errorMsg.includes('key') && errorMsg.includes('email')) {
            return res.status(400).send({ handledError: 'Email already registered!' });
        }
        res.status(400).send({ error: errorMsg });
    }
});

router.post('/users/login', async (req, res) => {
    try {
        // Decrypt body
        const body = cryptoUtils.decryptCipher(req.body.cipher);
        // Use decrypted
        const userCollection = await fetchUserCollection();
        // Validate email first
        let user = await userCollection.findOne({ email: body.email });
        if(!user) {
            return res.status(400).send({ handledError: 'Wrong email or password!' });
        }
        // Validate password
        const isValid = await authUtils.validate(body.password, user.password);
        if(!isValid) {
            return res.status(400).send({ handledError: 'Wrong email or password!' });
        }
        // If valid return generate token and add to DB
        const token = await authUtils.generateAuthToken(user);
        authUtils.toPublic(user);
        // Send encrypted object
        res.send(cryptoUtils.generateCipherObject({ user, token }));
    } catch (error) {
        res.status(400).send({ error: error.toString() });
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        // Remove current token --- Keep when different
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });
        const userCollection = await fetchUserCollection();
        await userCollection.updateOne({ _id: req.user._id }, { $set: { tokens: req.user.tokens } });
        res.send();
    } catch (error) {
        res.status(400).send({ error: error.toString() });
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        const userCollection = await fetchUserCollection();
        await userCollection.updateOne({ _id: req.user._id }, { $set: { tokens: [] } });
        res.send();
    } catch (error) {
        res.status(400).send({ error: error.toString() });
    }
});

module.exports = router;