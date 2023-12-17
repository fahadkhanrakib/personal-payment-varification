const express = require('express');
const mongoose = require('mongoose');
const paymentsReceivedController = require('../controller/paymentsReceivedController/');
const checkLogin = require('../middleware/checkLogin');
const bkashRouter = require('./paymentsRouter/bkashRouter/');
const nagadRouter = require('./paymentsRouter/nagadRouter/');

const transactionsRouter = express.Router();

transactionsRouter.use('/bkash', bkashRouter);
transactionsRouter.use('/nagad', nagadRouter);

transactionsRouter.post('/', paymentsReceivedController.payments);

transactionsRouter.get('/', checkLogin, paymentsReceivedController.info);

transactionsRouter.post('/verification', checkLogin, paymentsReceivedController.varification);

module.exports = transactionsRouter;
