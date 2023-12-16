const mongoose = require('mongoose');

const StringCodeSchema = new mongoose.Schema({
  code: {
    type: String,
  },
  expirationTime: {
    type: Date,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
});

const StringCode = mongoose.model('StringCode', StringCodeSchema);

module.exports = StringCode;
