const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link, likes } = req.body;
  const idOwner = req.user._id;
  Card.create({
    name, link, owner: idOwner, likes
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
      }
      else {
        res.status(500).send({ message: err.message });
      }
    });
};

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Нет карточки с таким id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        return Card.deleteOne(card);
      }
      return Promise.reject(new Error('Недостаточно прав'));
    })
    .then(() => res.status(200).send({ message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.message === 'Недостаточно прав') {
        return res.status(403).send({ message: 'Недостаточно прав' });
      }
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Невалидный индентификатор' });
      }
      if (err.statusCode === 404) {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

const likeCard = (req, res) => {
  Card.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Нет карточки с таким id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => Card.updateOne(card, { $addToSet: { likes: req.user._id } }, { new: true }))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Невалидный идентификатор' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const dislikeCard = (req, res) => {
  Card.findById(req.params.id)
    .orFail(() => {
      const error = new Error('Нет карточки с таким id');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => Card.updateOne(card, { $pull: { likes: req.user._id } }, { new: true }))
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Невалидный идентификатор' });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard
};
