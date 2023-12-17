const UserModel = require('../../models/User');
const bcrypt = require('bcryptjs');

const userSignUpController = async (req, res) => {
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
};

module.exports = userSignUpController;
