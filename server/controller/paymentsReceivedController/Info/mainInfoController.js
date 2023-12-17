const TransactionModel = require('../../../models/Transaction');

const mainInfoController = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({});
    res.status(200).json(transactions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = mainInfoController;
