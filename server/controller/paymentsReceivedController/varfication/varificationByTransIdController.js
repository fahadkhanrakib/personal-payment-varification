const TransactionModel = require('../../../models/Transaction');
const UserModel = require('../../../models/User');

const varificationByTransId = async (req, res) => {
  try {
    const transactionID = req.body.transactionID;
    const userId = req.userId;

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

    if (result.modifiedCount === 0) {
      res.status(500).json({
        message: 'Your transaction ID not Valid',
      });
      return;
    }

    const amountInfo = await TransactionModel.findOne({
      transactionID,
      senderUser: userId,
      status: 'verified',
    });
    
    const amount = amountInfo.amount;

    await UserModel.updateOne(
      {
        _id: userId,
      },
      {
        $inc: { accountBalance: amount },
      },
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = varificationByTransId;
