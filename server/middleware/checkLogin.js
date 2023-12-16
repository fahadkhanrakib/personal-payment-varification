const jwt = require('jsonwebtoken');

const checkLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const token = authorization.split(' ')[1];
    const { username, userId } = jwt.verify(token, process.env.JWT_SECRET);

    req.username = username;
    req.userId = userId;
    next();
  } catch (err) {
    console.log(err);
    next('authentication failed');
  }
};

module.exports = checkLogin;
