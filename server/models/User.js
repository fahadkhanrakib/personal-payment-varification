const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountBalance:{
    type: Number,
    default: 0,
  },
  transactions: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Transaction'
    }
    ]
});

const User = new mongoose.model('User', UserSchema);

module.exports = User;
