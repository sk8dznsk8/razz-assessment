const express = require('express');
const cors = require('cors');
const path = require('path');

const prizeRouter = require('./routers/prize');
const userRouter = require('./routers/user');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());
// Routers
app.use(prizeRouter);
app.use(userRouter);

app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});