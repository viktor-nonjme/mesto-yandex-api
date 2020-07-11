const checkPassword = (req, res, next) => {
  const { password } = req.body;
  if (!password || !password.trim()) {
    res.status(400).send({ message: 'Пароль должен быть заполнен' });
  }
  else {
    next();
  }
};

module.exports = checkPassword;
