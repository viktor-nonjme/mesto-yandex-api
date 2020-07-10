const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  const { jwt: token } = req.cookies;
  if (!jwt) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(token, 'dev-secret');
  }
  catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};
