const express = require('express');

const app = express();
app.use(express.json());

const port = process.env.PORT || 4000;

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