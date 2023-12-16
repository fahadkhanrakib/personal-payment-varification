const express = require('express');
const UserModel = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userRouter = express.Router();

userRouter.post('/signup', async (req, res) => {
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new UserModel({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json({
      message: 'Registration Complete',
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Registration Failed',
    });
  }
});

userRouter.post('/login', async (req, res) => {
  try {
    const user = await UserModel.find({ username: req.body.username });

    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);

      if (isValidPassword) {
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '30d',
          },
        );

        res.status(200).json({
          access_token: token,
          message: 'login successful!',
        });
      } else {
        res.status(401).json({
          message: 'Authentication Failed',
        });
      }
    } else {
      res.status(401).json({
        message: 'Authentication Failed',
      });
    }
  } catch {
    res.status(401).json({
      message: 'Authentication Failed',
    });
  }
});

module.exports = userRouter;
