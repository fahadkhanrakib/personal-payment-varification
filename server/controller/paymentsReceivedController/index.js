const express = require('express');
const mainInfoController = require('./Info/mainInfoController');
const varificationController = require('./varfication/varificationByTransIdController');
const bkashController = require('./payments/bkash/bkashController');
const nagadController = require('./payments/nagad/nagadController');

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

  info: async (req, res) => {
    return await mainInfoController(req, res);
  },
  
  varification: async(req,res) =>{
    return await varificationController(req, res)
  }
};
