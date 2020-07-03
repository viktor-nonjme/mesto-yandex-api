const mongoose = require('mongoose');
const validator = require('validator');

const User = new mongoose.Schema({
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

module.exports = mongoose.model('user', User);
