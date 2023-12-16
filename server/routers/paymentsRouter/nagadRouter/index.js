const express = require('express');
const TransactionModel = require('../../../models/Transaction'); // Add the import statement for PaymentModel

const nagadRouter = express.Router();

nagadRouter.get('/', (req, res) => {
  const filters = { wallet: 'nagad' };

  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const minAmount = req.query.minAmount;
  const maxAmount = req.query.maxAmount;

  const operationType = req.query.type;

  if (startDate && endDate) {
    filters.transactionDate = { $gte: startDate, $lte: endDate };
  }

  if (minAmount && maxAmount) {
    filters.amount = { $gte: minAmount, $lte: maxAmount };
  }

  if (operationType) {
    filters.operationType = operationType;
  }

  console.log(filters);

  TransactionModel.find(filters)
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

nagadRouter.get('/:transactionID', (req, res) => {
  const transactionID = req.params.transactionID;
  TransactionModel.find({ transactionID })
    .then(data => res.json(data))
    .catch(err => res.json(err));
});

module.exports = nagadRouter;
