const cardRoute = require('express').Router();
const {
  createCard, deleteCard, getAllCards, likeCard, dislikeCard,
} = require('../controllers/card');

cardRoute.post('/', createCard);
cardRoute.delete('/:cardId', deleteCard);
cardRoute.get('/', getAllCards);
cardRoute.put('/:cardId/likes', likeCard);
cardRoute.delete('/:cardId/likes', dislikeCard);

module.exports = cardRoute;
