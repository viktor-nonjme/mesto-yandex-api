const mongoose = require('mongoose');
const validator = require('validator');

const Card = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длинна строки 2 символа'],
    maxlength: [30, 'Максимальная длинна строки 30 символов'],
    required: [true, 'Это обязателное поле']
  },
  link: {
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
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: []
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('card', Card);
