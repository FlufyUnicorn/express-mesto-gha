const Card = require('../models/card')
const BadRequestError = require("./utils/BadRequestError");
const NotFoundError = require("./utils/NotFoundError");

const createCard = (req, res, next) => {
  const {name, link} = req.body
  Card.create({name, link, owner: req.user._id})
    .then(() => {
      res.send({message: 'Карточка успешно создана'});
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message))
      } else {
        next(err)
      }
    })
}

const deleteCard = (req, res, next) => {
  const {cardId} = req.params
  Card.findByIdAndRemove(cardId)
    .then(card => {
      if (!card) {
        res.send({message: 'Такой карточки нет'})
      }
      res.send({message: 'Карточка удалена'})
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы невалидные данные'))
      } else {
        next(err)
      }
    })
}

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards)
    })
    .catch(err => {
      next(err)
    })
}

const likeCard = (req, res, next) => {
  const {cardId} = req.params
  Card.findByIdAndUpdate(cardId, {$addToSet: {likes: req.user._id}}, {new: true},)
    .then(card => {
      if (!card) {
        return new NotFoundError('Карточка не найдена')
      }
      res.send(card)
    })
    .catch(err => {
      if (err.name === 'CastError') {
      next(new BadRequestError('Переданы невалидные данные'))
      }
      else {
        next(err)
      }
  })
}

const dislikeCard = (req, res, next) => {
  const {cardId} = req.params
  Card.findByIdAndUpdate(cardId, {$pull: {likes: req.user._id}}, {new: true},)
    .then(card => {
      if (!card) {
        return new NotFoundError('Карточка не найдена')
      }
      res.send(card)
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы невалидные данные'))
      }
      else {
        next(err)
      }
    })
}

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  dislikeCard,
  likeCard
}