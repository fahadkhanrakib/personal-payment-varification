const express = require('express');
const mongoose = require('mongoose');
const TransactionModel = require('../models/Transaction');
const StringCodeModel = require('../models/StringCode');
const UserModel = require('../models/User');
const checkLogin = require('../middleware/checkLogin');
const bkashRouter = require('./paymentsRouter/bkashRouter/');
const nagadRouter = require('./paymentsRouter/nagadRouter/');
const paymentsReceivedController  = require('../controller/paymentsReceivedController/');

const transactionsRouter = express.Router();

transactionsRouter.use('/bkash', bkashRouter);
transactionsRouter.use('/nagad', nagadRouter);

transactionsRouter.post('/', paymentsReceivedController.payments);

transactionsRouter.get('/', checkLogin, (req, res) => {
  TransactionModel.find({})
    .then(transaction => res.json(transaction))
    .catch(err => console.log(err));
});

transactionsRouter.post('/verification', checkLogin, async (req, res) => {
  try {
    const transactionID = req.body.transactionID;
    const userId =  req.userId;
    
    const result = await TransactionModel.updateOne(
      {
        transactionID,
        senderUser: { $exists: false },
        status: 'pending',
      },
      {
        $set: {
          senderUser: userId,
          status: 'verified',
        },
      },
    );
    
    await UserModel.updateOne(
            {
              _id: userId,
            },
            {
              $inc: {accountBalance: amount}
            },
          );

    console.log(result); 

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = transactionsRouter;
