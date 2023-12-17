const userSignUpController = require('./userSignUpController');
const userLogInController = require('./userLogInController');

module.exports = {
  signup: userSignUpController,
  login: userLogInController
};
