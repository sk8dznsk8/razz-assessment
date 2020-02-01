const express = require('express');
const { ObjectID } = require('mongodb');
const fetchPrizeCollection = require('../db/models/prize');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/prizes', async (req, res) => {
    try {
        const prizeCollection = await fetchPrizeCollection();
        const prize = await prizeCollection.insertOne(req.body);
        res.status(201).send(prize);
    } catch (error) {
        res.status(400).send({ error: error.toString() });
    }
});

router.get('/prizes', async (req, res) => {
    try {
        const prizeCollection = await fetchPrizeCollection();
        const prizes = await prizeCollection.find({}).toArray();
        res.send(prizes);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
});

router.get('/prizes/:id', async (req, res) => {
    try {
        const _id = new ObjectID(req.params.id);
        const prizeCollection = await fetchPrizeCollection();
        const prize = await prizeCollection.findOne({ _id });
        if(!prize) {
            return res.status(404).send({ error: 'Id not found' });
        }
        res.send(prize);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
});

router.patch('/prizes/:id', async (req, res) => {
    const fields = Object.keys(req.body);
    const allowedFields = ['name', 'description', 'image_url', 'quantity'];
    const isValid = fields.every(field => allowedFields.includes(field));
    if(!isValid) {
        return res.status(400).send({ error: 'Invalid fields!' });
    }
    try {
        const _id = new ObjectID(req.params.id);
        const prizeCollection = await fetchPrizeCollection();
        const prize = await prizeCollection.findOneAndUpdate({ _id }, { $set: req.body }, { returnOriginal : false });
        if(!prize || !prize.value) {
            return res.status(404).send({ error: 'Id not found' });
        }
        res.send(prize);
    } catch (error) {
        res.status(400).send({ error: error.toString() });
    }
});

router.patch('/prizes/decrement/:id', auth, async (req, res) => {
    try {
        const _id = new ObjectID(req.params.id);
        const prizeCollection = await fetchPrizeCollection();
        const prize = await prizeCollection.findOneAndUpdate(
            { _id, quantity: { $gt: 0 } },
            { $inc: { quantity: -1 } },
            { returnOriginal : false }
        );
        if(!prize || !prize.value) {
            return res.status(404).send({ error: 'Id not found' });
        }
        res.send(prize);
    } catch (error) {
        res.status(400).send({ error: error.toString() });
    }
});

router.delete('/prizes/:id', async (req, res) => {
    try {
        const _id = new ObjectID(req.params.id);
        const prizeCollection = await fetchPrizeCollection();
        const prize = await prizeCollection.findOneAndDelete({ _id });
        if(!prize || !prize.value) {
            return res.status(404).send({ error: 'Id not found' });
        }
        res.send(prize);
    } catch (error) {
        res.status(500).send({ error: error.toString() });
    }
});

module.exports = router;