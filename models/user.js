const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const isEmail = require('../node_modules/validator/lib/isEmail');

const User = new mongoose.Schema({
  password: {
    type: String,
    minlength: [8, 'Минимальная длинна пароля 8 символов'],
    required: [true, 'Введите пароль'],
    select: false
  },
  email: {
    type: String,
    validate: (email) => isEmail(email),
    unique: [true, 'Этот email уже используется'],
    required: [true, 'Введите email']
  },
  name: {
    type: String,
    minlength: [2, 'Минимальная длинна строки 2 символа'],
    maxlength: [30, 'Максимальная длинна строки 30 символов'],
    required: [true, 'Это обязателное поле']
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длинна строки 2 символа'],
    maxlength: [30, 'Максимальная длинна строки 30 символов'],
    required: [true, 'Это обязателное поле']
  },
  avatar: {
    type: String,
    validate: {
      validator(link) {
        return validator.isURL(
          link,
          {
            protocols: ['http', 'https', 'ftp'],
            require_tld: true,
            require_protocol: true
          }
        );
      }
    },
    required: [true, 'Это обязателное поле']
  }
});

User.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Не правильный пароль или email'));
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            return Promise.reject(new Error('Не правильный пароль или email'));
          }
          return user;
        });
    });
};

User.plugin(uniqueValidator);

module.exports = mongoose.model('user', User);
