const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  wallet: {
    type: String,
    lowercase: true,
    required: true,
  },
  operationType: {
    type: String,
    lowercase: true,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  reference: {
    type: String,
    required: false,
  },
  fee: {
    type: Number,
    required: true,
  },
  mainBalance: {
    type: Number,
    required: true,
  },
  transactionID: {
    type: String,
    uppercase: true,
    required: true,
  },
  transactionDate: {
    type: String,
    required: true,
  },
  transactionTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending',
  },
  senderUser: 
    { 
      type: mongoose.Types.ObjectId,
      ref: 'User' 
    }
    
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;
