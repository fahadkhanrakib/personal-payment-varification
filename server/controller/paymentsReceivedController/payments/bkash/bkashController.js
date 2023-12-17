const TransactionModel = require('../../../../models/Transaction');
const StringCodeModel = require('../../../../models/StringCode');
const UserModel = require('../../../../models/User');
const { format12HourTime, extractInfo } = require('../../../../utilities/utilities');

module.exports = async (req, res) => {
  const wallet = req.body.sender;
  const message = req.body.message;

  const moneyReceivedRegex = message.match(/You have received Tk/);
  const cashInRegex = message.match(/Cash In/);

  let amount,
    sender,
    reference,
    fee,
    mainBalance,
    transactionID,
    transactionDate,
    rawTransactionTime,
    transactionTime;

  if (moneyReceivedRegex || cashInRegex) {
    const operationType = moneyReceivedRegex ? 'Money Received' : 'Cash In';

    if (operationType === 'Money Received') {
      amount = extractInfo(message, 'received Tk', ' ', 1, 0, 0.0);
      sender = extractInfo(message, 'from', ' ', 1, 1, '');
      reference = extractInfo(message, 'Ref', ' ', 1, 1, '');
      fee = extractInfo(message, 'Fee Tk', ' ', 1, 1, 0.0);
      mainBalance = extractInfo(message, 'Balance Tk', ' ', 1, 1, 0.0);
      transactionID = extractInfo(message, 'TrxID', ' ', 1, 0, '');
      transactionDate = extractInfo(message, 'at', ' ', 1, 0, '');
      rawTransactionTime = extractInfo(message, transactionDate, ':', 1, -3, '');
      transactionTime = format12HourTime(rawTransactionTime);
    } else if (operationType === 'Cash In') {
      amount = extractInfo(message, 'Cash In Tk', ' ', 1, 0, 0.0);
      sender = extractInfo(message, 'from', ' ', 1, 0, '');
      reference = extractInfo(message, 'Ref', ' ', 1, 1, '');
      fee = extractInfo(message, 'Fee Tk', ' ', 1, 1, 0.0);
      mainBalance = extractInfo(message, 'Balance Tk', ' ', 1, 1, 0.0);
      transactionID = extractInfo(message, 'TrxID', ' ', 1, 0, '');
      transactionDate = extractInfo(message, 'at', ' ', 1, 0, '');
      rawTransactionTime = extractInfo(message, transactionDate, ':', 1, -3);
      transactionTime = format12HourTime(rawTransactionTime);
    }

    const isHasTransId = await TransactionModel.findOne({
      wallet: wallet.toLowerCase(),
      transactionID,
    });

    if (!isHasTransId) {
      const transactionData = new TransactionModel({
        wallet: wallet.toLowerCase(),
        operationType,
        amount: parseFloat(amount.replace(/,/g, '')),
        sender,
        reference,
        fee: parseFloat(fee.replace(/,/g, '')),
        mainBalance: parseFloat(mainBalance.replace(/,/g, '')),
        transactionID,
        transactionDate,
        transactionTime,
      });
      try {
        const savedData = await transactionData.save();

        const findOwner = await StringCodeModel.findOne({
          code: savedData.reference,
        }).populate('userId', 'username');

        if (findOwner) {
          const addOwner = await TransactionModel.updateOne(
            {
              _id: savedData._id,
              senderUser: { $exists: false },
              status: 'pending',
            },
            {
              $set: {
                senderUser: findOwner.userId._id,
                status: 'verified',
              },
            },
          );

          const addTrans = await UserModel.updateOne(
            { _id: findOwner.userId._id },
            { $push: { transactions: savedData._id } },
          );

          await StringCodeModel.findOneAndDelete({ code: savedData.reference });

          await UserModel.updateOne(
            {
              _id: findOwner.userId._id,
            },
            {
              $inc: { accountBalance: amount },
            },
          );
        } else {
          console.log('No owner found for the given reference code.');
          res.status(400).json({
            message: 'No owner found for the given reference code.',
          });
        }
      } catch (error) {
        console.error('Error saving data to MongoDB:', error);
      }
    } else {
      console.log('allready have this transaction');
      res.status(400).json({
        message: 'allready have this transaction',
      });
    }
  }

  return null;

  res.send('bKash Response Sent!');
};
