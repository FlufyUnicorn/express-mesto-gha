const Card = require('../models/card');
const {
  NOT_FOUND_ERROR_CODE, DEFAULT_ERROR_CODE, INCORRECT_DATA_ERROR_CODE, SUCCESS_CREATED_CODE,
} = require('../utils/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(SUCCESS_CREATED_CODE).send({ name: card.name, link: card.link, _id: card._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки нет' });
      } else {
        res.send({ message: 'Карточка удалена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
    });
};

const likeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка не найдена' });
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(INCORRECT_DATA_ERROR_CODE).send({ message: 'Переданы невалидные данные' });
      } else {
        res.status(DEFAULT_ERROR_CODE).send({ message: 'Ошибка' });
      }
    });
};

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  dislikeCard,
  likeCard,
};
