const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionsRouter = require('./routers/transactionsRouter');
const userRouter = require('./routers/userRouter');
const codeRouter = require('./routers/stringCodeRouter');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/transaction', transactionsRouter);
app.use('/user', userRouter);
app.use('/code', codeRouter);

mongoose.connect('mongodb://127.0.0.1:27017/Transaction');

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
