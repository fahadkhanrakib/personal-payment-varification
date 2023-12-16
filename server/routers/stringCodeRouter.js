const express = require('express');
const StringCodeModel = require('../models/StringCode');
const checkLogin = require('../middleware/checkLogin');

const stringCodeRouter = express.Router();

stringCodeRouter.get('/', checkLogin, async (req, res) => {
  function generateCode() {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
  }
  const code = generateCode();
  const expirationTime = new Date(Date.now() +24* 60 * 60 * 1000);
  const userId = req.userId;

  const newCode = new StringCodeModel({
    code,
    expirationTime,
    userId,
  });

  const result = await newCode.save();

  const timeOutDuration = expirationTime - Date.now();
  setTimeout(() => {
    deleteCode(code);
  }, timeOutDuration);

  const deleteCode = async code => {
    await StringCodeModel.deleteOne({ code });
  };

  res.status(200).json({
    result,
  });
});

module.exports = stringCodeRouter;
