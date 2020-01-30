const express = require('express');


const prizeRouter = require('./routers/prize');

const app = express();
const port = process.env.PORT;

// Body parser
app.use(express.json());
// Routers
app.use(prizeRouter);

app.get('', async (req, res) => {
    res.send('Hello from home');
});

app.get('/page1', async (req, res) => {
    res.send('Hello from page1');
});

app.get('*', async (req, res) => {
    res.send('Not Found 404 Page');
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});