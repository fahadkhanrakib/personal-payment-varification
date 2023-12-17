const TransactionModel = require('../../../../models/Transaction');
const StringCodeModel = require('../../../../models/StringCode');
const UserModel = require('../../../../models/User');
const { format12HourTime, extractInfo } = require('../../../../utilities/utilities');

module.exports = async (req, res) => {
  const wallet = req.body.sender;
  const message = req.body.message;

  const moneyReceivedRegex = message.match(/Money Received.\nAmount/);
  const cashInRegex = message.match(/Cash In Received/);

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
      amount = extractInfo(message, 'Amount: Tk', '\n', 1, 0, 0.0);
      sender = extractInfo(message, 'Sender:', '\n', 1, 0, '');
      reference = extractInfo(message, 'Ref:', '\n', 1, 0, '');
      fee = extractInfo(message, 'Fee Tk', '\n', 1, 1, 0.0);
      mainBalance = extractInfo(message, 'Balance: Tk', '\n', 1, 0, 0.0);
      transactionID = extractInfo(message, 'TxnID:', '\n', 1, 0, '');
      transactionDate = extractInfo(message, mainBalance, ' ', 1, 0, '');
      rawTransactionTime = extractInfo(message, transactionDate, ':', 1, -3);
      transactionTime = format12HourTime(rawTransactionTime);
    } else if (operationType === 'Cash In') {
      amount = extractInfo(message,'Amount: Tk', '\n', 1, 0, 0.0);
      sender = extractInfo(message,'Uddokta:', '\n', 1, 0, '');
      reference = extractInfo(message,'Ref:', '\n', 1, 1, '');
      fee = extractInfo(message,'Fee Tk', '\n', 1, 1, 0.0);
      mainBalance = extractInfo(message,'Balance:', '\n', 1, 0, 0.0);
      transactionID = extractInfo(message,'TxnID:', '\n', 1, 0, '');
      transactionDate = extractInfo(message,mainBalance, ' ', 1, 0, '');
      rawTransactionTime = extractInfo(message,transactionDate, ':', 1, -3);
      transactionTime = format12HourTime(rawTransactionTime);
    }

    const isHasTransId = await TransactionModel.findOne({
      wallet: wallet.toLowerCase(),
      transactionID,
    });

    if (!isHasTransId) {
      const transactionData = new TransactionModel({
        wallet: wallet.toLowerCase(),
        operationType: operationType.toLowerCase(),
        amount: parseFloat(amount),
        sender,
        reference: reference === 'N/A' ? '' : reference,
        fee: parseFloat(fee),
        mainBalance: parseFloat(mainBalance),
        transactionID,
        transactionDate,
        transactionTime,
      });

      try {
        const savedData = await transactionData.save();
        console.log(savedData);

        const findOwner = await StringCodeModel.findOne({ code: savedData.reference }).populate(
          'userId',
          'username',
        );

        if (findOwner) {
          console.log(savedData._id);
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

  res.send('Nagad Response Sent!');
};
