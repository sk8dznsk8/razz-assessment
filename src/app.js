const express = require('express');
const cors = require('cors');

const prizeRouter = require('./routers/prize');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
// Routers
app.use(prizeRouter);

app.get('*', async (req, res) => {
    res.send('Not Found 404 Page');
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});