const cardRoute = require('express').Router();
const {
  createCard, deleteCard, getAllCards, likeCard, dislikeCard,
} = require('../controllers/card');
const { validateCardId, validateCard } = require('../utils/validators/cardValidator');

cardRoute.post('/', validateCard, createCard);
cardRoute.delete('/:cardId', validateCardId, deleteCard);
cardRoute.get('/', getAllCards);
cardRoute.put('/:cardId/likes', validateCardId, likeCard);
cardRoute.delete('/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardRoute;
