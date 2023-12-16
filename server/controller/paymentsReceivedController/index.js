const express = require('express');
const bkashController = require('./bkash/bkashController');
const nagadController = require('./nagad/nagadController');

module.exports = {
  payments: async (req, res) => {
    const wallet = req.body.sender;

    if (wallet === 'bKash') {
     return await bkashController(req, res);
    }

    if (wallet === 'NAGAD' || 'Nagad') {
      return await nagadController(req, res);
    }

    res.send('Response Sent!');
  },
};
