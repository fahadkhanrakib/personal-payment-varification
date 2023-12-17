const UserModel = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userLogInController = async (req, res) => {
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
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: 'Authentication Failed',
    });
  }
};

module.exports = userLogInController;
