const Card = require('../models/card')

const createCard = (req, res, next) => {
  const {name, link} =req.body
  Card.create({name, link, owner: req.user._id})
    .then(()=>{
      res.send({message: 'Карточка успешно создана'});
    })
    .catch(err => {
      next(err)
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
      next(err)
    })
}

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards)=> {
      res.send(cards)
    })
    .catch(err => {
      next(err)
    })
}

const likeCard = (req, res, next) => {
  const {cardId} = req.params
  Card.findByIdAndUpdate(cardId, {$addToSet: {likes: req.user._id }}, {new: true},)
}

const dislikeCard = (req, res, next) => {
  const {cardId} = req.params
  Card.findByIdAndUpdate(cardId, {$pull: {likes: req.user._id }}, {new: true},)
}

module.exports = {
  createCard,
  getAllCards,
  deleteCard,
  dislikeCard,
  likeCard
}