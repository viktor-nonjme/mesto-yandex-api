const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'dev-secret');
      res.cookie('jwt', token, {
        maxAge: 36000 * 24 * 7,
        httpOnly: true,
        sameSite: true
      });
      res.status(200).send({ message: 'Авторизация прошла успешно' });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const {
    password, email, name, about, avatar
  } = req.body;
  bcript.hash(password, 10)
    .then((hash) => User.create({
      password: hash, email, name, about, avatar
    }))
    .then((user) => {
      res.status(201).send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar
      });
    })
    .catch((err) => {
      if (err.message.includes('to be unique')) {
        return res.status(409).send({ message: 'Email уже используется' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Невалидный идентификатор' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateUserName = (req, res) => {
  const { name, about } = req.body;
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      if (user._id.toString() !== req.user._id) {
        return Promise.reject(new Error('Недостаточно прав'));
      }
      return User.updateOne(user, { name, about }, { new: true });
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'Недостаточно прав') {
        return res.status(403).send({ message: 'Недостаточно прав' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Невалидный идентификатор' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Пользователь с таким id не найден');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => {
      if (user._id.toString() !== req.user._id) {
        return Promise.reject(new Error('Недостаточно прав'));
      }
      return User.updateOne(user, { avatar }, { new: true });
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'Недостаточно прав') {
        return res.status(403).send({ message: 'Недостаточно прав' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Невалидный идентификатор' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUserName,
  updateAvatar,
  login
};
